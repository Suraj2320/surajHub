# SurajHub Quick Start Guide

## 🎯 Local Development (5 minutes)

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### Step 1: Clone & Setup
```bash
git clone https://github.com/yourusername/surajhub.git
cd surajhub
npm install
```

### Step 2: Create Environment Variables
```bash
cp .env.example .env
# Edit .env with your values
```

### Step 3: Start with Docker Compose
```bash
docker-compose up -d
# Wait for services to start (30 seconds)
npm run db:push
```

### Step 4: Visit Application
```bash
# Frontend: http://localhost:5000
# API: http://localhost:3000
```

---

## 🚀 Deploy to AWS (30 minutes)

### Prerequisites
- AWS Account
- AWS CLI configured
- Docker installed

### Step 1: Setup AWS Resources
```bash
# Follow DEPLOYMENT.md for detailed instructions
# Creates: RDS, ECR, ECS, ALB, Auto Scaling
```

### Step 2: Store Secrets in AWS
```bash
aws secretsmanager create-secret \
  --name surajhub/database-url \
  --secret-string "your-database-url"
```

### Step 3: Build & Push Docker Image
```bash
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin YOUR_ECR_URL

docker build -t surajhub:latest .
docker tag surajhub:latest YOUR_ECR_URL/surajhub:latest
docker push YOUR_ECR_URL/surajhub:latest
```

### Step 4: Deploy with GitHub Actions
```bash
git add .
git commit -m "Deploy to AWS"
git push origin main
# Deployment happens automatically!
```

---

## 📚 Key Commands

### Local Development
```bash
npm run dev          # Start frontend + backend
npm test            # Run tests
npm run lint        # Check code quality
npm run db:studio   # View database visually
```

### Database
```bash
npm run db:push     # Apply schema changes
npm run db:seed     # Seed test data
```

### Docker
```bash
docker build -t surajhub .
docker run -p 5000:5000 surajhub
```

### Kubernetes (if using EKS)
```bash
kubectl apply -f kubernetes/
kubectl get pods -n surajhub
kubectl logs -n surajhub -l app=surajhub
```

---

## 🔍 Testing API Endpoints

### Signup
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

### Get Products
```bash
curl http://localhost:3000/api/products?limit=10&page=1
```

---

## 📋 Project Structure

```
surajhub/
├── client/              # React frontend
├── server/              # Express backend
├── shared/              # Shared types & schemas
├── kubernetes/          # K8s manifests
├── .github/workflows/   # CI/CD pipelines
├── Dockerfile           # Docker image
├── docker-compose.yml   # Multi-container setup
└── DEPLOYMENT.md        # AWS deployment guide
```

---

## 🆘 Troubleshooting

### Port already in use
```bash
# Change port in .env
PORT=3001
npm run dev
```

### Database connection error
```bash
# Check PostgreSQL is running
docker ps | grep postgres
# Restart services
docker-compose down && docker-compose up
```

### Module not found
```bash
npm ci  # Clean install
npm run db:push  # Sync schema
```

---

## 📖 Documentation Files

- `README.md` - Project overview
- `client/README.md` - Frontend architecture
- `server/README.md` - Backend APIs
- `DEPLOYMENT.md` - AWS deployment steps
- `AWS_SETUP.md` - AWS infrastructure setup
- `DEVOPS_INTERVIEW_QA.md` - Interview questions
- `PROJECT_STRUCTURE.md` - Complete project guide

---

## 🎓 Learn More

- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [AWS Documentation](https://docs.aws.amazon.com/)

---

## 💬 Support

- Email: support@surajhub.com
- Phone: 1800-123-4567
- Documentation: See `/support` page
- GitHub Issues: Report bugs here

