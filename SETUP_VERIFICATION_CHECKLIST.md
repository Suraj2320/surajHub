# ✅ SurajHub Setup Verification Checklist

Use this checklist to verify every component is working correctly before deployment.

---

## 🔧 Prerequisites Verification

### System & Tools
```bash
# Verify Node.js
node --version           # Should be v18.x.x or higher
npm --version            # Should be 8.x.x or higher

# Verify Docker
docker --version         # Should show version
docker-compose --version # Should show version

# Verify Git
git --version            # Should show version

# Verify AWS CLI
aws --version            # Should show version
aws sts get-caller-identity  # Should show your AWS account
```

**✅ Checklist:**
- [ ] Node.js 18+ installed
- [ ] npm 8+ installed
- [ ] Docker installed and running
- [ ] Docker Compose installed
- [ ] Git configured
- [ ] AWS CLI configured with credentials

---

## 📦 Frontend Verification

### Install & Build
```bash
# Navigate to project
cd surajhub

# Install dependencies
npm ci

# Verify no vulnerabilities
npm audit  # Should show 0 vulnerabilities (or low risk only)

# Build frontend
npm run build  # Should complete without errors
```

**✅ Checklist:**
- [ ] npm ci completes successfully
- [ ] No critical vulnerabilities (npm audit)
- [ ] npm run build succeeds
- [ ] dist/ folder created with ~500KB+ of files

### Frontend Files Check
```bash
# Verify key frontend files exist
ls -la client/src/
ls -la client/src/pages/
ls -la client/src/components/layout/
```

**✅ Key Files Must Exist:**
- [ ] client/src/App.jsx ✓
- [ ] client/src/pages/Home.jsx ✓
- [ ] client/src/pages/Landing.jsx ✓
- [ ] client/src/pages/Login.jsx ✓
- [ ] client/src/pages/Signup.jsx ✓
- [ ] client/src/pages/Category.jsx ✓
- [ ] client/src/pages/ProductDetail.jsx ✓
- [ ] client/src/pages/Cart.jsx ✓
- [ ] client/src/pages/Checkout.jsx ✓
- [ ] client/src/components/layout/Navbar.jsx ✓
- [ ] client/src/components/layout/Footer.jsx ✓

---

## 🗄️ Backend Verification

### Database Schema
```bash
# Check schema file
cat shared/schema.ts | head -100

# Should contain:
# - users table ✓
# - products table ✓
# - categories table ✓
# - orders table ✓
# - addresses table ✓
# - cartItems table ✓
# - reviews table ✓
```

**✅ Database Tables:**
- [ ] users table defined
- [ ] products table defined
- [ ] categories table defined
- [ ] orders table defined
- [ ] addresses table defined
- [ ] cart/cartItems table defined
- [ ] sessions table defined

### Backend Files Check
```bash
# Verify key backend files exist
ls -la server/
```

**✅ Key Files Must Exist:**
- [ ] server/routes.ts ✓
- [ ] server/storage.ts ✓
- [ ] server/db.ts ✓
- [ ] server/app.ts ✓
- [ ] server/index-dev.ts ✓
- [ ] server/index-prod.ts ✓

### API Routes Check
```bash
# Verify routes.ts contains key endpoints
grep -E "post.*auth|get.*products|post.*checkout" server/routes.ts

# Should show:
# - Auth endpoints (signup, login, logout) ✓
# - Product endpoints (get products, product by ID) ✓
# - Cart endpoints ✓
# - Order endpoints ✓
# - User endpoints ✓
```

**✅ Backend Routes:**
- [ ] POST /api/auth/signup exists
- [ ] POST /api/auth/login exists
- [ ] POST /api/auth/logout exists
- [ ] GET /api/products exists
- [ ] GET /api/products/:id exists
- [ ] GET /api/categories exists
- [ ] POST /api/orders exists

---

## 🐳 Docker Verification

### Docker Files Check
```bash
# Verify Docker files exist
ls -la Dockerfile
ls -la docker-compose.yml
ls -la .dockerignore
```

**✅ Docker Files:**
- [ ] Dockerfile exists with multi-stage build
- [ ] docker-compose.yml exists with all services
- [ ] .dockerignore exists

### Docker Build Test
```bash
# Build Docker image
docker build -t surajhub:test .

# Should complete without errors and show:
# Successfully tagged surajhub:test

# Clean up
docker rmi surajhub:test
```

**✅ Docker Build:**
- [ ] Docker builds successfully
- [ ] Final image size is reasonable (~200-300MB)
- [ ] No error messages

### Docker Compose Test
```bash
# Start services
docker-compose up -d

# Wait 30 seconds
sleep 30

# Verify all containers running
docker-compose ps

# Should show:
# - surajhub-db (postgres) - Up
# - surajhub-redis (redis) - Up
# - surajhub-app (app) - Up

# Check logs
docker-compose logs app

# Should show: "Server running on port 5000"

# Stop services
docker-compose down -v
```

**✅ Docker Compose:**
- [ ] docker-compose up succeeds
- [ ] All 3 containers start (postgres, redis, app)
- [ ] No critical errors in logs
- [ ] Services stop cleanly with docker-compose down

---

## 🌐 Application Test

### Start Local Development
```bash
# Copy environment
cp .env.example .env

# Start services
docker-compose up -d

# Initialize database
npm run db:push

# Start dev server
npm run dev

# Wait for output showing:
# ✓ Frontend: http://localhost:5000
# ✓ API: http://localhost:3000
```

### Test Frontend
```bash
# In another terminal, test endpoints
curl http://localhost:5000/     # Homepage
curl http://localhost:3000/api/products  # API

# Should return 200 status and data
```

**✅ Frontend Tests:**
- [ ] Homepage loads at http://localhost:5000
- [ ] No JavaScript errors in browser console
- [ ] SurajHub logo displays correctly
- [ ] Navigation bar renders
- [ ] Products display on homepage
- [ ] Cart button visible in navbar
- [ ] User menu visible (Sign In button)

### Test API
```bash
# Test health check
curl -s http://localhost:3000/api/products | jq '.'

# Test auth signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }' | jq '.'

# Test auth login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }' | jq '.'
```

**✅ API Tests:**
- [ ] GET /api/products returns array of products
- [ ] POST /api/auth/signup creates user successfully
- [ ] POST /api/auth/login authenticates user
- [ ] POST /api/auth/logout clears session
- [ ] GET /api/categories returns categories
- [ ] All endpoints return proper JSON

### Test Database
```bash
# Connect to database
docker-compose exec postgres psql -U surajhub -d surajhub -c "SELECT COUNT(*) FROM users;"

# Should return count of users created in testing
```

**✅ Database Tests:**
- [ ] Can connect to PostgreSQL
- [ ] Users table has test data
- [ ] Products table has data
- [ ] Categories table has data

---

## 📝 Configuration Files Verification

### Environment Variables
```bash
# Verify .env file exists
ls -la .env

# Verify .env.example exists
ls -la .env.example

# Verify production.env.example exists
ls -la production.env.example
```

**✅ Environment Files:**
- [ ] .env exists and is in .gitignore
- [ ] .env.example exists
- [ ] production.env.example exists
- [ ] All required variables documented

### Package.json Scripts
```bash
# Verify key scripts exist
grep -E "\"dev\"|\"build\"|\"db:push\"|\"db:studio\"" package.json
```

**✅ Scripts:**
- [ ] npm run dev works
- [ ] npm run build works
- [ ] npm run db:push works
- [ ] npm run db:studio works

---

## ☁️ AWS Prerequisites Verification

### AWS Account Setup
```bash
# Verify AWS CLI access
aws sts get-caller-identity

# Should show:
# {
#   "UserId": "...",
#   "Account": "123456789",
#   "Arn": "arn:aws:iam::123456789:user/..."
# }
```

**✅ AWS Setup:**
- [ ] AWS CLI configured
- [ ] AWS credentials valid
- [ ] Can call AWS services

### AWS Permissions Check
```bash
# Verify IAM user has required permissions
# Required policies:
# - AmazonEC2ContainerRegistryPowerUser
# - AmazonECS_FullAccess
# - AmazonRDSFullAccess
# - AWSSecretsManagerFullAccess

# List attached policies
aws iam list-attached-user-policies --user-name YOUR_USERNAME
```

**✅ AWS Permissions:**
- [ ] ECR permissions configured
- [ ] ECS permissions configured
- [ ] RDS permissions configured
- [ ] Secrets Manager permissions configured

---

## 📚 Documentation Verification

### Deployment Guides Check
```bash
# Verify all deployment guides exist
ls -la DEPLOYMENT.md
ls -la AWS_SETUP.md
ls -la QUICK_START_GUIDE.md
ls -la MASTER_DEPLOYMENT_GUIDE.md
ls -la PRODUCTION_CHECKLIST.md
ls -la DEVOPS_INTERVIEW_QA.md
ls -la NODE_EXPRESS_BEST_PRACTICES.md
ls -la DOCKER_KUBERNETES_GUIDE.md
```

**✅ Documentation:**
- [ ] DEPLOYMENT.md exists
- [ ] AWS_SETUP.md exists
- [ ] QUICK_START_GUIDE.md exists
- [ ] MASTER_DEPLOYMENT_GUIDE.md exists
- [ ] PRODUCTION_CHECKLIST.md exists
- [ ] DEVOPS_INTERVIEW_QA.md exists
- [ ] NODE_EXPRESS_BEST_PRACTICES.md exists
- [ ] DOCKER_KUBERNETES_GUIDE.md exists

### Kubernetes Files Check
```bash
# Verify Kubernetes manifests
ls -la kubernetes/
```

**✅ Kubernetes Files:**
- [ ] kubernetes/namespace.yaml
- [ ] kubernetes/deployment.yaml
- [ ] kubernetes/service.yaml
- [ ] kubernetes/configmap.yaml
- [ ] kubernetes/secret.yaml
- [ ] kubernetes/ingress.yaml

### CI/CD Pipeline Check
```bash
# Verify GitHub Actions workflow
ls -la .github/workflows/deploy.yml
```

**✅ CI/CD:**
- [ ] .github/workflows/deploy.yml exists
- [ ] Pipeline includes lint, build, test, push steps

---

## 🎯 Final Sign-Off

### Completion Checklist

Run this final verification:
```bash
# Clean stop
docker-compose down -v

# Restart fresh
docker-compose up -d
npm run db:push
npm run dev

# In browser, verify:
# 1. http://localhost:5000 - Homepage loads ✓
# 2. Create account - Sign up works ✓
# 3. Login - Can authenticate ✓
# 4. Browse products - Products display ✓
# 5. Add to cart - Cart functionality ✓
# 6. Admin panel - /admin accessible ✓
```

**✅ FINAL SIGN-OFF:**
- [ ] Frontend loads correctly
- [ ] Authentication works (signup/login)
- [ ] Products display properly
- [ ] Cart functionality works
- [ ] Database synced successfully
- [ ] Docker containers running smoothly
- [ ] No console errors
- [ ] API endpoints responding
- [ ] Documentation complete
- [ ] Ready for AWS deployment

---

## ⚠️ If Tests Fail

See TROUBLESHOOTING.md for:
- Module not found errors
- Database connection issues
- Docker container failures
- API endpoint problems
- Authentication issues

**You are now ready to deploy to AWS! 🚀**

