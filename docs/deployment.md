---
layout: default
title: Deployment Guide
nav_order: 6
---

# Deployment Guide
{: .no_toc }

Complete guide to deploying Gentelella Admin Template to production environments
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Pre-Deployment Checklist

### Build Optimization

Before deploying, ensure your build is optimized:

```bash
# Run production build
npm run build

# Analyze bundle sizes
npm run build:analyze

# Run performance optimizations
npm run optimize

# Test production build locally
npm run preview
```

### Environment Configuration

#### Production Environment Variables
Create `.env.production`:

```env
# API Configuration
VITE_API_URL=https://api.yoursite.com
VITE_APP_NAME=Gentelella Admin
VITE_DEBUG_MODE=false

# CDN Configuration
VITE_CDN_URL=https://cdn.yoursite.com
VITE_ASSETS_URL=https://assets.yoursite.com

# Performance Settings
VITE_PRELOAD_MODULES=charts,forms
VITE_ENABLE_SERVICE_WORKER=true

# Analytics
VITE_GA_TRACKING_ID=UA-XXXXXXXX-X
VITE_HOTJAR_ID=XXXXXXX
```

#### Build Configuration
Ensure `vite.config.js` has production optimizations:

```javascript
export default defineConfig({
  base: '/your-app-path/', // Set if not deploying to root
  
  build: {
    // Output directory
    outDir: 'dist',
    
    // Asset directory
    assetsDir: 'assets',
    
    // Source maps for production debugging
    sourcemap: process.env.NODE_ENV === 'development',
    
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,
    
    rollupOptions: {
      output: {
        // Manual chunk splitting for optimal loading
        manualChunks: {
          'vendor-core': ['bootstrap', '@popperjs/core'],
          'vendor-charts': ['chart.js', 'morris.js'],
          'vendor-forms': ['select2', 'tempus-dominus'],
          'vendor-tables': ['datatables.net'],
          'vendor-utils': ['dayjs', 'nprogress']
        }
      }
    }
  }
});
```

---

## Static Hosting Platforms

### Netlify Deployment

#### Method 1: Git Integration (Recommended)

1. **Connect Repository**
   - Push your code to GitHub/GitLab/Bitbucket
   - Connect repository in Netlify dashboard

2. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Environment Variables**
   Set in Netlify dashboard under Site Settings → Environment Variables:
   ```
   VITE_API_URL=https://api.yoursite.com
   VITE_APP_NAME=Gentelella Admin
   NODE_VERSION=18
   ```

4. **Custom Domain**
   - Add custom domain in Site Settings → Domain Management
   - Configure DNS records

#### Method 2: Manual Deploy

```bash
# Build the project
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

#### Netlify Configuration
Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=3600"
```

### Vercel Deployment

#### Git Integration

1. **Connect Repository**
   - Import project from GitHub/GitLab
   - Vercel auto-detects Vite configuration

2. **Build Configuration**
   Vercel automatically detects these settings:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "installCommand": "npm install"
   }
   ```

3. **Environment Variables**
   Set in Vercel dashboard:
   ```
   VITE_API_URL=https://api.yoursite.com
   VITE_APP_NAME=Gentelella Admin
   ```

#### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Vercel Configuration
Create `vercel.json`:

```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### GitHub Pages

#### GitHub Actions Deployment

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      pages: write
      id-token: write
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_BASE_URL: /your-repo-name/
      
      - name: Setup Pages
        uses: actions/configure-pages@v3
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./dist
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

#### Update Vite Configuration for GitHub Pages

```javascript
// vite.config.js
export default defineConfig({
  base: process.env.NODE_ENV === 'production' 
    ? '/your-repo-name/' 
    : '/',
  // ... rest of configuration
});
```

---

## Server Hosting

### Nginx Configuration

#### Basic Setup

```nginx
# /etc/nginx/sites-available/gentelella
server {
    listen 80;
    server_name yoursite.com www.yoursite.com;
    root /var/www/gentelella/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (if needed)
    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yoursite.com -d www.yoursite.com

# Auto-renewal (add to crontab)
0 12 * * * /usr/bin/certbot renew --quiet
```

### Apache Configuration

#### Virtual Host Setup

```apache
# /etc/apache2/sites-available/gentelella.conf
<VirtualHost *:80>
    ServerName yoursite.com
    ServerAlias www.yoursite.com
    DocumentRoot /var/www/gentelella/dist
    
    # Enable compression
    LoadModule deflate_module modules/mod_deflate.so
    <Location />
        SetOutputFilter DEFLATE
        SetEnvIfNoCase Request_URI \
            \.(?:gif|jpe?g|png)$ no-gzip dont-vary
        SetEnvIfNoCase Request_URI \
            \.(?:exe|t?gz|zip|bz2|sit|rar)$ no-gzip dont-vary
    </Location>
    
    # Cache static assets
    <LocationMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
        Header append Cache-Control "public, immutable"
    </LocationMatch>
    
    # Handle SPA routing
    <Directory /var/www/gentelella/dist>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/gentelella_error.log
    CustomLog ${APACHE_LOG_DIR}/gentelella_access.log combined
</VirtualHost>
```

---

## Container Deployment

### Docker Setup

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    server {
        listen       80;
        server_name  localhost;
        root   /usr/share/nginx/html;
        index  index.html index.htm;

        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  gentelella:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped

  # Optional: Add database, Redis, etc.
  database:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: gentelella
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Kubernetes Deployment

#### Deployment Configuration

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gentelella
  labels:
    app: gentelella
spec:
  replicas: 3
  selector:
    matchLabels:
      app: gentelella
  template:
    metadata:
      labels:
        app: gentelella
    spec:
      containers:
      - name: gentelella
        image: your-registry/gentelella:latest
        ports:
        - containerPort: 80
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
```

#### Service Configuration

```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: gentelella-service
spec:
  selector:
    app: gentelella
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: LoadBalancer
```

#### Ingress Configuration

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: gentelella-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - yoursite.com
    secretName: gentelella-tls
  rules:
  - host: yoursite.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: gentelella-service
            port:
              number: 80
```

---

## CI/CD Pipelines

### GitHub Actions

#### Complete CI/CD Pipeline

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18'

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run tests
      run: npm run test
    
    - name: Build project
      run: npm run build
    
    - name: Run performance audit
      run: npm run optimize

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build for staging
      run: npm run build
      env:
        VITE_API_URL: ${{ secrets.STAGING_API_URL }}
        VITE_APP_NAME: Gentelella Admin (Staging)
    
    - name: Deploy to staging
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
        destination_dir: staging

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build for production
      run: npm run build
      env:
        VITE_API_URL: ${{ secrets.PRODUCTION_API_URL }}
        VITE_APP_NAME: Gentelella Admin
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2.0
      with:
        publish-dir: './dist'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### GitLab CI/CD

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

cache:
  paths:
    - node_modules/

test:
  stage: test
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run lint
    - npm run test
    - npm run build

build-staging:
  stage: build
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour
  only:
    - develop

build-production:
  stage: build
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour
  only:
    - main

deploy-staging:
  stage: deploy
  image: alpine:latest
  script:
    - apk add --no-cache curl
    - curl -X POST "$STAGING_WEBHOOK_URL"
  dependencies:
    - build-staging
  only:
    - develop

deploy-production:
  stage: deploy
  image: alpine:latest
  script:
    - apk add --no-cache curl
    - curl -X POST "$PRODUCTION_WEBHOOK_URL"
  dependencies:
    - build-production
  only:
    - main
```

---

## Monitoring and Maintenance

### Health Checks

#### Basic Health Check Endpoint

```javascript
// health.js
export function setupHealthCheck() {
  // Simple health check
  if (window.location.pathname === '/health') {
    document.body.innerHTML = JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version
    });
  }
}
```

#### Service Worker Health Check

```javascript
// sw.js
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'HEALTH_CHECK') {
    event.ports[0].postMessage({
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
  }
});
```

### Error Tracking

#### Sentry Integration

```javascript
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Custom error boundary
window.addEventListener('error', (event) => {
  Sentry.captureException(event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  Sentry.captureException(event.reason);
});
```

### Performance Monitoring

```html
<!-- Real User Monitoring -->
<script>
  // Monitor Core Web Vitals
  import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';

  function sendToAnalytics(metric) {
    fetch('/analytics', {
      method: 'POST',
      body: JSON.stringify(metric),
      headers: {'Content-Type': 'application/json'}
    });
  }

  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
</script>
```

---

## Security Considerations

### Content Security Policy

```html
<!-- Add to index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
               font-src 'self' https://fonts.gstatic.com; 
               img-src 'self' data: https:;">
```

### Environment Secrets

```bash
# Use environment variables for sensitive data
export VITE_API_KEY="your-api-key"
export DATABASE_URL="postgresql://user:pass@host:port/db"

# Never commit .env files with secrets
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore
```

### HTTPS Enforcement

```javascript
// Redirect HTTP to HTTPS in production
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
  location.replace(`https:${location.href.substring(location.protocol.length)}`);
}
```

---

## Troubleshooting

### Common Deployment Issues

#### 1. Build Failures

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version
npm --version
```

#### 2. Asset Loading Issues

```javascript
// Check base URL configuration
// vite.config.js
export default defineConfig({
  base: process.env.NODE_ENV === 'production' 
    ? '/your-app-path/' 
    : '/',
});
```

#### 3. API Connection Issues

```javascript
// Check CORS configuration
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
```

---

## Next Steps

- **[Monitoring Setup]({{ site.baseurl }}/docs/monitoring/)** - Set up comprehensive monitoring
- **[Security Guide]({{ site.baseurl }}/docs/security/)** - Implement security best practices
- **[API Integration]({{ site.baseurl }}/docs/api-integration/)** - Connect with backend APIs

---

{: .highlight }
💡 **Pro Tip**: Always test your deployment in a staging environment that mirrors production before deploying to production. Use feature flags to safely roll out new features. 