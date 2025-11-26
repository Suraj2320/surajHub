# SurajHub AWS Deployment - Complete Setup Guide

## 🎯 Prerequisites

### 1. AWS Account Setup
```bash
# Install AWS CLI v2
# macOS: brew install awscli
# Ubuntu: curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && unzip awscliv2.zip && sudo ./aws/install
# Windows: Download from https://aws.amazon.com/cli/

aws --version  # Verify installation
```

### 2. Create IAM User for Deployment
```bash
# Go to AWS Console → IAM → Users → Create User
# Username: github-actions-user
# Attach policies:
# - AmazonEC2ContainerRegistryPowerUser
# - AmazonECS_FullAccess
# - IAMFullAccess
# - SecretsManagerReadWrite

# Create access keys and save securely
```

### 3. Configure AWS CLI
```bash
aws configure
# Enter Access Key ID
# Enter Secret Access Key
# Default region: us-east-1
# Default output format: json
```

---

## 🚀 Step-by-Step Deployment on AWS

### Phase 1: Setup Database (RDS)

```bash
# Create PostgreSQL database on RDS
aws rds create-db-instance \
  --db-instance-identifier surajhub-prod-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.2 \
  --master-username surajhub_admin \
  --master-user-password "YourSecurePassword123!@#" \
  --allocated-storage 20 \
  --storage-type gp2 \
  --publicly-accessible false \
  --db-name surajhub_prod \
  --backup-retention-period 7 \
  --multi-az \
  --enable-cloudwatch-logs-exports '["postgresql"]' \
  --region us-east-1

# Get database endpoint
aws rds describe-db-instances \
  --db-instance-identifier surajhub-prod-db \
  --region us-east-1 \
  --query 'DBInstances[0].Endpoint.Address'

# Create database URL
# postgresql://surajhub_admin:YourSecurePassword123!@#@surajhub-prod-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com:5432/surajhub_prod
```

### Phase 2: Setup ECR (Container Registry)

```bash
# Create ECR repository
aws ecr create-repository \
  --repository-name surajhub \
  --region us-east-1 \
  --image-scan-on-push \
  --encryption-configuration encryptionType=AES

# Get ECR login
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build Docker image
docker build -t surajhub:latest .

# Tag image
docker tag surajhub:latest ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/surajhub:latest

# Push to ECR
docker push ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/surajhub:latest
```

### Phase 3: Setup Secrets Manager

```bash
# Store database URL
aws secretsmanager create-secret \
  --name surajhub/database-url \
  --secret-string "postgresql://surajhub_admin:YourSecurePassword123!@#@surajhub-prod-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com:5432/surajhub_prod" \
  --region us-east-1

# Store session secret
aws secretsmanager create-secret \
  --name surajhub/session-secret \
  --secret-string "$(openssl rand -base64 32)" \
  --region us-east-1

# Store Stripe keys
aws secretsmanager create-secret \
  --name surajhub/stripe-secret-key \
  --secret-string "sk_live_YOUR_ACTUAL_KEY" \
  --region us-east-1

aws secretsmanager create-secret \
  --name surajhub/stripe-public-key \
  --secret-string "pk_live_YOUR_ACTUAL_KEY" \
  --region us-east-1
```

### Phase 4: Setup ECS Cluster

```bash
# Create ECS cluster
aws ecs create-cluster \
  --cluster-name surajhub-prod \
  --capacity-providers FARGATE FARGATE_SPOT \
  --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1 \
  --region us-east-1

# Create VPC and subnets (or use default)
# Note: For production, create private subnets for security
```

### Phase 5: Create CloudWatch Log Group

```bash
aws logs create-log-group \
  --log-group-name /ecs/surajhub \
  --region us-east-1

aws logs put-retention-policy \
  --log-group-name /ecs/surajhub \
  --retention-in-days 30 \
  --region us-east-1
```

### Phase 6: Register ECS Task Definition

Save as `task-definition.json`:

```json
{
  "family": "surajhub",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "surajhub",
      "image": "ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/surajhub:latest",
      "portMappings": [
        {
          "containerPort": 5000,
          "hostPort": 5000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:surajhub/database-url"
        },
        {
          "name": "SESSION_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:surajhub/session-secret"
        },
        {
          "name": "STRIPE_SECRET_KEY",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:surajhub/stripe-secret-key"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/surajhub",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": [
          "CMD-SHELL",
          "curl -f http://localhost:5000/ || exit 1"
        ],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ],
  "executionRoleArn": "arn:aws:iam::ACCOUNT_ID:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::ACCOUNT_ID:role/ecsTaskRole"
}
```

Register the task definition:
```bash
aws ecs register-task-definition \
  --cli-input-json file://task-definition.json \
  --region us-east-1
```

### Phase 7: Create Application Load Balancer

```bash
# Create security group
aws ec2 create-security-group \
  --group-name surajhub-alb-sg \
  --description "SurajHub ALB security group" \
  --region us-east-1

# Allow HTTP/HTTPS
aws ec2 authorize-security-group-ingress \
  --group-name surajhub-alb-sg \
  --protocol tcp --port 80 --cidr 0.0.0.0/0 \
  --region us-east-1

aws ec2 authorize-security-group-ingress \
  --group-name surajhub-alb-sg \
  --protocol tcp --port 443 --cidr 0.0.0.0/0 \
  --region us-east-1

# Create ALB
aws elbv2 create-load-balancer \
  --name surajhub-alb \
  --subnets subnet-12345678 subnet-87654321 \
  --security-groups sg-12345678 \
  --scheme internet-facing \
  --type application \
  --region us-east-1

# Create target group
aws elbv2 create-target-group \
  --name surajhub-tg \
  --protocol HTTP \
  --port 5000 \
  --vpc-id vpc-12345678 \
  --target-type ip \
  --health-check-enabled \
  --health-check-path / \
  --region us-east-1
```

### Phase 8: Create ECS Service

```bash
aws ecs create-service \
  --cluster surajhub-prod \
  --service-name surajhub \
  --task-definition surajhub:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-12345678,subnet-87654321],securityGroups=[sg-12345678],assignPublicIp=DISABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:ACCOUNT_ID:targetgroup/surajhub-tg/1234567890abcdef,containerName=surajhub,containerPort=5000" \
  --region us-east-1
```

### Phase 9: Setup Auto Scaling

```bash
# Register scalable target
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/surajhub-prod/surajhub \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10 \
  --region us-east-1

# Create scaling policy
aws application-autoscaling put-scaling-policy \
  --policy-name cpu-scaling \
  --service-namespace ecs \
  --resource-id service/surajhub-prod/surajhub \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration "TargetValue=70,PredefinedMetricSpecification={PredefinedMetricType=ECSServiceAverageCPUUtilization},ScaleOutCooldown=60,ScaleInCooldown=300" \
  --region us-east-1
```

### Phase 10: Setup GitHub Actions

Add these secrets to GitHub repository (Settings → Secrets):
```
AWS_REGION=us-east-1
AWS_ROLE_ARN=arn:aws:iam::ACCOUNT_ID:role/github-actions-role
ECR_REGISTRY=ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
ECS_CLUSTER=surajhub-prod
ECS_SERVICE=surajhub
```

Push to main branch to trigger deployment:
```bash
git add .
git commit -m "Deploy to AWS"
git push origin main
```

---

## 📊 Monitoring & Logs

### View Application Logs
```bash
aws logs tail /ecs/surajhub --follow
```

### View ECS Service Status
```bash
aws ecs describe-services \
  --cluster surajhub-prod \
  --services surajhub \
  --region us-east-1 \
  --query 'services[0].{status:status,taskCount:runningCount,desiredCount:desiredCount}'
```

### View CPU/Memory Metrics
```bash
aws cloudwatch get-metric-statistics \
  --namespace AWS/ECS \
  --metric-name CPUUtilization \
  --dimensions Name=ServiceName,Value=surajhub Name=ClusterName,Value=surajhub-prod \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 300 \
  --statistics Average,Maximum \
  --region us-east-1
```

---

## 🔄 Database Migrations

Run migrations on deployment:

```bash
# SSH into running task and run migrations
aws ecs execute-command \
  --cluster surajhub-prod \
  --task <TASK_ID> \
  --container surajhub \
  --command "npm run db:push" \
  --interactive \
  --region us-east-1
```

---

## 🚨 Troubleshooting

### Service won't start
1. Check logs: `aws logs tail /ecs/surajhub --follow`
2. Verify secrets are accessible
3. Check database connectivity
4. Review task definition

### High memory usage
1. Increase task memory: Edit task definition
2. Implement pagination in APIs
3. Add caching (Redis)

### Database connection timeout
1. Check RDS security group allows ECS traffic
2. Verify DATABASE_URL is correct
3. Test connection manually

---

## 💰 Cost Optimization

1. Use Fargate Spot (30-70% cheaper)
2. Set min capacity to 1 during off-hours
3. Use Auto Scaling
4. Enable RDS reserved instances
5. Delete unused resources

---

## ✅ Production Checklist

- [ ] Database backups enabled and tested
- [ ] SSL certificates configured (ACM)
- [ ] Route53 DNS records configured
- [ ] CloudWatch alarms set up
- [ ] Log retention policies configured
- [ ] VPC and security groups hardened
- [ ] IAM roles follow least privilege
- [ ] Monitoring dashboard created
- [ ] On-call notifications configured
- [ ] Disaster recovery plan documented

