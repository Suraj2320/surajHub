# SurajHub Production Deployment Checklist

## Pre-Deployment (Before pushing to main)

### Code Quality
- [ ] Run ESLint: `npm run lint 2>/dev/null || true`
- [ ] Test authentication flow locally
- [ ] Test product filtering and search
- [ ] Test cart and checkout
- [ ] Test payment with Stripe test keys
- [ ] Verify all environment variables are set
- [ ] Check for console errors and warnings
- [ ] Verify API endpoints work correctly

### Security
- [ ] Remove all console.log statements from production code
- [ ] Verify no secrets in code (use .env only)
- [ ] Check CORS is properly configured
- [ ] Verify JWT/session validation on all protected routes
- [ ] Enable HTTPS/TLS
- [ ] Configure security headers (HSTS, CSP, etc.)
- [ ] Review database permissions
- [ ] Enable database SSL connections

### Infrastructure
- [ ] AWS account configured
- [ ] ECR repository created
- [ ] RDS database provisioned and tested
- [ ] Secrets Manager configured with all keys
- [ ] VPC and security groups configured
- [ ] Load balancer health checks working

### Documentation
- [ ] README.md updated
- [ ] API documentation complete
- [ ] Deployment instructions clear
- [ ] Runbooks for common issues created
- [ ] On-call procedures documented

---

## Deployment Steps

### Step 1: Final Local Tests
```bash
npm ci
npm run db:push
npm run dev
# Test all critical paths
```

### Step 2: Build & Push Docker Image
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build
docker build -t surajhub:latest .

# Tag & Push
docker tag surajhub:latest ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/surajhub:latest
docker push ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/surajhub:latest
```

### Step 3: Deploy via GitHub
```bash
git add .
git commit -m "Production deployment"
git push origin main
# GitHub Actions will automatically deploy
```

### Step 4: Monitor Deployment
```bash
# Watch ECS service deployment
aws ecs describe-services \
  --cluster surajhub-prod \
  --services surajhub \
  --region us-east-1 \
  --query 'services[0].{status:status,taskCount:runningCount,desiredCount:desiredCount}'

# Follow logs
aws logs tail /ecs/surajhub --follow
```

---

## Post-Deployment Validation

### Immediate (First 5 minutes)
- [ ] Application homepage loads
- [ ] Can access /api/products
- [ ] Signup/Login works
- [ ] Database queries returning data
- [ ] No error logs in CloudWatch

### Short-term (First hour)
- [ ] Monitor CPU/Memory metrics
- [ ] Check error rates in logs
- [ ] Verify load balancer health
- [ ] Test from different regions
- [ ] Monitor database connections

### Extended (First 24 hours)
- [ ] Verify auto-scaling works
- [ ] Check backup completion
- [ ] Review performance metrics
- [ ] Monitor error rates
- [ ] Verify SSL certificates

---

## Rollback Procedure

If deployment fails:

```bash
# Revert to previous task definition
aws ecs update-service \
  --cluster surajhub-prod \
  --service surajhub \
  --task-definition surajhub:PREVIOUS_VERSION

# Verify rollback
aws ecs describe-services \
  --cluster surajhub-prod \
  --services surajhub \
  --region us-east-1
```

---

## Monitoring & Alerts

### CloudWatch Dashboards to Create
- [ ] Requests per second
- [ ] Error rate
- [ ] Response time (p50, p95, p99)
- [ ] Database connections
- [ ] CPU utilization
- [ ] Memory usage

### Alarms to Configure
- [ ] CPU > 80% for 5 minutes
- [ ] Memory > 85% for 5 minutes
- [ ] Error rate > 1% for 5 minutes
- [ ] Response time > 2 seconds for p95
- [ ] Database connections > 80% for 5 minutes
- [ ] Service unhealthy for 2 minutes

---

## Emergency Contacts

- **On-Call**: [Phone Number]
- **Slack**: #surajhub-incidents
- **PagerDuty**: [Link]
- **Email**: incidents@surajhub.com

---

## Runbooks

### Issue: High CPU Usage
1. Check CloudWatch metrics
2. Review recent code changes
3. Check for stuck queries
4. Scale service: `aws ecs update-service --desired-count 4`
5. Contact on-call if persists

### Issue: Database Connection Pool Exhausted
1. Check connection count: `SELECT count(*) FROM pg_stat_activity;`
2. Restart service to clear connections
3. Review application for connection leaks
4. Increase connection pool size

### Issue: Service Won't Start
1. Check logs: `aws logs tail /ecs/surajhub --follow`
2. Verify all secrets are set
3. Test database connection
4. Rollback to previous version
5. Escalate if issue persists

---

## Performance Targets

- [ ] Homepage load time < 2 seconds
- [ ] API response time < 500ms (p95)
- [ ] Database queries < 100ms (p95)
- [ ] Uptime > 99.9%
- [ ] Error rate < 0.1%

---

## Security Audit

- [ ] SSL/TLS certificates valid
- [ ] Security headers present
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation working
- [ ] SQL injection prevention verified
- [ ] XSS prevention verified
- [ ] CSRF protection enabled

