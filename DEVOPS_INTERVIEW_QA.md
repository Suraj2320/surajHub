# DevOps & Backend Interview Q&A

## Node.js & Express

### Q1: What is the difference between `require()` and `import`?
**A:** 
- `require()` is CommonJS (synchronous, used in Node.js by default)
- `import` is ES6 modules (asynchronous, standard in modern JavaScript)
- CommonJS: `const express = require('express')`
- ES6: `import express from 'express'`

### Q2: What is middleware in Express?
**A:** Middleware are functions that have access to request, response, and next function:
```javascript
app.use((req, res, next) => {
  console.log('Request received');
  next(); // Pass control to next middleware
});
```
Used for logging, authentication, error handling, etc.

### Q3: What is the purpose of `dotenv`?
**A:** Loads environment variables from `.env` file into `process.env`:
```javascript
require('dotenv').config();
const dbUrl = process.env.DATABASE_URL;
```
Keeps sensitive data out of code.

### Q4: Explain the event loop in Node.js
**A:** Node.js event loop processes asynchronous callbacks:
1. **Timers** - Execute setTimeout/setInterval
2. **I/O Callbacks** - Execute deferred I/O callbacks
3. **Check** - Execute setImmediate
4. **Close Callbacks** - Execute close callbacks

```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// Output: 1, 4, 3, 2
```

### Q5: What is Express middleware for CORS?
**A:**
```javascript
const cors = require('cors');
app.use(cors()); // Allow all origins

// Or restrict to specific origin
app.use(cors({
  origin: 'https://surajhub.com',
  credentials: true
}));
```

### Q6: How do you handle errors in Express?
**A:**
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});
```
Error handling middleware has 4 parameters (err, req, res, next).

---

## Database (PostgreSQL & SQL)

### Q7: What is normalization in databases?
**A:** Process of organizing data to minimize redundancy:
- **1NF**: Remove duplicate columns
- **2NF**: Remove partial dependencies
- **3NF**: Remove transitive dependencies

```sql
-- BAD (not normalized)
CREATE TABLE users (
  id INT,
  name TEXT,
  orders TEXT[] -- Array of order IDs
);

-- GOOD (normalized)
CREATE TABLE users (
  id INT PRIMARY KEY,
  name TEXT
);
CREATE TABLE orders (
  id INT PRIMARY KEY,
  user_id INT REFERENCES users(id),
  amount DECIMAL
);
```

### Q8: What is an index in PostgreSQL?
**A:** Index speeds up queries but slows down INSERT/UPDATE:
```sql
CREATE INDEX idx_email ON users(email);
-- Now queries like WHERE email = 'user@example.com' are faster

-- Check indexes
\d users -- Shows indexes on table
```

### Q9: Explain joins in SQL
**A:**
```sql
-- INNER JOIN - Only matching records
SELECT u.name, o.order_id
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- LEFT JOIN - All from left table + matches from right
SELECT u.name, o.order_id
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- FULL OUTER JOIN - All records from both tables
SELECT u.name, o.order_id
FROM users u
FULL OUTER JOIN orders o ON u.id = o.user_id;
```

### Q10: What is a transaction in databases?
**A:** Ensures data consistency (ACID properties):
```sql
BEGIN TRANSACTION;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT; -- All or nothing

-- Or rollback
ROLLBACK; -- Undo all changes
```

### Q11: What are constraints in PostgreSQL?
**A:**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,           -- Unique, not null
  email VARCHAR(255) UNIQUE,       -- Must be unique
  name VARCHAR(255) NOT NULL,      -- Can't be null
  age INT CHECK (age >= 18),       -- Must be >= 18
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Q12: What is pagination in databases?
**A:**
```sql
-- Get 10 records starting from record 20
SELECT * FROM products
OFFSET 20
LIMIT 10;

-- Better performance with cursor-based pagination
SELECT * FROM products
WHERE id > 1000
ORDER BY id
LIMIT 10;
```

---

## Docker

### Q13: What is Docker and why use it?
**A:** Docker containerizes applications for consistency:
- **Portability**: Run same container everywhere
- **Isolation**: App dependencies don't affect system
- **Efficiency**: Lightweight vs VMs
- **Scaling**: Easy to replicate containers

### Q14: Explain Docker layers and image caching
**A:**
```dockerfile
# Each line creates a layer
FROM node:18-alpine        # Layer 1: Base image
WORKDIR /app               # Layer 2: Working directory
COPY package.json .        # Layer 3: Package file
RUN npm install            # Layer 4: Dependencies
COPY . .                   # Layer 5: Source code
CMD ["npm", "start"]       # Layer 6: Command
```

Docker caches layers. If Layer 5 changes, Layer 6 rebuilds but Layer 4 (npm install) is cached.

### Q15: What is multi-stage Docker build?
**A:** Reduces final image size:
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json .
RUN npm install

# Runtime stage
FROM node:18-alpine
COPY --from=builder /app/node_modules ./node_modules
COPY . .
CMD ["npm", "start"]
```

### Q16: Explain Docker Compose
**A:** Runs multiple containers with one command:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://db:5432/app
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Run with: `docker-compose up`

### Q17: What are Docker volumes?
**A:** Persist data outside container:
```bash
# Named volume
docker volume create mydata
docker run -v mydata:/app/data myimage

# Bind mount
docker run -v /host/path:/container/path myimage

# Anonymous volume
docker run -v /app/data myimage
```

### Q18: Explain Docker networking
**A:**
```bash
# Bridge network (default)
docker network create mynetwork
docker run --network mynetwork myimage

# Container can reach other containers by name
# http://other-container:3000
```

---

## Kubernetes

### Q19: What is Kubernetes and why use it?
**A:** Container orchestration platform:
- **Auto-scaling**: Scale up/down based on demand
- **Self-healing**: Restart failed containers
- **Load balancing**: Distribute traffic
- **Rolling updates**: Zero-downtime deployments
- **Secret management**: Securely store credentials

### Q20: Explain Kubernetes Pods vs Deployments
**A:**
```yaml
# Pod (basic unit, rarely used directly)
apiVersion: v1
kind: Pod
metadata:
  name: myapp
spec:
  containers:
  - name: app
    image: myimage:latest

# Deployment (manages Pods, recommended)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3  # Always 3 pods running
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: app
        image: myimage:latest
```

### Q21: What are Kubernetes Services?
**A:** Expose pods to network:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  type: LoadBalancer  # Expose to internet
  selector:
    app: myapp
  ports:
  - port: 80           # External port
    targetPort: 3000   # Container port
```

### Q22: Explain Kubernetes ConfigMaps and Secrets
**A:**
```yaml
# ConfigMap for non-sensitive data
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  LOG_LEVEL: "info"
  DATABASE_HOST: "postgres"

---
# Secret for sensitive data
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  password: cGFzc3dvcmQxMjM=  # base64 encoded

---
# Use in Pod
apiVersion: v1
kind: Pod
metadata:
  name: myapp
spec:
  containers:
  - name: app
    image: myimage
    envFrom:
    - configMapRef:
        name: app-config
    - secretRef:
        name: app-secrets
```

### Q23: What is a Kubernetes Ingress?
**A:** Routes external HTTP/HTTPS traffic to services:
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
spec:
  rules:
  - host: surajhub.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: myapp-service
            port:
              number: 80
```

### Q24: Explain Horizontal Pod Autoscaler (HPA)
**A:** Automatically scales pods based on CPU/memory:
```yaml
apiVersion: autoscaling.k8s.io/v2
kind: HorizontalPodAutoscaler
metadata:
  name: myapp-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70  # Scale if CPU > 70%
```

### Q25: What are Kubernetes namespaces?
**A:** Isolate resources in cluster:
```bash
# Create namespace
kubectl create namespace production

# Run pod in namespace
kubectl run myapp --namespace production

# Get pods in namespace
kubectl get pods -n production

# Best practice
kubectl create namespace development
kubectl create namespace staging
kubectl create namespace production
```

---

## CI/CD

### Q26: What is CI/CD?
**A:**
- **CI (Continuous Integration)**: Automatically test code on push
- **CD (Continuous Deployment)**: Automatically deploy to production

Pipeline: Code Push → Build → Test → Deploy

### Q27: Explain GitHub Actions workflow
**A:**
```yaml
name: CI/CD
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm ci
    - run: npm test
    - run: npm run build
```

### Q28: What are GitHub Secrets?
**A:** Store sensitive data for workflows:
```bash
# Set in Settings → Secrets
DATABASE_URL=postgresql://...
STRIPE_KEY=sk_live_...

# Use in workflow
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Q29: Explain Docker registry and image pushing
**A:**
```bash
# Login to registry
docker login

# Tag image
docker tag myimage:latest myrepo/myimage:latest

# Push to registry
docker push myrepo/myimage:latest

# Pull from registry
docker pull myrepo/myimage:latest
```

### Q30: What is blue-green deployment?
**A:** Zero-downtime deployment strategy:
```
Blue (old)  → Production (live)
Green (new) → Staging

1. Deploy new version to Green
2. Test Green thoroughly
3. Switch load balancer: Blue → Green
4. Keep Blue for quick rollback
```

---

## AWS Deployment

### Q31: What are AWS IAM Roles?
**A:** Permissions for AWS services:
```
IAM Role → Policies (permissions) → Assign to user/service
Example: EC2 instance needs access to S3
→ Create role with S3 permissions
→ Attach to EC2 instance
```

### Q32: Explain ECS vs EKS
**A:**
- **ECS**: AWS-native container orchestration (simpler, less features)
- **EKS**: Managed Kubernetes (more powerful, steeper learning curve)

For most cases: Use ECS Fargate. For complex needs: Use EKS.

### Q33: What is RDS and benefits?
**A:** Managed relational database:
- Automatic backups
- Multi-AZ for high availability
- Read replicas for scaling
- Automated patching
- Monitoring with CloudWatch

### Q34: What is AWS Application Load Balancer (ALB)?
**A:** Distributes traffic across instances:
```
Client → ALB → [Instance 1]
              → [Instance 2]
              → [Instance 3]
```
Can route based on hostname, path, port.

### Q35: Explain AWS CloudWatch
**A:** Monitoring and logging service:
- Collect logs from services
- Monitor CPU, memory, disk usage
- Create alarms and notifications
- Dashboard for visualizing metrics

---

## System Design

### Q36: How to design for high availability?
**A:**
1. Multi-region deployment
2. Database replication
3. Load balancing
4. Auto-scaling
5. Health checks and failover

### Q37: How to handle database connection pooling?
**A:**
```javascript
// Without pooling (bad for scalability)
const conn = new Pool({ max: 10 });

// With pooling (good)
const pool = new Pool({
  max: 20,              // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Use connection from pool
const client = await pool.connect();
try {
  const result = await client.query('SELECT * FROM users');
} finally {
  client.release();
}
```

### Q38: How to implement caching strategy?
**A:**
```
1. Client-side cache (browser)
2. CDN cache (static assets)
3. Server-side cache (Redis)
4. Database cache (query results)

Cache invalidation strategies:
- Time-based: Expire after X seconds
- Event-based: Invalidate on update
- LRU: Remove least recently used
```

---

## Security

### Q39: What is SQL injection and how to prevent it?
**A:**
```javascript
// BAD: Vulnerable
const query = `SELECT * FROM users WHERE email = '${email}'`;

// GOOD: Use parameterized queries
const query = 'SELECT * FROM users WHERE email = $1';
db.query(query, [email]);
```

### Q40: What are environment variables for?
**A:** Store secrets safely:
```
DATABASE_URL=postgresql://...
STRIPE_KEY=sk_live_...
JWT_SECRET=random-secret-key
```

Never commit `.env` to git. Use `.env.example` as template.

