# 🚀 Deployment Guide - Family Expense Tracker

Complete guide to deploy your full-stack Family Expense Tracker application to production.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Quick Deploy (Recommended)](#quick-deploy-recommended)
4. [Backend Deployment](#backend-deployment)
5. [Database Deployment](#database-deployment)
6. [Frontend Deployment](#frontend-deployment)
7. [Environment Variables](#environment-variables)
8. [Post-Deployment Setup](#post-deployment-setup)
9. [Custom Domain](#custom-domain)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Your app consists of:
- **Backend**: NestJS API (Node.js)
- **Frontend**: Ionic React (Static files)
- **Database**: PostgreSQL
- **Email**: Gmail SMTP
- **Cron Jobs**: Daily reminders at 9 PM

### Deployment Architecture
```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend  │────▶│   Backend    │────▶│  PostgreSQL  │
│  (Vercel)   │     │  (Railway)   │     │  (Railway)   │
└─────────────┘     └──────────────┘     └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Gmail SMTP  │
                    └──────────────┘
```

---

## ✅ Prerequisites

Before deploying, ensure you have:

- [ ] **GitHub Account** (to push code)
- [ ] **Gmail Account** (for email)
- [ ] **Gmail App Password** (see `FIX_EMAIL_ISSUE.md`)
- [ ] **Railway/Render Account** (for backend)
- [ ] **Vercel/Netlify Account** (for frontend)
- [ ] **Code pushed to GitHub**

---

## 🚀 Quick Deploy (Recommended)

### Option 1: Railway (Backend + Database) + Vercel (Frontend)

**Best for**: Beginners, quick setup, free tier available

**Time**: 15-20 minutes

---

## 🔧 Backend Deployment

### Option A: Railway (Recommended) ⭐

**Why Railway?**
- ✅ Free $5/month credit
- ✅ PostgreSQL included
- ✅ Auto-deploy from GitHub
- ✅ Simple environment variables
- ✅ Cron jobs work out of the box

#### Step-by-Step Railway Deployment:

**1. Push Code to GitHub**
```bash
cd /Users/anurag/Desktop/expansis_Track

# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit - Family Expense Tracker"

# Create GitHub repo and push
# Go to github.com → New Repository → "family-expense-tracker"
git remote add origin https://github.com/YOUR_USERNAME/family-expense-tracker.git
git branch -M main
git push -u origin main
```

**2. Create Railway Account**
- Go to https://railway.app
- Sign up with GitHub
- Verify email

**3. Deploy Backend**

```
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Railway will detect it's a monorepo
```

**4. Configure Railway Project**

Create `railway.json` in backend folder:
```bash
cat > backend/railway.json << 'EOF'
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF
```

**5. Add PostgreSQL Database**
```
1. In Railway project → Click "New"
2. Select "Database" → "PostgreSQL"
3. Database will be created automatically
4. Connection string will be auto-generated
```

**6. Set Environment Variables**

In Railway project → Backend service → Variables tab:

```bash
# Database (auto-filled by Railway)
DATABASE_URL=postgresql://postgres:password@host:5432/railway

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-too

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM=your.email@gmail.com

# Node Environment
NODE_ENV=production
```

**7. Deploy & Generate Database Schema**

```
1. Click "Deploy" button
2. Wait for build to complete
3. Go to "Deployments" tab
4. Your backend URL will be: https://your-app.up.railway.app
```

**8. Run Prisma Migrations**

In Railway → Backend Service → Settings:
```
Add "Build Command": npm install && npx prisma generate && npx prisma migrate deploy
```

Or manually via Railway CLI:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Run migration
railway run npx prisma migrate deploy
```

---

### Option B: Render.com

**Why Render?**
- ✅ Free tier available
- ✅ PostgreSQL included (free tier)
- ✅ Auto-deploy from GitHub
- ✅ Simple interface

#### Step-by-Step Render Deployment:

**1. Create Render Account**
- Go to https://render.com
- Sign up with GitHub

**2. Create PostgreSQL Database**
```
1. Dashboard → New → PostgreSQL
2. Name: family-expense-tracker-db
3. Plan: Free
4. Create Database
5. Copy "External Database URL"
```

**3. Create Web Service**
```
1. Dashboard → New → Web Service
2. Connect your GitHub repository
3. Configure:
   - Name: family-expense-tracker-api
   - Root Directory: backend
   - Environment: Node
   - Build Command: npm install && npx prisma generate && npx prisma migrate deploy
   - Start Command: npm run start:prod
```

**4. Add Environment Variables**
Same as Railway (see step 6 above)

---

### Option C: Heroku

**Why Heroku?**
- ✅ Well-documented
- ✅ Many add-ons
- ⚠️ No free tier anymore

#### Quick Heroku Deploy:

**1. Install Heroku CLI**
```bash
brew tap heroku/brew && brew install heroku  # macOS
```

**2. Login & Create App**
```bash
cd /Users/anurag/Desktop/expansis_Track/backend

heroku login
heroku create family-expense-tracker-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini
```

**3. Configure Environment**
```bash
heroku config:set JWT_SECRET=your-secret
heroku config:set JWT_REFRESH_SECRET=your-refresh-secret
heroku config:set EMAIL_HOST=smtp.gmail.com
heroku config:set EMAIL_PORT=587
heroku config:set EMAIL_USER=your.email@gmail.com
heroku config:set EMAIL_PASSWORD=your-app-password
heroku config:set EMAIL_FROM=your.email@gmail.com
heroku config:set NODE_ENV=production
```

**4. Deploy**
```bash
git push heroku main

# Run migrations
heroku run npx prisma migrate deploy
```

---

## 🗄️ Database Deployment

### Option A: Railway PostgreSQL (Recommended with Railway)

**Already included if using Railway for backend!**

- Automatic provisioning
- Automatic backups
- Free tier: 512MB storage
- Connection string auto-configured

### Option B: Render PostgreSQL (Free)

**Already included if using Render for backend!**

- Free tier: 1GB storage
- 90-day data retention
- Automatic backups

### Option C: Supabase (Generous Free Tier)

**If you want separate database hosting:**

```
1. Go to https://supabase.com
2. Create new project
3. Copy PostgreSQL connection string
4. Use in DATABASE_URL env variable
```

**Free Tier:**
- 500MB database
- Unlimited API requests
- 50,000 monthly active users

### Option D: ElephantSQL (Free Tier)

```
1. Go to https://elephantsql.com
2. Create account
3. Create new instance (Tiny Turtle - Free)
4. Copy connection URL
```

---

## 🌐 Frontend Deployment

### Option A: Vercel (Recommended) ⭐

**Why Vercel?**
- ✅ Free tier (perfect for this app)
- ✅ Auto-deploy from GitHub
- ✅ Fast CDN
- ✅ Custom domains
- ✅ SSL included

#### Step-by-Step Vercel Deployment:

**1. Prepare Frontend Build**

Update `frontend/vite.config.ts`:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8100,
  },
  build: {
    outDir: 'dist',
  },
});
```

**2. Update API Base URL**

Edit `frontend/src/services/api.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  // ... rest of config
});
```

**3. Create `.env.production` in frontend**
```bash
cat > frontend/.env.production << 'EOF'
VITE_API_URL=https://your-backend-url.railway.app/api
EOF
```

**4. Deploy to Vercel**

**Via Vercel CLI:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from frontend folder
cd frontend
vercel --prod
```

**Via Vercel Dashboard:**
```
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: Vite
   - Root Directory: frontend
   - Build Command: npm run build
   - Output Directory: dist
   - Environment Variables:
     * VITE_API_URL = https://your-backend-url.railway.app/api
6. Click "Deploy"
```

**5. Update CORS in Backend**

Edit `backend/src/main.ts`:
```typescript
app.enableCors({
  origin: [
    'http://localhost:8100',
    'https://your-frontend-url.vercel.app', // Add your Vercel URL
  ],
  credentials: true,
});
```

---

### Option B: Netlify

**Why Netlify?**
- ✅ Free tier
- ✅ Simple deployment
- ✅ Form handling
- ✅ Redirects & rewrites

#### Step-by-Step Netlify Deployment:

**1. Create `netlify.toml` in frontend folder**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**2. Deploy**

**Via Netlify CLI:**
```bash
npm i -g netlify-cli
netlify login
cd frontend
netlify deploy --prod
```

**Via Netlify Dashboard:**
```
1. Go to https://netlify.com
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Choose your repository
5. Configure:
   - Base directory: frontend
   - Build command: npm run build
   - Publish directory: dist
6. Add environment variables:
   - VITE_API_URL = your-backend-url
7. Deploy
```

---

## 🔐 Environment Variables

### Backend Environment Variables

**Required:**
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your-16-digit-app-password
EMAIL_FROM=your.email@gmail.com

# Environment
NODE_ENV=production
```

**Optional:**
```bash
# Port (usually auto-set by platform)
PORT=3000

# Timezone for cron jobs
TZ=America/New_York
```

### Frontend Environment Variables

**Required:**
```bash
VITE_API_URL=https://your-backend-url.com/api
```

---

## ⚙️ Post-Deployment Setup

### 1. Test Backend Endpoints

```bash
# Check health
curl https://your-backend-url.com/api

# Test auth
curl -X POST https://your-backend-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User",
    "familyName": "Test Family"
  }'
```

### 2. Test Email Functionality

- Register a new user
- Check if OTP email arrives
- Test forgot password
- Test daily reminders (wait for 9 PM or trigger manually)

### 3. Test Cron Jobs

Check Railway/Render logs at 9:00 PM for:
```
[ReminderService] Running daily expense reminder task at 9:00 PM
```

### 4. Configure Gmail for Production

**Important**: Gmail may block emails from new servers

**Solutions:**
1. **Use App Password** (already set up)
2. **Add Railway/Render IPs to SPF record** (advanced)
3. **Use SendGrid/Mailgun** (alternative, see below)

### 5. Monitor Application

**Railway:**
- Logs: Project → Service → Logs tab
- Metrics: Project → Service → Metrics tab

**Render:**
- Logs: Dashboard → Service → Logs
- Metrics: Dashboard → Service → Metrics

---

## 🌐 Custom Domain

### Add Custom Domain to Backend (Railway)

```
1. Buy domain (Namecheap, GoDaddy, etc.)
2. Railway → Your Service → Settings → Domains
3. Click "Generate Domain" or "Custom Domain"
4. Add your domain (e.g., api.yourfamily.com)
5. Add CNAME record in your DNS:
   - Name: api
   - Value: provided-by-railway.railway.app
```

### Add Custom Domain to Frontend (Vercel)

```
1. Vercel → Your Project → Settings → Domains
2. Add your domain (e.g., yourfamily.com)
3. Add DNS records as shown by Vercel:
   - Type: A
   - Name: @
   - Value: 76.76.21.21
   
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com
```

### Update Environment Variables

After adding custom domains:

**Frontend** `.env.production`:
```bash
VITE_API_URL=https://api.yourfamily.com/api
```

**Backend** CORS:
```typescript
app.enableCors({
  origin: ['https://yourfamily.com', 'https://www.yourfamily.com'],
  credentials: true,
});
```

---

## 📧 Alternative Email Providers

If Gmail doesn't work well in production:

### Option 1: SendGrid (Recommended)

**Free Tier**: 100 emails/day

```bash
# Install
npm install @sendgrid/mail

# Configure
SENDGRID_API_KEY=your-api-key
```

Update `email.service.ts`:
```typescript
import * as sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async sendEmail(to: string, subject: string, html: string) {
  await sgMail.send({
    to,
    from: process.env.EMAIL_FROM,
    subject,
    html,
  });
}
```

### Option 2: Mailgun

**Free Tier**: 5,000 emails/month (3 months)

```bash
npm install mailgun-js
```

### Option 3: AWS SES

**Pricing**: $0.10 per 1,000 emails
**Best for**: High volume, cheap

---

## 🔍 Troubleshooting

### Backend Issues

**Build Fails:**
```bash
# Check Node version
node -v  # Should be 18.x or 20.x

# Specify in package.json
"engines": {
  "node": "20.x",
  "npm": "10.x"
}
```

**Database Connection Fails:**
```bash
# Verify DATABASE_URL format
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require

# Test connection
npx prisma db pull
```

**Prisma Migrations Fail:**
```bash
# Generate Prisma Client
npx prisma generate

# Deploy migrations
npx prisma migrate deploy

# If stuck, reset (⚠️ deletes data)
npx prisma migrate reset --force
```

**Cron Jobs Don't Run:**
```bash
# Check logs at 9:00 PM
# Verify TZ environment variable
# Some platforms need "worker" process type
```

### Frontend Issues

**API Calls Fail (CORS):**
```typescript
// Backend main.ts - add frontend URL
app.enableCors({
  origin: [
    'http://localhost:8100',
    'https://your-frontend.vercel.app'
  ],
  credentials: true,
});
```

**Environment Variables Not Working:**
```bash
# Vercel: Must start with VITE_
VITE_API_URL=https://api.com

# Redeploy after changing env vars
vercel --prod
```

**Build Fails:**
```bash
# Check for TypeScript errors
npm run build

# Fix any linter errors
npm run lint
```

### Email Issues

**Emails Not Sending:**
```bash
# Check logs for errors
# Verify App Password (no spaces)
# Check Gmail security settings
# Try SendGrid instead
```

**Emails in Spam:**
```bash
# Add SPF record to DNS
# Use proper EMAIL_FROM address
# Warm up IP slowly
```

---

## 📊 Cost Estimate

### Free Tier Setup (Perfect for Starting)

| Service | Plan | Cost |
|---------|------|------|
| **Railway** | Free Trial | $5 credit/month |
| **Vercel** | Hobby | $0 |
| **Gmail** | Free | $0 |
| **Total** | | **$0/month** |

**Limits:**
- Railway: $5 credit (~100 hours compute)
- Vercel: 100GB bandwidth
- Gmail: 500 emails/day

### Paid Production Setup

| Service | Plan | Cost |
|---------|------|------|
| **Railway** | Developer | $5/month |
| **Vercel** | Pro | $20/month (if needed) |
| **SendGrid** | Essentials | $15/month |
| **Domain** | .com | $12/year |
| **Total** | | **$20-40/month** |

---

## 🚀 Quick Checklist

### Pre-Deployment
- [ ] Code pushed to GitHub
- [ ] Gmail App Password generated
- [ ] Database schema tested locally
- [ ] All features working locally

### Backend Deployment
- [ ] Railway/Render account created
- [ ] PostgreSQL database created
- [ ] Environment variables set
- [ ] Prisma migrations run
- [ ] Backend URL accessible

### Frontend Deployment
- [ ] Vercel/Netlify account created
- [ ] VITE_API_URL configured
- [ ] Build successful
- [ ] Frontend URL accessible

### Post-Deployment
- [ ] User registration works
- [ ] Email OTP received
- [ ] Login successful
- [ ] Income/expense CRUD works
- [ ] Dashboard displays correctly
- [ ] Admin features accessible
- [ ] Daily reminder tested (or wait for 9 PM)

---

## 📚 Next Steps After Deployment

1. **Test Everything**
   - Create test family
   - Add test transactions
   - Test all features

2. **Monitor Logs**
   - Check for errors
   - Monitor cron jobs
   - Track email delivery

3. **Share with Family**
   - Send frontend URL
   - Create family accounts
   - Explain features

4. **Set Up Monitoring**
   - UptimeRobot for uptime
   - Sentry for error tracking
   - Google Analytics for usage

5. **Regular Maintenance**
   - Check logs weekly
   - Update dependencies monthly
   - Backup database regularly

---

## 🆘 Need Help?

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **NestJS Docs**: https://docs.nestjs.com

---

**Your app is ready for deployment! Follow the steps above for Railway + Vercel (easiest) or choose your preferred platforms.** 🚀

