# Deployment Guide

## Prerequisites

- Node.js >= 16.0.0
- MongoDB database
- Domain name (optional)
- SSL certificate (for production)

---

## Local Development

Already covered in README.md

---

## Production Deployment

### Option 1: Traditional VPS (DigitalOcean, AWS EC2, etc.)

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

#### 2. Clone and Setup

```bash
# Clone repository
git clone https://github.com/adityacsk008/reel-intelligence.git
cd reel-intelligence

# Backend setup
cd backend
npm install
cp .env.example .env
nano .env  # Edit with production values

# Frontend setup
cd ../frontend
npm install
cp .env.example .env
nano .env  # Edit with production API URL
npm run build
```

#### 3. Start Backend with PM2

```bash
cd backend
pm2 start server.js --name reel-intelligence-api
pm2 save
pm2 startup
```

#### 4. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/reel-intelligence
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/reel-intelligence/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/reel-intelligence /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

### Option 2: Heroku

#### Backend Deployment

```bash
cd backend

# Create Heroku app
heroku create reel-intelligence-api

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your_secret_here
heroku config:set NODE_ENV=production

# Deploy
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

#### Frontend Deployment

```bash
cd frontend

# Build
npm run build

# Deploy to Netlify/Vercel
# Or use Heroku static buildpack
```

---

### Option 3: Docker

#### Create Dockerfile for Backend

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

#### Create Dockerfile for Frontend

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: mongodb://admin:password@mongodb:27017/reel-intelligence?authSource=admin
      JWT_SECRET: your_secret_here
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongo-data:
```

Deploy:
```bash
docker-compose up -d
```

---

## Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/reel-intelligence
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-domain.com
```

### Frontend (.env)

```env
REACT_APP_API_URL=https://api.your-domain.com/api
```

---

## Post-Deployment

### 1. Create Admin User

```bash
# Connect to MongoDB
mongo

use reel-intelligence

# Create admin user
db.users.insertOne({
  name: "Admin",
  email: "admin@reelintelligence.com",
  password: "$2a$10$...", // Use bcrypt to hash password
  role: "admin",
  scanLimit: 999999,
  scansUsed: 0,
  isActive: true,
  createdAt: new Date()
})
```

### 2. Monitor Application

```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs reel-intelligence-api

# Restart if needed
pm2 restart reel-intelligence-api
```

### 3. Backup Database

```bash
# Create backup script
nano /home/user/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --out /backups/mongo_$DATE
```

```bash
chmod +x /home/user/backup-db.sh

# Add to crontab for daily backups
crontab -e
# Add: 0 2 * * * /home/user/backup-db.sh
```

---

## Troubleshooting

### Backend not starting
- Check MongoDB connection
- Verify environment variables
- Check PM2 logs: `pm2 logs`

### Frontend not loading
- Verify build completed: `npm run build`
- Check Nginx configuration
- Verify API URL in .env

### Database connection issues
- Check MongoDB is running: `sudo systemctl status mongod`
- Verify connection string
- Check firewall rules

---

## Security Checklist

- [ ] Change default admin credentials
- [ ] Use strong JWT secret
- [ ] Enable HTTPS/SSL
- [ ] Set up firewall rules
- [ ] Regular security updates
- [ ] Database backups
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Environment variables secured

---

## Scaling

### Horizontal Scaling
- Use load balancer (Nginx, HAProxy)
- Deploy multiple backend instances
- Use MongoDB replica set

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Add caching (Redis)

---

For more help, open an issue on GitHub!