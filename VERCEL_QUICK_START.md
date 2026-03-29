# ⚡ Vercel Deployment - Quick Start

**Ultra-simple guide to deploy in 20 minutes!**

---

## 🎯 The Plan

```
Railway (Backend + Database) + Vercel (Frontend) = Your Live App
```

**Cost**: $0 (Free tiers)

---

## 📝 5 Simple Steps

### ✅ Step 1: Gmail App Password (5 min)

1. Go to: https://myaccount.google.com/security
2. Enable "2-Step Verification"
3. Go to: https://myaccount.google.com/apppasswords
4. Generate password for "Family Expense Tracker"
5. Copy the 16-character code (remove spaces)
6. **Save it!** ← You'll need this

---

### ✅ Step 2: Push to GitHub (3 min)

```bash
cd /Users/anurag/Desktop/expansis_Track

git init
git add .
git commit -m "Ready for deployment"
```

Create repo on GitHub: https://github.com/new
- Name: `family-expense-tracker`
- Don't initialize anything
- Click "Create"

```bash
git remote add origin https://github.com/YOUR_USERNAME/family-expense-tracker.git
git push -u origin main
```

---

### ✅ Step 3: Railway (Backend) (7 min)

**Go to**: https://railway.app

1. Login with GitHub
2. New Project → Deploy from GitHub repo
3. Choose `family-expense-tracker`
4. Click "New" → Database → PostgreSQL
5. Click Backend service → Settings:
   - Root Directory: `backend`
6. Click Variables → Raw Editor → Paste:

```env
JWT_SECRET=your-long-secret-min-32-chars
JWT_REFRESH_SECRET=another-long-secret-32-chars
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your16charapppassword
EMAIL_FROM=your.email@gmail.com
NODE_ENV=production
```

7. Settings → Generate Domain
8. **Copy the URL!** ← https://your-app.railway.app

---

### ✅ Step 4: Vercel (Frontend) (5 min)

**Go to**: https://vercel.com

1. Sign Up with GitHub
2. Add New → Project
3. Import `family-expense-tracker`
4. Configure:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output: `dist`
5. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-railway-url.railway.app/api`
   - ← Use Railway URL from Step 3!
6. Click Deploy
7. **Copy the URL!** ← https://your-app.vercel.app

---

### ✅ Step 5: Update CORS (3 min)

Edit `backend/src/main.ts` (line ~15):

```typescript
app.enableCors({
  origin: [
    'http://localhost:8100',
    'https://your-app.vercel.app',  // ← Add your Vercel URL
  ],
  credentials: true,
});
```

Push update:
```bash
git add .
git commit -m "Add Vercel URL to CORS"
git push
```

Wait 2 minutes for Railway to redeploy.

---

## 🧪 Test It!

**Open**: https://your-app.vercel.app

1. Click Register
2. Fill in details
3. Check email for OTP
4. Enter OTP → Login
5. Add income
6. Add expense
7. Check dashboard

**✅ If everything works → SUCCESS!** 🎉

---

## 📱 Share With Family

Send them this:

```
Hey! I set up our Family Expense Tracker!

👉 Register here: https://your-app.vercel.app

When registering, use this Family Code: [YOUR-CODE]
(You'll find your code on the Family page after logging in)

Check your email for the OTP code!
```

---

## ⏰ Daily Reminders

Your app will **automatically send reminder emails** to all family members every day at 9:00 PM!

Check Railway logs at 9 PM to see it working.

---

## 🐛 Troubleshooting

**Can't connect to backend?**
- Check VITE_API_URL in Vercel settings
- Make sure it ends with `/api`

**Email not working?**
- Check Railway → Backend → Variables
- Verify EMAIL_PASSWORD (no spaces)

**Database error?**
- Check Railway → PostgreSQL is running
- Restart backend service

---

## 📊 Your Setup

**Frontend**: https://your-app.vercel.app (Vercel)  
**Backend**: https://your-app.railway.app (Railway)  
**Database**: PostgreSQL (Railway)  
**Cost**: $0/month (free tiers)

---

## 📚 Detailed Guide

For complete step-by-step instructions with screenshots and detailed troubleshooting:

**Read**: `VERCEL_DEPLOYMENT_STEP_BY_STEP.md`

---

**🚀 Your app is live! Start tracking family expenses!** 💰

