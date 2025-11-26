# SurajHub Deployment Guide

## AWS Deployment Architecture

### Infrastructure Overview
- **Container Registry**: Amazon ECR (Elastic Container Registry)
- **Container Orchestration**: ECS Fargate or EKS (Kubernetes)
- **Load Balancer**: Application Load Balancer (ALB)
- **Database**: Amazon RDS PostgreSQL
- **Cache**: Amazon ElastiCache (Redis)
- **CDN**: CloudFront
- **Monitoring**: CloudWatch

---

## Prerequisites

### Required Tools
```bash
# AWS CLI v2
aws --version

# Docker
docker --version

# kubectl (for EKS)
kubectl version --client

# helm (for Kubernetes package management)
helm version
```

### AWS Account Setup
1. Create AWS account
2. Create IAM user with permissions:
   - ECR (Elastic Container Registry)
   - ECS (Elastic Container Service) or EKS (Elastic Kubernetes Service)
   - RDS (Relational Database Service)
   - ElastiCache
   - CloudWatch
   - Application Load Balancer

3. Configure AWS credentials:
```bash
aws configure
# Enter: Access Key ID, Secret Access Key, Default Region (us-east-1), Output format (json)
```

---

## Deployment Options

### Option 1: ECS Fargate (Recommended for Quick Start)

#### Step 1: Create ECR Repository
```bash
aws ecr create-repository \
  --repository-name surajhub \
  --region us-east-1
```

#### Step 2: Build & Push Docker Image
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build image
docker build -t surajhub:latest .

# Tag image
docker tag surajhub:latest ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/surajhub:latest

# Push to ECR
docker push ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/surajhub:latest
```

#### Step 3: Create RDS PostgreSQL Database
```bash
aws rds create-db-instance \
  --db-instance-identifier surajhub-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.2 \
  --master-username admin \
  --master-user-password YourSecurePassword123 \
  --allocated-storage 20 \
  --storage-type gp2 \
  --publicly-accessible false \
  --db-name surajhub
```

#### Step 4: Create ECS Cluster
```bash
aws ecs create-cluster --cluster-name surajhub-cluster
```

#### Step 5: Create ECS Task Definition
Create `task-definition.json`:
```json
{
  "family": "surajhub-task",
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
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:surajhub/db-url"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/surajhub",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

Register task definition:
```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

#### Step 6: Create ECS Service
```bash
aws ecs create-service \
  --cluster surajhub-cluster \
  --service-name surajhub-service \
  --task-definition surajhub-task:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=surajhub,containerPort=5000
```

---

### Option 2: EKS (Kubernetes)

#### Step 1: Create EKS Cluster
```bash
eksctl create cluster \
  --name surajhub-cluster \
  --version 1.27 \
  --region us-east-1 \
  --nodegroup-name surajhub-nodes \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 1 \
  --nodes-max 5
```

#### Step 2: Configure kubectl
```bash
aws eks update-kubeconfig \
  --region us-east-1 \
  --name surajhub-cluster
```

#### Step 3: Apply Kubernetes Manifests
```bash
# Create namespace
kubectl apply -f kubernetes/namespace.yaml

# Create secrets and configmaps
kubectl apply -f kubernetes/secret.yaml
kubectl apply -f kubernetes/configmap.yaml

# Deploy application
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
kubectl apply -f kubernetes/ingress.yaml
```

#### Step 4: Verify Deployment
```bash
# Check pods
kubectl get pods -n surajhub

# Check service
kubectl get svc -n surajhub

# View logs
kubectl logs -n surajhub -l app=surajhub -f
```

---

## CI/CD Pipeline Setup

### GitHub Actions
The `.github/workflows/deploy.yml` file automates:
1. **Lint & Test** - Run on every PR
2. **Build & Push** - Build Docker image and push to ECR
3. **Deploy to AWS** - Automatically deploy to ECS/EKS on main branch merge

### Configure GitHub Secrets
Go to Repository Settings → Secrets → New repository secret:
- `AWS_ROLE_ARN` - IAM role for GitHub Actions
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key

---

## Environment Variables (AWS Secrets Manager)

Store sensitive data in AWS Secrets Manager:
```bash
aws secretsmanager create-secret \
  --name surajhub/db-url \
  --secret-string "postgresql://user:pass@host:5432/surajhub"

aws secretsmanager create-secret \
  --name surajhub/stripe-key \
  --secret-string "sk_live_xxx"
```

---

## Monitoring & Logging

### CloudWatch Logs
View application logs:
```bash
aws logs tail /ecs/surajhub --follow
```

### CloudWatch Metrics
- CPU Utilization
- Memory Usage
- Request Count
- Error Rate
- Latency

### Set Up Alarms
```bash
aws cloudwatch put-metric-alarm \
  --alarm-name surajhub-high-cpu \
  --alarm-description "Alert when CPU > 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

---

## Scaling

### Auto Scaling (ECS)
```bash
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/surajhub-cluster/surajhub-service \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10
```

### Auto Scaling (EKS)
```bash
kubectl apply -f - <<EOF
apiVersion: autoscaling.k8s.io/v2
kind: HorizontalPodAutoscaler
metadata:
  name: surajhub-hpa
  namespace: surajhub
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: surajhub-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
EOF
```

---

## Database Migrations

Run migrations before/after deployment:
```bash
# In ECS task
aws ecs execute-command \
  --cluster surajhub-cluster \
  --task <TASK_ID> \
  --container surajhub \
  --command "npm run db:push"
```

---

## Troubleshooting

### Application won't start
1. Check logs: `aws logs tail /ecs/surajhub --follow`
2. Verify environment variables are set
3. Check database connectivity
4. Verify secrets are accessible

### Database connection errors
```bash
# Test connection
psql -h <RDS_ENDPOINT> -U admin -d surajhub
```

### High memory usage
1. Increase task memory in ECS
2. Increase resource limits in Kubernetes
3. Implement caching (Redis)

---

## Cost Optimization

1. Use Fargate Spot for non-critical environments
2. Set up auto-scaling with min replicas = 1
3. Use RDS Reserved Instances for production
4. Enable CloudFront caching for static assets
5. Clean up unused resources regularly

---

## Next Steps

1. Set up SSL certificates (AWS Certificate Manager)
2. Configure Route53 for DNS
3. Set up backup strategy for RDS
4. Implement disaster recovery plan
5. Set up performance monitoring with X-Ray
6. Configure WAF for DDoS protection

