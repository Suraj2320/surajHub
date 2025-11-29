# SurajHub AWS Setup Script for Windows (PowerShell)

function Show-Menu {
    Clear-Host
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host "   SurajHub AWS Deployment Helper (Windows) " -ForegroundColor Cyan
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host "1.  Check Prerequisites (AWS CLI, Docker)"
    Write-Host "2.  Phase 1: Setup Database (RDS)"
    Write-Host "3.  Phase 2: Setup ECR (Container Registry)"
    Write-Host "4.  Phase 3: Setup Secrets Manager"
    Write-Host "5.  Phase 4: Setup ECS Cluster"
    Write-Host "6.  Phase 5: Create CloudWatch Log Group"
    Write-Host "7.  Phase 6: Register ECS Task Definition"
    Write-Host "8.  Phase 7: Create Application Load Balancer"
    Write-Host "9.  Phase 8: Create ECS Service"
    Write-Host "10. Phase 9: Setup Auto Scaling"
    Write-Host "11. Get GitHub Actions Secrets"
    Write-Host "12. Run Database Migrations"
    Write-Host "Q.  Quit"
    Write-Host "============================================" -ForegroundColor Cyan
}

function Check-Prerequisites {
    Write-Host "`nChecking Prerequisites..." -ForegroundColor Yellow
    try {
        $awsVersion = aws --version 2>&1
        Write-Host "AWS CLI: Found ($awsVersion)" -ForegroundColor Green
    }
    catch {
        Write-Host "AWS CLI: NOT FOUND. Please install it from https://aws.amazon.com/cli/" -ForegroundColor Red
    }

    try {
        $dockerVersion = docker --version 2>&1
        Write-Host "Docker: Found ($dockerVersion)" -ForegroundColor Green
    }
    catch {
        Write-Host "Docker: NOT FOUND. Please install Docker Desktop." -ForegroundColor Red
    }
    Pause
}

function Setup-RDS {
    Write-Host "`n--- Phase 1: Setup Database (RDS) ---" -ForegroundColor Yellow
    $password = Read-Host "Enter Master Password for DB (Input Hidden)" -AsSecureString
    $passwordPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))
    
    Write-Host "Creating RDS instance..."
    aws rds create-db-instance `
        --db-instance-identifier surajhub-prod-db `
        --db-instance-class db.t3.micro `
        --engine postgres `
        --engine-version 15.2 `
        --master-username surajhub_admin `
        --master-user-password $passwordPlain `
        --allocated-storage 20 `
        --storage-type gp2 `
        --publicly-accessible false `
        --db-name surajhub_prod `
        --backup-retention-period 7 `
        --multi-az `
        --enable-cloudwatch-logs-exports '["postgresql"]' `
        --region us-east-1

    Write-Host "`nWaiting for DB to be available to get endpoint (this takes a while)..."
    Write-Host "You can check status in AWS Console or run this command later to get the endpoint:"
    Write-Host "aws rds describe-db-instances --db-instance-identifier surajhub-prod-db --region us-east-1 --query 'DBInstances[0].Endpoint.Address'" -ForegroundColor Gray
    Pause
}

function Setup-ECR {
    Write-Host "`n--- Phase 2: Setup ECR ---" -ForegroundColor Yellow
    $accountId = Read-Host "Enter your AWS Account ID"
    
    Write-Host "Creating Repository..."
    aws ecr create-repository `
        --repository-name surajhub `
        --region us-east-1 `
        --image-scanning-configuration scanOnPush=true `
        --encryption-configuration encryptionType=AES256

    Write-Host "Logging in to ECR..."
    aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin "$accountId.dkr.ecr.us-east-1.amazonaws.com"

    Write-Host "Building Docker Image..."
    docker build -t surajhub:latest .

    Write-Host "Tagging Image..."
    docker tag surajhub:latest "$accountId.dkr.ecr.us-east-1.amazonaws.com/surajhub:latest"

    Write-Host "Pushing Image..."
    docker push "$accountId.dkr.ecr.us-east-1.amazonaws.com/surajhub:latest"
    Pause
}

function Setup-Secrets {
    Write-Host "`n--- Phase 3: Setup Secrets Manager ---" -ForegroundColor Yellow
    $dbUrl = Read-Host "Enter Full Database URL"
    $stripeSecret = Read-Host "Enter Stripe Secret Key"
    $stripePublic = Read-Host "Enter Stripe Public Key"
    
    # Generate random session secret
    $sessionSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % { [char]$_ })

    aws secretsmanager create-secret --name surajhub/database-url --secret-string $dbUrl --region us-east-1
    aws secretsmanager create-secret --name surajhub/session-secret --secret-string $sessionSecret --region us-east-1
    aws secretsmanager create-secret --name surajhub/stripe-secret-key --secret-string $stripeSecret --region us-east-1
    aws secretsmanager create-secret --name surajhub/stripe-public-key --secret-string $stripePublic --region us-east-1
    
    Write-Host "Secrets created."
    Pause
}

function Setup-ECS-Cluster {
    Write-Host "`n--- Phase 4: Setup ECS Cluster ---" -ForegroundColor Yellow
    Write-Host "Creating ECS Cluster 'surajhub-prod'..."
    aws ecs create-cluster `
        --cluster-name surajhub-prod `
        --capacity-providers FARGATE FARGATE_SPOT `
        --default-capacity-provider-strategy capacityProvider=FARGATE, weight=1 `
        --region us-east-1
    Write-Host "Cluster created."
    Pause
}

function Setup-Log-Group {
    Write-Host "`n--- Phase 5: Create CloudWatch Log Group ---" -ForegroundColor Yellow
    Write-Host "Creating Log Group '/ecs/surajhub'..."
    aws logs create-log-group --log-group-name /ecs/surajhub --region us-east-1
    aws logs put-retention-policy --log-group-name /ecs/surajhub --retention-in-days 30 --region us-east-1
    Write-Host "Log Group created."
    Pause
}

function Register-Task-Def {
    Write-Host "`n--- Phase 6: Register ECS Task Definition ---" -ForegroundColor Yellow
    $accountId = Read-Host "Enter your AWS Account ID"
    
    $taskDef = @{
        family                  = "surajhub"
        networkMode             = "awsvpc"
        requiresCompatibilities = @("FARGATE")
        cpu                     = "512"
        memory                  = "1024"
        containerDefinitions    = @(
            @{
                name             = "surajhub"
                image            = "$accountId.dkr.ecr.us-east-1.amazonaws.com/surajhub:latest"
                portMappings     = @(
                    @{
                        containerPort = 5000
                        hostPort      = 5000
                        protocol      = "tcp"
                    }
                )
                environment      = @(
                    @{ name = "NODE_ENV"; value = "production" }
                )
                secrets          = @(
                    @{ name = "DATABASE_URL"; valueFrom = "arn:aws:secretsmanager:us-east-1:$accountId`::secret:surajhub/database-url" }
                    @{ name = "SESSION_SECRET"; valueFrom = "arn:aws:secretsmanager:us-east-1:$accountId`::secret:surajhub/session-secret" }
                    @{ name = "STRIPE_SECRET_KEY"; valueFrom = "arn:aws:secretsmanager:us-east-1:$accountId`::secret:surajhub/stripe-secret-key" }
                )
                logConfiguration = @{
                    logDriver = "awslogs"
                    options   = @{
                        "awslogs-group"         = "/ecs/surajhub"
                        "awslogs-region"        = "us-east-1"
                        "awslogs-stream-prefix" = "ecs"
                    }
                }
                healthCheck      = @{
                    command     = @("CMD-SHELL", "curl -f http://localhost:5000/ || exit 1")
                    interval    = 30
                    timeout     = 5
                    retries     = 3
                    startPeriod = 60
                }
            }
        )
        executionRoleArn        = "arn:aws:iam::$accountId`::role/ecsTaskExecutionRole"
        taskRoleArn             = "arn:aws:iam::$accountId`::role/ecsTaskRole"
    }

    $jsonContent = $taskDef | ConvertTo-Json -Depth 10
    $jsonContent | Out-File "task-definition.json" -Encoding ASCII
    
    Write-Host "Generated task-definition.json. Registering..."
    aws ecs register-task-definition --cli-input-json file://task-definition.json --region us-east-1
    Write-Host "Task Definition registered."
    Pause
}

function Setup-ALB {
    Write-Host "`n--- Phase 7: Create Application Load Balancer ---" -ForegroundColor Yellow
    Write-Host "Creating Security Group..."
    $sgId = aws ec2 create-security-group --group-name surajhub-alb-sg --description "SurajHub ALB security group" --region us-east-1 --query 'GroupId' --output text
    
    Write-Host "Authorizing Ingress..."
    aws ec2 authorize-security-group-ingress --group-id $sgId --protocol tcp --port 80 --cidr 0.0.0.0/0 --region us-east-1
    aws ec2 authorize-security-group-ingress --group-id $sgId --protocol tcp --port 443 --cidr 0.0.0.0/0 --region us-east-1
    
    $vpcId = Read-Host "Enter VPC ID (e.g., vpc-xxxx)"
    $subnet1 = Read-Host "Enter Subnet ID 1 (e.g., subnet-xxxx)"
    $subnet2 = Read-Host "Enter Subnet ID 2 (e.g., subnet-yyyy)"
    
    Write-Host "Creating Load Balancer..."
    $albArn = aws elbv2 create-load-balancer --name surajhub-alb --subnets $subnet1 $subnet2 --security-groups $sgId --scheme internet-facing --type application --region us-east-1 --query 'LoadBalancers[0].LoadBalancerArn' --output text
    
    Write-Host "Creating Target Group..."
    $tgArn = aws elbv2 create-target-group --name surajhub-tg --protocol HTTP --port 5000 --vpc-id $vpcId --target-type ip --health-check-enabled --health-check-path / --region us-east-1 --query 'TargetGroups[0].TargetGroupArn' --output text
    
    Write-Host "ALB and Target Group created."
    Write-Host "ALB ARN: $albArn"
    Write-Host "Target Group ARN: $tgArn"
    Pause
}

function Setup-ECS-Service {
    Write-Host "`n--- Phase 8: Create ECS Service ---" -ForegroundColor Yellow
    $subnet1 = Read-Host "Enter Subnet ID 1"
    $subnet2 = Read-Host "Enter Subnet ID 2"
    $sgId = Read-Host "Enter Security Group ID"
    $tgArn = Read-Host "Enter Target Group ARN"
    
    Write-Host "Creating Service..."
    aws ecs create-service `
        --cluster surajhub-prod `
        --service-name surajhub `
        --task-definition surajhub:1 `
        --desired-count 2 `
        --launch-type FARGATE `
        --network-configuration "awsvpcConfiguration={subnets=[$subnet1,$subnet2],securityGroups=[$sgId],assignPublicIp=DISABLED}" `
        --load-balancers "targetGroupArn=$tgArn,containerName=surajhub,containerPort=5000" `
        --region us-east-1
      
    Write-Host "Service created."
    Pause
}

function Setup-AutoScaling {
    Write-Host "`n--- Phase 9: Setup Auto Scaling ---" -ForegroundColor Yellow
    
    aws application-autoscaling register-scalable-target `
        --service-namespace ecs `
        --resource-id service/surajhub-prod/surajhub `
        --scalable-dimension ecs:service:DesiredCount `
        --min-capacity 2 `
        --max-capacity 10 `
        --region us-east-1

    aws application-autoscaling put-scaling-policy `
        --policy-name cpu-scaling `
        --service-namespace ecs `
        --resource-id service/surajhub-prod/surajhub `
        --scalable-dimension ecs:service:DesiredCount `
        --policy-type TargetTrackingScaling `
        --target-tracking-scaling-policy-configuration "TargetValue=70,PredefinedMetricSpecification={PredefinedMetricType=ECSServiceAverageCPUUtilization},ScaleOutCooldown=60,ScaleInCooldown=300" `
        --region us-east-1
      
    Write-Host "Auto Scaling configured."
    Pause
}

function Get-GitHub-Secrets {
    Write-Host "`n--- GitHub Actions Secrets Helper ---" -ForegroundColor Yellow
    Write-Host "You need to add these secrets to your GitHub Repository (Settings -> Secrets -> Actions):" -ForegroundColor Cyan
    
    $accountId = Read-Host "Enter your AWS Account ID"
    
    Write-Host "`nAWS_REGION" -ForegroundColor Green
    Write-Host "us-east-1"
    
    Write-Host "`nAWS_ROLE_ARN" -ForegroundColor Green
    Write-Host "arn:aws:iam::$accountId`::role/github-actions-role"
    Write-Host "(Note: Ensure you created this role as per Prerequisites)" -ForegroundColor Gray
    
    Write-Host "`nECR_REGISTRY" -ForegroundColor Green
    Write-Host "$accountId.dkr.ecr.us-east-1.amazonaws.com"
    
    Write-Host "`nECS_CLUSTER" -ForegroundColor Green
    Write-Host "surajhub-prod"
    
    Write-Host "`nECS_SERVICE" -ForegroundColor Green
    Write-Host "surajhub"
    
    Write-Host "`n--- End of Secrets ---" -ForegroundColor Yellow
    Pause
}

function Run-Migrations {
    Write-Host "`n--- Run Database Migrations ---" -ForegroundColor Yellow
    Write-Host "Fetching running tasks..."
    
    $taskArn = aws ecs list-tasks --cluster surajhub-prod --service-name surajhub --region us-east-1 --query 'taskArns[0]' --output text
    
    if ($taskArn -eq "None" -or $null -eq $taskArn) {
        Write-Host "No running tasks found. Please wait for the service to start." -ForegroundColor Red
        Pause
        return
    }
    
    Write-Host "Found Task: $taskArn"
    Write-Host "Executing migration command (npm run db:push)..."
    
    aws ecs execute-command `
        --cluster surajhub-prod `
        --task $taskArn `
        --container surajhub `
        --command "npm run db:push" `
        --interactive `
        --region us-east-1
      
    Write-Host "`nMigrations command sent. Check output above for results."
    Pause
}

# Main Loop
do {
    Show-Menu
    $choice = Read-Host "Enter your choice"
    switch ($choice) {
        "1" { Check-Prerequisites }
        "2" { Setup-RDS }
        "3" { Setup-ECR }
        "4" { Setup-Secrets }
        "5" { Setup-ECS-Cluster }
        "6" { Setup-Log-Group }
        "7" { Register-Task-Def }
        "8" { Setup-ALB }
        "9" { Setup-ECS-Service }
        "10" { Setup-AutoScaling }
        "11" { Get-GitHub-Secrets }
        "12" { Run-Migrations }
        "Q" { exit }
        "q" { exit }
        Default { Write-Host "Invalid choice." -ForegroundColor Red; Pause }
    }
} until ($choice -eq "Q" -or $choice -eq "q")
