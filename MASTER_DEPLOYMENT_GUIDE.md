# 🚀 SurajHub - Master Deployment & Setup Guide

**Your Complete Step-by-Step Guide to Deploy SurajHub on AWS**

---

## 📋 Table of Contents
1. [Prerequisites & Setup](#prerequisites)
2. [Local Development (5 minutes)](#local-development)
3. [AWS Infrastructure Setup (30 minutes)](#aws-setup)
4. [Deployment to Production (15 minutes)](#deployment)
5. [Monitoring & Troubleshooting](#monitoring)
6. [Frequently Asked Questions](#faq)

---

## Prerequisites

### System Requirements
- **Operating System**: Linux, macOS, or Windows (with WSL2)
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: 10GB free space

### Required Tools (Install in order)

#### 1️⃣ Git
```bash
# macOS
brew install git

# Ubuntu/Debian
sudo apt-get install git

# Windows: Download from https://git-scm.com/download/win
```

#### 2️⃣ Node.js 18+
```bash
# macOS
brew install node@18

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should be v18.x.x
npm --version   # Should be 8.x.x+
```

#### 3️⃣ Docker & Docker Compose
```bash
# macOS: Download Docker Desktop from https://www.docker.com/products/docker-desktop
# Ubuntu: 
sudo apt-get install docker.io docker-compose

# Verify installation
docker --version
docker-compose --version
```

#### 4️⃣ AWS CLI
```bash
# macOS
brew install awscli

# Ubuntu/Debian
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Verify installation
aws --version
```

#### 5️⃣ kubectl (for Kubernetes)
```bash
# macOS
brew install kubectl

# Ubuntu/Debian
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Verify installation
kubectl version --client
```

---

## 🏠 Local Development

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/surajhub.git
cd surajhub
```

### Step 2: Setup Environment Variables
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your values (for local dev, defaults work fine)
cat .env
```

**Expected .env content:**
```
DATABASE_URL=postgresql://surajhub:surajhub_secure_password@postgres:5432/surajhub
SESSION_SECRET=your_random_session_secret_min_32_chars
STRIPE_SECRET_KEY=sk_test_xxx  (leave empty for local dev)
STRIPE_PUBLIC_KEY=pk_test_xxx  (leave empty for local dev)
NODE_ENV=development
```

### Step 3: Install Dependencies
```bash
npm ci  # Clean install (better than npm install)
```

### Step 4: Start with Docker Compose
```bash
# Start all services (PostgreSQL, Redis, Application)
docker-compose up -d

# Wait 30 seconds for services to start
sleep 30

# Initialize database
npm run db:push

# Verify services are running
docker-compose ps
# You should see 3 containers: surajhub-db, surajhub-redis, surajhub-app
```

### Step 5: Start Development Server
```bash
npm run dev

# Output should show:
# ✓ Frontend: http://localhost:5000
# ✓ API: http://localhost:3000
```

### Step 6: Test Application
Open browser and visit:
- **Homepage**: http://localhost:5000
- **API Health**: http://localhost:3000/api/products
- **Admin Panel**: http://localhost:5000/admin (if logged in as admin)

### ✅ Local Development Checklist
- [ ] Docker containers running: `docker ps`
- [ ] Database initialized: `npm run db:push`
- [ ] Frontend loads at http://localhost:5000
- [ ] Can see products on homepage
- [ ] Signup/Login works
- [ ] Can add items to cart

---

## ☁️ AWS Setup

### Phase 1: Create AWS Account

1. Go to https://aws.amazon.com
2. Click "Create AWS Account"
3. Fill in email, password, account name
4. Verify email
5. Add payment method
6. Choose support plan (free tier)

### Phase 2: Create IAM User

**Why?** AWS recommends never using root account. Create dedicated user for deployment.

```bash
# Open AWS Console → IAM → Users → Create User
# User name: surajhub-deployment
# Enable console access: YES
# Create custom password: YES (save it)
```

**Attach Permissions:**
1. Go to User → Add Permissions
2. Attach these policies:
   - `AmazonEC2ContainerRegistryPowerUser` (for ECR)
   - `AmazonECS_FullAccess` (for ECS)
   - `AmazonRDSFullAccess` (for RDS)
   - `AWSSecretsManagerFullAccess` (for Secrets Manager)

**Create Access Keys:**
1. Go to User → Security Credentials
2. Create Access Key
3. Choose "Command Line Interface (CLI)"
4. Download CSV file (KEEP SAFE!)

### Phase 3: Configure AWS CLI

```bash
aws configure

# When prompted:
# AWS Access Key ID: [paste from CSV]
# AWS Secret Access Key: [paste from CSV]
# Default region name: us-east-1
# Default output format: json
```

**Verify setup:**
```bash
aws sts get-caller-identity
# Should output your AWS account info
```

### Phase 4: Create RDS Database

```bash
# Create PostgreSQL database
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
  --region us-east-1

# Wait 5-10 minutes for database to be created
# Check status:
aws rds describe-db-instances \
  --db-instance-identifier surajhub-prod-db \
  --region us-east-1 \
  --query 'DBInstances[0].DBInstanceStatus'
# Should show: "available"

# Get database endpoint:
aws rds describe-db-instances \
  --db-instance-identifier surajhub-prod-db \
  --region us-east-1 \
  --query 'DBInstances[0].Endpoint.Address'
# Save this endpoint! Format: surajhub-prod-db.xxxxxx.us-east-1.rds.amazonaws.com
```

### Phase 5: Create ECR Repository

```bash
# Create container registry
aws ecr create-repository \
  --repository-name surajhub \
  --region us-east-1

# Output example:
# {
#   "repository": {
#     "repositoryUri": "123456789.dkr.ecr.us-east-1.amazonaws.com/surajhub"
#   }
# }
# Save this URI!
```

### Phase 6: Create Secrets

```bash
# Database URL secret
aws secretsmanager create-secret \
  --name surajhub/database-url \
  --secret-string "postgresql://surajhub_admin:YourSecurePassword123!@#@surajhub-prod-db.xxxxxx.us-east-1.rds.amazonaws.com:5432/surajhub_prod" \
  --region us-east-1

# Session secret (generate random 32+ char string)
aws secretsmanager create-secret \
  --name surajhub/session-secret \
  --secret-string "$(openssl rand -base64 32)" \
  --region us-east-1

# Stripe keys (optional, leave empty if testing)
aws secretsmanager create-secret \
  --name surajhub/stripe-secret-key \
  --secret-string "sk_live_YOUR_KEY_HERE" \
  --region us-east-1

aws secretsmanager create-secret \
  --name surajhub/stripe-public-key \
  --secret-string "pk_live_YOUR_KEY_HERE" \
  --region us-east-1
```

---

## 🚀 Deployment to Production

### Step 1: Build Docker Image

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Get your account ID:
aws sts get-caller-identity --query Account --output text

# Build image
docker build -t surajhub:latest .

# Tag image for ECR
docker tag surajhub:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/surajhub:latest

# Push to ECR
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/surajhub:latest

# Verify:
aws ecr describe-images \
  --repository-name surajhub \
  --region us-east-1
```

### Step 2: Setup GitHub Secrets (for CI/CD)

1. Go to GitHub Repository → Settings → Secrets
2. Add these secrets:

| Secret Name | Value |
|---|---|
| AWS_REGION | us-east-1 |
| AWS_ACCOUNT_ID | YOUR_ACCOUNT_ID |
| AWS_ACCESS_KEY_ID | From CSV file |
| AWS_SECRET_ACCESS_KEY | From CSV file |

### Step 3: Deploy via GitHub Actions

```bash
# Make a change and push
git add .
git commit -m "Deploy to production"
git push origin main

# Watch deployment:
# 1. Go to GitHub → Actions tab
# 2. Click on running workflow
# 3. Watch logs in real-time
```

**Deployment stages:**
1. ✅ Lint - Check code quality (2 min)
2. ✅ Build - Build Docker image (3 min)
3. ✅ Test - Run tests (2 min)
4. ✅ Push - Push to ECR (1 min)
5. ✅ Deploy - Update ECS (2 min)

### Step 4: Verify Deployment

```bash
# Check ECS service status
aws ecs describe-services \
  --cluster surajhub-prod \
  --services surajhub \
  --region us-east-1 \
  --query 'services[0].{status:status,taskCount:runningCount,desiredCount:desiredCount}'

# Expected output:
# {
#   "status": "ACTIVE",
#   "taskCount": 2,
#   "desiredCount": 2
# }

# View application logs
aws logs tail /ecs/surajhub --follow --region us-east-1
```

---

## 📊 Monitoring & Maintenance

### Daily Tasks
```bash
# Check service health
aws ecs describe-services \
  --cluster surajhub-prod \
  --services surajhub \
  --region us-east-1

# View error logs
aws logs tail /ecs/surajhub --filter-pattern "ERROR" --region us-east-1

# Check database connections
# (Connect to RDS and run): SELECT count(*) FROM pg_stat_activity;
```

### Weekly Tasks
- Review CloudWatch metrics (CPU, Memory, Requests)
- Check backup completion
- Review error logs for patterns

### Monthly Tasks
- Update dependencies
- Review security policies
- Analyze performance metrics
- Plan capacity upgrades

---

## ❓ FAQ

### Q: How do I rollback a deployment?
```bash
aws ecs update-service \
  --cluster surajhub-prod \
  --service surajhub \
  --task-definition surajhub:PREVIOUS_VERSION \
  --region us-east-1
```

### Q: How do I scale the service?
```bash
aws ecs update-service \
  --cluster surajhub-prod \
  --service surajhub \
  --desired-count 5 \
  --region us-east-1
```

### Q: How do I check database backups?
```bash
aws rds describe-db-snapshots \
  --region us-east-1 \
  --query 'DBSnapshots[*].[DBSnapshotIdentifier,CreateTime,Status]'
```

### Q: Service won't start - what to do?
1. Check logs: `aws logs tail /ecs/surajhub --follow`
2. Verify secrets: `aws secretsmanager list-secrets --region us-east-1`
3. Check database connection
4. Rollback to previous version

### Q: How do I update environment variables?
```bash
# Update secret
aws secretsmanager update-secret \
  --secret-id surajhub/database-url \
  --secret-string "new_value" \
  --region us-east-1

# Restart service to apply
aws ecs update-service \
  --cluster surajhub-prod \
  --service surajhub \
  --force-new-deployment \
  --region us-east-1
```

---

## 🆘 Emergency Contacts & Support

- **Email**: support@surajhub.com
- **Phone**: +1-800-123-4567
- **Documentation**: See /support page
- **GitHub Issues**: Report bugs

---

## ✅ Deployment Completed!

Your SurajHub platform is now running on AWS! 🎉

**Next Steps:**
1. ✅ Configure custom domain in Route53
2. ✅ Setup SSL certificates with ACM
3. ✅ Enable CloudFront CDN
4. ✅ Configure backup strategy
5. ✅ Setup monitoring alerts

