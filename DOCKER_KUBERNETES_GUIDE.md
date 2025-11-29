# Docker & Kubernetes Deployment Guide for SurajHub

## Docker Basics

### Build Image
```bash
docker build -t surajhub:v1.0 .
```

### Run Container
```bash
# Interactive
docker run -it -p 5000:5000 surajhub:v1.0

# Background
docker run -d -p 5000:5000 --name surajhub-container surajhub:v1.0

# With environment variables
docker run -d -p 5000:5000 \
  -e DATABASE_URL="postgresql://..." \
  -e STRIPE_KEY="sk_live_..." \
  surajhub:v1.0
```

### Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop all services
docker-compose down

# Remove volumes too
docker-compose down -v
```

### Docker Commands Reference
```bash
docker ps                    # List running containers
docker ps -a                 # List all containers
docker logs <container_id>   # View logs
docker exec -it <id> bash    # Access container shell
docker stop <container_id>   # Stop container
docker rm <container_id>     # Remove container
docker images                # List images
docker rmi <image_id>        # Remove image
docker push <registry>/image # Push to registry
```

---

## Kubernetes Basics

### Prerequisites
```bash
# Install kubectl
# macOS: brew install kubectl
# Ubuntu: sudo apt-get install kubectl

# Install minikube for local testing
brew install minikube

# Start local Kubernetes cluster
minikube start
```

### Deploy to Kubernetes

```bash
# Create namespace
kubectl create namespace surajhub

# Apply manifests
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/secret.yaml
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml

# Verify deployment
kubectl get pods -n surajhub
kubectl get services -n surajhub
```

### Kubernetes Commands Reference

```bash
# Pods
kubectl get pods -n surajhub
kubectl describe pod <pod_name> -n surajhub
kubectl logs <pod_name> -n surajhub
kubectl logs -f <pod_name> -n surajhub    # Follow logs
kubectl exec -it <pod_name> bash -n surajhub

# Deployments
kubectl get deployments -n surajhub
kubectl describe deployment surajhub-app -n surajhub
kubectl scale deployment surajhub-app --replicas=5 -n surajhub
kubectl rollout history deployment surajhub-app -n surajhub
kubectl rollout undo deployment surajhub-app -n surajhub

# Services
kubectl get services -n surajhub
kubectl port-forward service/surajhub-service 8080:80 -n surajhub

# ConfigMaps & Secrets
kubectl get configmaps -n surajhub
kubectl get secrets -n surajhub

# Check cluster info
kubectl cluster-info
kubectl get nodes
```

---

## Multi-Stage Docker Build Optimization

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Runtime (much smaller)
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
EXPOSE 5000
CMD ["npm", "start"]
```

Benefits:
- Final image size: ~200MB (vs 500MB+ without multi-stage)
- Faster deployments
- Reduced attack surface

---

## Kubernetes Deployment Strategy

### Rolling Updates (Zero Downtime)
```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1           # Create 1 new pod while old exists
    maxUnavailable: 0     # Never have 0 pods running
```

### Canary Deployment
```bash
# Deploy to 10% of traffic first
kubectl set image deployment/surajhub \
  surajhub=registry/surajhub:v2.0 \
  --record

# Monitor metrics
kubectl rollout status deployment/surajhub

# If successful, proceed to 100%
# If issues, rollback: kubectl rollout undo deployment/surajhub
```

---

## Resource Management

### CPU & Memory Requests
```yaml
resources:
  requests:
    cpu: 250m          # Minimum CPU needed
    memory: 512Mi       # Minimum memory needed
  limits:
    cpu: 500m          # Maximum CPU allowed
    memory: 1Gi         # Maximum memory allowed
```

### Vertical Pod Autoscaling
```bash
kubectl apply -f - <<EOF
apiVersion: autoscaling.k8s.io/v2
kind: VerticalPodAutoscaler
metadata:
  name: surajhub-vpa
  namespace: surajhub
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: surajhub-app
  updatePolicy:
    updateMode: "Auto"
EOF
```

---

## Health Checks

### Liveness Probe (Restart if unhealthy)
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 5000
  initialDelaySeconds: 30
  periodSeconds: 10
  failureThreshold: 3
```

### Readiness Probe (Accept traffic only if healthy)
```yaml
readinessProbe:
  httpGet:
    path: /ready
    port: 5000
  initialDelaySeconds: 10
  periodSeconds: 5
  failureThreshold: 2
```

---

## Service Mesh Integration (Optional)

### Istio Installation
```bash
# Download Istio
curl -L https://istio.io/downloadIstio | sh -
cd istio-*
sudo cp bin/istioctl /usr/local/bin/

# Install
istioctl install --set profile=demo -y

# Enable sidecar injection
kubectl label namespace surajhub istio-injection=enabled
```

---

## Monitoring & Logging

### Prometheus Metrics
```yaml
# Add to deployment
annotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "5000"
  prometheus.io/path: "/metrics"
```

### ELK Stack (Elasticsearch, Logstash, Kibana)
```bash
# Deploy ELK
helm install elastic elastic/elasticsearch -n monitoring
helm install kibana elastic/kibana -n monitoring
```

---

## Troubleshooting

### Pod stuck in Pending
```bash
# Check events
kubectl describe pod <pod_name> -n surajhub

# Usually: Not enough resources or image pull issues
# Solution: Increase cluster resources or fix image
```

### Service not accessible
```bash
# Check service endpoints
kubectl get endpoints surajhub-service -n surajhub

# Check ingress
kubectl get ingress -n surajhub

# Test connectivity
kubectl run test-pod --image=busybox -it --rm -- wget -O- http://surajhub-service:80
```

### Deployment won't update
```bash
# Force rollout
kubectl rollout restart deployment/surajhub-app -n surajhub

# Check rollout status
kubectl rollout status deployment/surajhub-app -n surajhub
```

---

## Best Practices

1. **Always use requests/limits** - Prevents resource starvation
2. **Use health checks** - Ensures only healthy pods get traffic
3. **Use Rolling Updates** - Achieves zero-downtime deployments
4. **Monitor everything** - CPU, memory, latency, errors
5. **Use namespaces** - Isolate dev/staging/prod
6. **Use secrets** - Never hardcode passwords
7. **Use ConfigMaps** - For non-sensitive configuration
8. **Regular backups** - For persistent data
9. **Test in staging** - Before production deployment
10. **Have rollback plan** - For quick recovery from bad deployments

