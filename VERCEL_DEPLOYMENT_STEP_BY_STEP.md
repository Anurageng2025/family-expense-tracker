# 🚀 Vercel Deployment - Complete Step-by-Step Guide

Deploy your Family Expense Tracker using **Railway (Backend + Database)** and **Vercel (Frontend)**.

**Time Required**: 20-25 minutes  
**Cost**: $0 (Free tiers)

---

## 📋 What You'll Need

Before starting, have these ready:

1. ✅ **GitHub Account** - https://github.com (sign up if needed)
2. ✅ **Gmail Account** - For sending emails
3. ✅ **Gmail App Password** - 16-character code (we'll get this)
4. ✅ **Railway Account** - We'll create this (Step 2)
5. ✅ **Vercel Account** - We'll create this (Step 4)

---

## 🎯 Overview

```
Step 1: Get Gmail App Password (5 min)
Step 2: Push Code to GitHub (3 min)
Step 3: Deploy Backend on Railway (7 min)
Step 4: Deploy Frontend on Vercel (5 min)
Step 5: Test Your Live App (5 min)
```

---

## 🔐 STEP 1: Get Gmail App Password (5 minutes)

### 1.1 Enable 2-Step Verification

**Open**: https://myaccount.google.com/security

```
1. Scroll to "How you sign in to Google"
2. Click "2-Step Verification"
3. Click "Get Started"
4. Follow the prompts to set it up
5. Verify with your phone
```

### 1.2 Generate App Password

**Open**: https://myaccount.google.com/apppasswords

```
1. You'll see "App passwords" option
2. Click on it
3. In "Select app" dropdown → Choose "Other (Custom name)"
4. Type: "Family Expense Tracker"
5. Click "Generate"
6. You'll see a 16-character password like: "abcd efgh ijkl mnop"
7. COPY THIS PASSWORD (remove spaces: abcdefghijklmnop)
8. Save it somewhere safe - you'll need it in Step 3!
```

✅ **Done!** You have your Gmail App Password.

---

## 📤 STEP 2: Push Code to GitHub (3 minutes)

### 2.1 Open Terminal

```bash
cd /Users/anurag/Desktop/expansis_Track
```

### 2.2 Initialize Git (if not already done)

```bash
# Check if git is initialized
git status

# If you see "not a git repository", run:
git init
```

### 2.3 Stage and Commit Files

```bash
# Add all files
git add .

# Commit
git commit -m "Family Expense Tracker - Ready for deployment"
```

### 2.4 Create GitHub Repository

**Open**: https://github.com/new

```
Repository name: family-expense-tracker
Description: Full-stack family expense tracking application
Visibility: Public (or Private if you prefer)

⚠️ DO NOT check:
  - "Add a README file"
  - "Add .gitignore"
  - "Choose a license"

Click "Create repository"
```

### 2.5 Push to GitHub

**Copy the commands shown on GitHub, or use these:**

```bash
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/family-expense-tracker.git

# Push code
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

### 2.6 Verify Upload

Refresh your GitHub repository page - you should see all your files!

✅ **Done!** Code is on GitHub.

---

## 🔧 STEP 3: Deploy Backend on Railway (7 minutes)

### 3.1 Create Railway Account

**Open**: https://railway.app

```
1. Click "Login"
2. Click "Login with GitHub"
3. Authorize Railway to access your GitHub
4. Complete any verification steps
```

### 3.2 Create New Project

```
1. You'll see the Railway dashboard
2. Click "New Project" button
3. Select "Deploy from GitHub repo"
```

### 3.3 Connect Your Repository

```
1. You'll see a list of your GitHub repositories
2. Find "family-expense-tracker"
3. Click "Deploy Now"
4. Railway will start analyzing your repo
```

### 3.4 Add PostgreSQL Database

```
1. In your project, you'll see your backend service deploying
2. Click the "New" button (or right-click in empty space)
3. Select "Database"
4. Click "Add PostgreSQL"
5. Database will be created in seconds
6. Railway automatically connects it to your backend!
```

### 3.5 Configure Backend Service

```
1. Click on your backend service (not the database)
2. Go to "Settings" tab
3. Scroll to "Service Settings"
4. Find "Root Directory"
5. Change from "/" to: backend
6. Click the checkmark to save
```

### 3.6 Set Build Commands

Still in Settings tab:

```
Scroll to "Build"

Build Command:
npm install && npx prisma generate && npx prisma migrate deploy

Start Command:
npm run start:prod

(These should auto-detect, but verify them)
```

### 3.7 Add Environment Variables

```
1. Click "Variables" tab (at the top)
2. Click "RAW Editor" button
3. Paste this (REPLACE the values with YOUR info):
```

**Copy this template and fill in YOUR values:**

```env
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long-change-this
JWT_REFRESH_SECRET=another-super-secret-refresh-key-32-characters-change-this
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your.actual.email@gmail.com
EMAIL_PASSWORD=your16charapppasswordfromstep1
EMAIL_FROM=your.actual.email@gmail.com
NODE_ENV=production
```

**Important Notes:**
- `JWT_SECRET` - Make this a long random string (min 32 chars)
- `JWT_REFRESH_SECRET` - Make this a different long random string
- `EMAIL_USER` - Your actual Gmail address
- `EMAIL_PASSWORD` - The 16-char app password from Step 1 (NO SPACES!)
- `EMAIL_FROM` - Same as EMAIL_USER

```
4. Click "Update Variables"
5. Service will restart automatically
```

### 3.8 Wait for Deployment

```
1. Go to "Deployments" tab
2. Watch the logs
3. Wait for "✅ Build successful"
4. Then wait for "✅ Deployed"
5. Usually takes 2-3 minutes
```

Look for these success messages in logs:
```
✅ Database connected successfully
🚀 Application is running on: http://...
```

### 3.9 Get Backend URL

```
1. Go to "Settings" tab
2. Scroll to "Networking" section
3. Under "Public Networking"
4. Click "Generate Domain"
5. You'll get a URL like: https://family-expense-tracker-production-xxxx.up.railway.app
```

**🎯 COPY THIS URL! You'll need it in Step 4!**

Write it here: _______________________________________________

### 3.10 Test Backend

Open your browser or terminal:

```bash
# Replace with YOUR backend URL
curl https://your-backend-url.up.railway.app/api
```

You should see: API response or a welcome message.

✅ **Done!** Backend is live with database!

---

## 🌐 STEP 4: Deploy Frontend on Vercel (5 minutes)

### 4.1 Create Vercel Account

**Open**: https://vercel.com

```
1. Click "Sign Up"
2. Click "Continue with GitHub"
3. Authorize Vercel to access your GitHub
4. Complete profile setup if prompted
```

### 4.2 Create New Project

```
1. You'll see Vercel dashboard
2. Click "Add New..." button (top right)
3. Select "Project"
```

### 4.3 Import Repository

```
1. You'll see "Import Git Repository"
2. Find "family-expense-tracker"
3. Click "Import"
```

### 4.4 Configure Project Settings

```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**Click "Environment Variables" to expand the section**

### 4.5 Add Environment Variable

```
1. Under "Environment Variables" section
2. Add variable:

   Key: VITE_API_URL
   Value: https://your-backend-url.up.railway.app/api

   (Use the Railway URL from Step 3.9!)

3. Select: Production, Preview, Development (all three)
```

**⚠️ CRITICAL:** Make sure you add `/api` at the end of the URL!

Example:
```
VITE_API_URL=https://family-expense-tracker-production-abcd.up.railway.app/api
                                                                           ↑↑↑↑
                                                                      Don't forget!
```

### 4.6 Deploy!

```
1. Click "Deploy" button
2. Vercel will start building
3. Watch the build logs
4. Takes 2-3 minutes
```

### 4.7 Get Frontend URL

```
After deployment completes:

1. You'll see "Congratulations! 🎉"
2. Your app URL: https://family-expense-tracker-xxx.vercel.app
3. Click "Visit" to open your app
```

**🎯 COPY THIS URL!**

Write it here: _______________________________________________

✅ **Done!** Frontend is live!

---

## 🔄 STEP 5: Update CORS in Backend (3 minutes)

Your frontend can't talk to backend yet due to CORS. Let's fix it!

### 5.1 Update Backend Code

Open your code editor:

**File**: `/Users/anurag/Desktop/expansis_Track/backend/src/main.ts`

**Find** this section (around line 13-18):

```typescript
app.enableCors({
  origin: [
    'http://localhost:8100',
  ],
  credentials: true,
});
```

**Change to** (add your Vercel URL):

```typescript
app.enableCors({
  origin: [
    'http://localhost:8100',
    'https://family-expense-tracker-xxx.vercel.app',  // Add your Vercel URL
    'https://*.vercel.app',  // Allow all Vercel preview deployments
  ],
  credentials: true,
});
```

**Replace** `family-expense-tracker-xxx.vercel.app` with YOUR actual Vercel URL from Step 4.7!

### 5.2 Commit and Push

```bash
cd /Users/anurag/Desktop/expansis_Track

git add .
git commit -m "Add Vercel frontend URL to CORS"
git push
```

### 5.3 Wait for Railway to Redeploy

```
1. Go back to Railway dashboard
2. Click your backend service
3. Go to "Deployments" tab
4. New deployment will start automatically (triggered by git push)
5. Wait 2-3 minutes
6. Look for "✅ Deployed"
```

✅ **Done!** Backend now accepts requests from your frontend!

---

## 🧪 STEP 6: Test Your Live App (5 minutes)

### 6.1 Open Your App

**Open your Vercel URL in browser:**

```
https://your-frontend-url.vercel.app
```

### 6.2 Test Registration

```
1. Click "Register" tab
2. Fill in:
   - Email: your-real-email@gmail.com
   - Password: Test123!
   - Name: Your Name
   - Family Name: Your Family Name
3. Click "Register & Send OTP"
4. Wait a few seconds
```

### 6.3 Check Email

```
1. Open your email inbox
2. Look for email from "Family Expense Tracker"
3. Subject: "Your OTP for Family Expense Tracker"
4. Copy the 6-digit OTP code
```

**Not in inbox?** Check spam/junk folder!

### 6.4 Verify OTP

```
1. Enter the 6-digit OTP
2. Click "Verify OTP"
3. You should be logged in!
```

### 6.5 Test Core Features

**Test 1: Add Income**
```
1. Go to "Incomes" page
2. Click "+"
3. Fill in:
   - Amount: 5000
   - Category: Salary
   - Source: Monthly Salary
   - Date: Today
4. Click "Add Income"
5. ✅ Should see success message
```

**Test 2: Add Expense**
```
1. Go to "Expenses" page
2. Click "+"
3. Fill in:
   - Amount: 50
   - Category: Food
   - Description: Lunch
   - Date: Today
4. Click "Add Expense"
5. ✅ Should see success message
```

**Test 3: View Dashboard**
```
1. Go to "Dashboard"
2. Should see:
   - ✅ Your income: $5000
   - ✅ Your expense: $50
   - ✅ Charts with data
```

**Test 4: Check Family Page**
```
1. Go to "Family" page
2. Should see:
   - ✅ Your family name
   - ✅ Family code
   - ✅ Your name in members list
   - ✅ ADMIN badge
```

**Test 5: Send Manual Reminder (Admin)**
```
1. On Family page
2. Scroll to "Send Expense Reminders" card (purple)
3. Click mail icon (📧) next to your name
4. Check your email
5. ✅ Should receive reminder email
```

### 6.6 Check Backend Logs

**Railway Dashboard:**
```
1. Go to Railway project
2. Click backend service
3. Click "Logs" tab
4. You should see:
   - ✅ User registration logs
   - ✅ Email sent logs
   - ✅ API request logs
```

✅ **Done!** Everything is working!

---

## 🎉 SUCCESS! Your App is Live!

### Your Live URLs:

**Frontend (Share this with family):**
```
https://your-frontend-url.vercel.app
```

**Backend (Keep private):**
```
https://your-backend-url.railway.app
```

**Database:**
```
Managed by Railway (automatic backups)
```

---

## 👨‍👩‍👧‍👦 Invite Your Family

### Share with family members:

**Send them:**
```
🎉 Our Family Expense Tracker is ready!

👉 Register here: https://your-frontend-url.vercel.app

When registering:
1. Use your own email
2. Create a password
3. Enter your name
4. Use this Family Code: [YOUR-FAMILY-CODE]
   (You'll see your family code on the Family page)

After registration, check your email for OTP!
```

### Your Family Code:

```
1. Login to your app
2. Go to Family page
3. Copy the "Family Code" (6 digits)
4. Share with family members
5. They enter this code during registration to join your family
```

---

## ⏰ Daily Reminders

### Automatic Reminders at 9 PM

Your app will automatically send reminder emails to all family members every day at 9:00 PM!

**To verify it's working:**
```
1. Wait until 9:00 PM
2. Check Railway logs:
   - Go to Railway → Backend → Logs
   - Look for: "[ReminderService] Running daily expense reminder"
3. Check your email inbox
4. You should receive: "Daily Expense Reminder"
```

**Set your timezone:**

Edit `/Users/anurag/Desktop/expansis_Track/backend/src/scheduler/reminder.service.ts`

Change line ~22:
```typescript
@Cron('0 0 21 * * *', {
  timeZone: 'America/New_York',  // Change to your timezone
})
```

Common timezones:
- `America/New_York` - Eastern Time
- `America/Chicago` - Central Time
- `America/Los_Angeles` - Pacific Time
- `Europe/London` - UK Time
- `Asia/Kolkata` - India Time
- `Asia/Tokyo` - Japan Time

Then push changes:
```bash
git add .
git commit -m "Update timezone"
git push
```

---

## 💰 Cost & Usage

### Current Setup: FREE

| Service | Plan | Cost | Limits |
|---------|------|------|--------|
| Railway | Free Trial | $0 | $5 credit/month |
| Vercel | Hobby | $0 | 100GB bandwidth |
| Gmail | Free | $0 | 500 emails/day |

**Railway $5 credit lasts:**
- Light usage: ~30 days
- Medium usage: ~15-20 days

**When Railway credit runs out:**
- Hobby Plan: $5/month
- Includes PostgreSQL
- 512MB RAM
- 1GB storage

**Monitor your usage:**
- Railway: https://railway.app/account/usage
- Vercel: https://vercel.com/dashboard/usage

---

## 🔧 Maintenance

### Update Your App

**After making changes to code:**

```bash
cd /Users/anurag/Desktop/expansis_Track

# Make your changes, then:
git add .
git commit -m "Description of changes"
git push

# Railway and Vercel will auto-deploy!
```

### View Logs

**Backend logs (Railway):**
```
1. Railway dashboard
2. Your project
3. Backend service
4. Logs tab
```

**Frontend logs (Vercel):**
```
1. Vercel dashboard
2. Your project
3. Deployments tab
4. Click a deployment → View Function Logs
```

### Backup Database

**Railway auto-backups** your PostgreSQL database daily!

**Manual backup:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Backup
railway run npx prisma db pull > backup-$(date +%Y%m%d).sql
```

---

## 🐛 Troubleshooting

### ❌ "Cannot connect to backend"

**Check:**
1. Verify VITE_API_URL in Vercel settings
2. Make sure URL ends with `/api`
3. Check CORS in backend/src/main.ts
4. Verify Railway backend is running

**Fix:**
```
1. Vercel dashboard → Your project → Settings → Environment Variables
2. Verify VITE_API_URL = https://your-backend-url/api
3. Redeploy: Deployments → Click "..." → Redeploy
```

### ❌ "Email OTP not arriving"

**Check:**
1. Spam/junk folder
2. Railway logs for email errors
3. EMAIL_PASSWORD has no spaces
4. App Password is correct

**Fix:**
```
1. Railway → Backend → Variables
2. Check EMAIL_PASSWORD (should be 16 chars, no spaces)
3. Regenerate App Password if needed
4. Update variable
5. Redeploy
```

### ❌ "Database connection failed"

**Check:**
1. PostgreSQL service running on Railway
2. DATABASE_URL variable exists

**Fix:**
```
1. Railway → Database service
2. Check status (should be green)
3. Backend → Variables
4. Verify DATABASE_URL exists (auto-added)
5. Restart backend service
```

### ❌ "CORS error"

**Fix:**
```
1. Edit backend/src/main.ts
2. Add your Vercel URL to origins array
3. Push to GitHub
4. Wait for Railway to redeploy
```

### ❌ "Build failed on Railway"

**Check logs for error, common fixes:**

```
1. Node version issue:
   - Railway → Backend → Settings → Environment
   - No action needed (auto-detects)

2. Prisma issue:
   - Check build command includes: npx prisma generate

3. Dependencies issue:
   - Verify package.json is correct
   - Check package-lock.json exists
```

### ❌ "Build failed on Vercel"

**Check:**
```
1. Vercel → Project → Deployments → Failed deployment
2. Click to see logs
3. Common fixes:
   - Root directory = frontend
   - Framework = Vite
   - Build command = npm run build
   - Output = dist
```

### ❌ "Daily reminders not working"

**Check at 9:00 PM:**
```
1. Railway → Backend → Logs
2. Look for: "[ReminderService] Running daily expense reminder"
3. If not found:
   - Check SchedulerModule imported in app.module.ts
   - Verify @nestjs/schedule is installed
   - Check timezone setting
```

---

## 🎯 Quick Reference

### Important URLs

**Dashboards:**
- Railway: https://railway.app/dashboard
- Vercel: https://vercel.com/dashboard
- GitHub: https://github.com/YOUR_USERNAME/family-expense-tracker

**Your App:**
- Frontend: https://your-app.vercel.app
- Backend: https://your-app.railway.app/api

### Commands

**Deploy updates:**
```bash
git add .
git commit -m "Your changes"
git push
```

**View Railway logs:**
```bash
railway logs
```

**View Vercel logs:**
```bash
vercel logs
```

---

## ✅ Deployment Complete!

### What You've Accomplished:

✅ Backend deployed on Railway  
✅ PostgreSQL database provisioned  
✅ Frontend deployed on Vercel  
✅ CORS configured  
✅ Email system working  
✅ Daily reminders active  
✅ All features tested  
✅ Ready for family to use!

### Next Steps:

1. **Share with family** - Send them your Vercel URL
2. **Monitor usage** - Check Railway & Vercel dashboards
3. **Wait for 9 PM** - Daily reminders will send automatically
4. **Collect feedback** - Ask family for suggestions
5. **Enjoy!** - Start tracking expenses together

---

## 📚 Additional Resources

- **Full Deployment Guide**: `DEPLOYMENT_GUIDE.md`
- **Email Setup Help**: `FIX_EMAIL_ISSUE.md`
- **Admin Features**: `MANUAL_REMINDERS.md`
- **Project Overview**: `PROJECT_SUMMARY.md`

---

## 🆘 Need Help?

**Railway Issues:**
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

**Vercel Issues:**
- Docs: https://vercel.com/docs
- Discord: https://discord.gg/vercel

**App Issues:**
- Check logs first (Railway & Vercel)
- Review troubleshooting section above
- Check environment variables

---

**🎉 Congratulations! Your Family Expense Tracker is live on Vercel + Railway!**

**Your app**: https://your-app.vercel.app 🚀

Share it with your family and start tracking expenses together! 💰📊👨‍👩‍👧‍👦

