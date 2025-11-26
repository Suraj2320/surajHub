# 🛠️ SurajHub Troubleshooting Guide

## Common Issues & Solutions

### 1️⃣ Module Not Found Errors

**Error:** `Cannot find module '@/components/ui/...'`

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm ci

# Rebuild
npm run build
```

---

### 2️⃣ Database Connection Failed

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solution:**
```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart database
docker-compose down -v
docker-compose up -d
sleep 30

# Reinitialize database
npm run db:push
```

---

### 3️⃣ Docker Compose Won't Start

**Error:** `docker: command not found` or containers exit immediately

**Solution:**
```bash
# Verify Docker is running
docker ps

# If Docker not running:
# macOS: Open Docker Desktop application
# Linux: sudo systemctl start docker

# Check .env file exists
ls -la .env

# Rebuild containers
docker-compose down -v
docker-compose up -d --build
```

---

### 4️⃣ Port Already in Use

**Error:** `Error: listen EADDRINUSE :::5000`

**Solution:**
```bash
# Option 1: Find and kill process using port 5000
# Linux/macOS:
lsof -i :5000
kill -9 <PID>

# Option 2: Change port in .env
# Add to .env: PORT=3001

# Option 3: Use Docker (automatically isolates ports)
docker-compose down
docker-compose up -d
```

---

### 5️⃣ npm run build Fails

**Error:** Build process exits with error

**Solution:**
```bash
# Check for TypeScript errors
npm run build 2>&1 | grep error

# Clear build cache
rm -rf dist/ .vite

# Retry build
npm run build

# If still failing, check for syntax errors in source files
npm run lint
```

---

### 6️⃣ API Endpoints Not Responding

**Error:** `POST /api/auth/signup returns 404`

**Solution:**
```bash
# Check if backend is running
curl http://localhost:3000/api/products

# Verify routes.ts has endpoint
grep -n "api/auth/signup" server/routes.ts

# Restart development server
npm run dev
```

---

### 7️⃣ Authentication Not Working

**Error:** Cannot login/signup, session not persisting

**Solution:**
```bash
# Check SESSION_SECRET is set
grep SESSION_SECRET .env

# If empty, regenerate:
echo "SESSION_SECRET=$(openssl rand -base64 32)" >> .env

# Clear browser cookies
# - Chrome: Settings → Privacy → Clear browsing data
# - Firefox: History → Clear Recent History

# Restart server
npm run dev
```

---

### 8️⃣ CSS Not Loading / Styles Broken

**Error:** Page loads but no styling, looks plain

**Solution:**
```bash
# Rebuild Tailwind CSS
npm run build

# Clear browser cache
# - Chrome: Ctrl+Shift+Del
# - Firefox: Ctrl+Shift+Del

# Restart dev server
npm run dev

# Hard refresh browser: Ctrl+F5
```

---

### 9️⃣ AWS Deployment Fails

**Error:** GitHub Actions workflow fails at "Deploy to AWS" step

**Solution:**
```bash
# Check GitHub Secrets are set
# Settings → Secrets → Check:
# - AWS_REGION ✓
# - AWS_ACCOUNT_ID ✓
# - AWS_ACCESS_KEY_ID ✓
# - AWS_SECRET_ACCESS_KEY ✓

# Verify AWS credentials are valid
aws sts get-caller-identity

# Check ECR repository exists
aws ecr describe-repositories --repository-names surajhub
```

---

### 🔟 Database Migration Issues

**Error:** `Error: Migration failed: ...`

**Solution:**
```bash
# Sync schema (safe way, no data loss)
npm run db:push

# If that fails, force sync:
npm run db:push --force

# View current schema
npm run db:studio

# Check database directly
docker-compose exec postgres psql -U surajhub -d surajhub -c "\dt"
```

---

## 🔍 Debugging Commands

### Check All Services Running
```bash
# Docker containers
docker-compose ps

# Processes
lsof -i :5000
lsof -i :3000
lsof -i :5432

# Port availability
netstat -an | grep LISTEN
```

### View Logs
```bash
# Frontend logs (from terminal running npm run dev)
npm run dev

# Backend logs (same terminal)
# Look for any ERROR or WARNING messages

# Docker logs
docker-compose logs -f app      # Application
docker-compose logs -f postgres  # Database
docker-compose logs -f redis     # Cache

# AWS logs
aws logs tail /ecs/surajhub --follow
```

### Test API Endpoints
```bash
# Test signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123","firstName":"Test"}'

# Test products
curl http://localhost:3000/api/products | jq .

# Test with verbose output
curl -v http://localhost:3000/api/products
```

### Database Debugging
```bash
# Connect to database
docker-compose exec postgres psql -U surajhub -d surajhub

# List tables
\dt

# Query users
SELECT * FROM users;

# Query products count
SELECT COUNT(*) FROM products;

# Exit
\q
```

---

## 🚨 Emergency Fixes

### Complete Reset (Warning: Deletes Data)
```bash
# STOP: This deletes everything! Only use if stuck

# Remove all containers and data
docker-compose down -v

# Rebuild everything
docker-compose up -d
sleep 30

# Reinitialize database
npm run db:push

# Restart
npm run dev
```

### Clear All Caches
```bash
# Clear npm cache
npm cache clean --force

# Clear build caches
rm -rf dist .vite node_modules/.vite

# Clear Docker caches
docker system prune -a

# Reinstall everything
npm ci
npm run build
```

### Fix Corrupted Database
```bash
# Backup current data (if needed)
docker-compose exec postgres pg_dump -U surajhub surajhub > backup.sql

# Drop and recreate database
docker-compose exec postgres psql -U surajhub -d postgres -c "DROP DATABASE surajhub;"

# Restart containers
docker-compose down
docker-compose up -d

# Reinitialize
npm run db:push

# Restore backup (if needed)
docker-compose exec postgres psql -U surajhub surajhub < backup.sql
```

---

## ✅ Quick Health Check

Run this to verify everything is working:

```bash
#!/bin/bash

echo "🔍 Checking SurajHub Health..."

# Check Docker
echo -n "Docker: "
docker ps > /dev/null 2>&1 && echo "✅" || echo "❌"

# Check Node
echo -n "Node.js: "
node --version | grep -q "v18" && echo "✅" || echo "❌"

# Check services
echo -n "Frontend (5000): "
curl -s http://localhost:5000 > /dev/null && echo "✅" || echo "❌"

echo -n "API (3000): "
curl -s http://localhost:3000/api/products > /dev/null && echo "✅" || echo "❌"

echo -n "Database (5432): "
docker-compose exec postgres psql -U surajhub -c "SELECT 1;" > /dev/null 2>&1 && echo "✅" || echo "❌"

echo "✅ Health check complete!"
```

---

## 📞 Still Stuck?

1. Check logs: `npm run dev` (terminal output)
2. Check browser console: F12 → Console tab
3. Check Docker logs: `docker-compose logs app`
4. Search docs: `grep -r "error message" ./`
5. AWS logs: `aws logs tail /ecs/surajhub`

**Contact Support:**
- Email: support@surajhub.com
- GitHub Issues: Report bug
- Phone: +1-800-123-4567

