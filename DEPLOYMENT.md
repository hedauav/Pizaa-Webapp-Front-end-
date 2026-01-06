# Deployment Guide - SliceMaster Pizza

This guide covers deployment options for SliceMaster Pizza application.

## Table of Contents
1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Cloud Deployment](#cloud-deployment)
4. [Production Checklist](#production-checklist)

## Local Development

### Quick Start
```powershell
# Windows
.\RUN-FULL-SYSTEM.ps1

# Or manually
cd SliceMaster-Backend
mvn spring-boot:run

# In new terminal
cd Pizaa-Webapp-Front-end-
npx http-server -p 5500
```

## Docker Deployment

### Backend Dockerfile
Create `SliceMaster-Backend/Dockerfile`:
```dockerfile
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY target/pizzeria-backend-1.0.0.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Frontend Dockerfile
Create `Pizaa-Webapp-Front-end-/Dockerfile`:
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### Docker Compose
Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  backend:
    build: ./SliceMaster-Backend
    ports:
      - "8081:8081"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DB_URL=jdbc:postgresql://db:5432/slicemaster
      - DB_USERNAME=postgres
      - DB_PASSWORD=${DB_PASSWORD}
    depends_on:
      - db
    restart: unless-stopped

  frontend:
    build: ./Pizaa-Webapp-Front-end-
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=slicemaster
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### Run with Docker
```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Cloud Deployment

### AWS Deployment

#### Using AWS Elastic Beanstalk

1. **Install EB CLI**:
```bash
pip install awsebcli
```

2. **Initialize EB**:
```bash
cd SliceMaster-Backend
eb init slicemaster-backend --region us-east-1 --platform java-21
```

3. **Create Environment**:
```bash
eb create production-env
```

4. **Deploy**:
```bash
mvn clean package
eb deploy
```

#### Using AWS EC2

1. **Launch EC2 Instance** (Ubuntu 22.04 LTS)

2. **SSH and Setup**:
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Java
sudo apt update
sudo apt install openjdk-21-jdk -y

# Install Nginx
sudo apt install nginx -y

# Upload application
scp target/pizzeria-backend-1.0.0.jar ubuntu@your-ec2-ip:/home/ubuntu/
```

3. **Create Systemd Service**:
```bash
sudo nano /etc/systemd/system/slicemaster.service
```

```ini
[Unit]
Description=SliceMaster Backend
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu
ExecStart=/usr/bin/java -jar pizzeria-backend-1.0.0.jar
Restart=always

[Install]
WantedBy=multi-user.target
```

4. **Start Service**:
```bash
sudo systemctl enable slicemaster
sudo systemctl start slicemaster
```

### Azure Deployment

#### Using Azure App Service

1. **Install Azure CLI**:
```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

2. **Login and Create Resources**:
```bash
az login
az group create --name slicemaster-rg --location eastus
az appservice plan create --name slicemaster-plan --resource-group slicemaster-rg --sku B1 --is-linux
```

3. **Deploy Backend**:
```bash
az webapp create --resource-group slicemaster-rg --plan slicemaster-plan --name slicemaster-api --runtime "JAVA:21-java21"
az webapp deploy --resource-group slicemaster-rg --name slicemaster-api --src-path target/pizzeria-backend-1.0.0.jar
```

4. **Deploy Frontend**:
```bash
az webapp create --resource-group slicemaster-rg --plan slicemaster-plan --name slicemaster-web --runtime "NODE:18-lts"
# Deploy static files
```

### Heroku Deployment

1. **Create Procfile** in backend:
```
web: java -jar target/pizzeria-backend-1.0.0.jar --server.port=$PORT
```

2. **Deploy**:
```bash
heroku create slicemaster-backend
git push heroku master
```

### Google Cloud Platform

#### Using Cloud Run

1. **Build Container**:
```bash
gcloud builds submit --tag gcr.io/PROJECT-ID/slicemaster-backend
```

2. **Deploy**:
```bash
gcloud run deploy slicemaster-backend \
  --image gcr.io/PROJECT-ID/slicemaster-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Production Checklist

### Security
- [ ] Change default JWT secret key
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Implement API authentication
- [ ] Use environment variables for secrets
- [ ] Enable security headers

### Database
- [ ] Switch from H2 to production database (PostgreSQL/MySQL)
- [ ] Set up database backups
- [ ] Configure connection pooling
- [ ] Enable database SSL
- [ ] Implement database migration strategy

### Performance
- [ ] Enable caching (Redis)
- [ ] Configure CDN for static assets
- [ ] Optimize images
- [ ] Enable GZIP compression
- [ ] Set up load balancing
- [ ] Configure auto-scaling

### Monitoring
- [ ] Set up application logging
- [ ] Configure error tracking (Sentry, etc.)
- [ ] Set up performance monitoring (New Relic, DataDog)
- [ ] Configure uptime monitoring
- [ ] Set up alerts for critical errors
- [ ] Enable metrics collection

### Backup & Recovery
- [ ] Automated database backups
- [ ] Disaster recovery plan
- [ ] Regular backup testing
- [ ] Version control for configurations

## Environment Variables

Create `.env` file for production:
```bash
# Database
DB_URL=jdbc:postgresql://your-db-host:5432/slicemaster
DB_USERNAME=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRATION=86400000

# Server
SERVER_PORT=8081
FRONTEND_URL=https://your-domain.com

# Email (if configured)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Payment Gateways
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_SECRET=your-paypal-secret
```

## SSL Certificate Setup

### Using Let's Encrypt (Free)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Auto-renewal
```bash
sudo certbot renew --dry-run
```

## Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend
    location / {
        root /var/www/slicemaster;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket
    location /ws {
        proxy_pass http://localhost:8081;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ master ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up JDK 21
        uses: actions/setup-java@v2
        with:
          java-version: '21'
          distribution: 'temurin'
      
      - name: Build with Maven
        run: cd SliceMaster-Backend && mvn clean package -DskipTests
      
      - name: Deploy to server
        run: |
          # Add your deployment commands here
```

## Troubleshooting

### Common Issues

**Port already in use**:
```bash
# Find process
netstat -ano | findstr :8081
# Kill process
taskkill /PID <process_id> /F
```

**Database connection fails**:
- Check database credentials
- Verify network connectivity
- Check firewall rules

**Application won't start**:
- Check logs: `tail -f /var/log/slicemaster/app.log`
- Verify Java version
- Check disk space

## Support

For deployment issues, contact: devops@slicemaster.com
