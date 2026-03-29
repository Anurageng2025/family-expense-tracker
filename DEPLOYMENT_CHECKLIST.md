# ✅ Deployment Checklist

Use this checklist to ensure smooth deployment of your Family Expense Tracker.

---

## 📋 Pre-Deployment Checklist

### Code Preparation
- [ ] All features tested locally
- [ ] Backend running on http://localhost:3000
- [ ] Frontend running on http://localhost:8100
- [ ] Database migrations working
- [ ] Email sending works (OTP, reminders)
- [ ] All environment variables documented

### Accounts Setup
- [ ] GitHub account created
- [ ] Railway account (or Render/Heroku)
- [ ] Vercel account (or Netlify)
- [ ] Gmail App Password generated

### Configuration Files
- [ ] `.gitignore` created ✓
- [ ] `backend/railway.json` created ✓
- [ ] `frontend/vercel.json` created ✓
- [ ] `backend/package.json` updated with engines ✓
- [ ] `frontend/src/services/api.ts` uses env variable ✓

---

## 🚀 Deployment Steps

### Step 1: Push to GitHub
- [ ] Git initialized
- [ ] All files committed
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Repository URL: _______________________

### Step 2: Backend Deployment (Railway)
- [ ] Railway account connected
- [ ] New project created
- [ ] Repository connected
- [ ] Root directory set to `backend`
- [ ] PostgreSQL database added
- [ ] Environment variables configured:
  - [ ] JWT_SECRET
  - [ ] JWT_REFRESH_SECRET
  - [ ] EMAIL_HOST
  - [ ] EMAIL_PORT
  - [ ] EMAIL_USER
  - [ ] EMAIL_PASSWORD
  - [ ] EMAIL_FROM
  - [ ] NODE_ENV=production
- [ ] Build command set
- [ ] Start command set
- [ ] Deployment successful
- [ ] Backend URL obtained: _______________________
- [ ] API accessible: `curl https://your-backend-url.com/api`

### Step 3: Database Setup
- [ ] PostgreSQL provisioned
- [ ] DATABASE_URL auto-configured
- [ ] Prisma migrations deployed
- [ ] Database connected successfully
- [ ] Check logs for "✅ Database connected successfully"

### Step 4: Frontend Deployment (Vercel)
- [ ] Vercel account connected
- [ ] New project created
- [ ] Repository connected
- [ ] Root directory set to `frontend`
- [ ] Framework preset set to `Vite`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variable added:
  - [ ] VITE_API_URL = backend URL from Step 2
- [ ] Deployment successful
- [ ] Frontend URL obtained: _______________________
- [ ] Site loads properly

### Step 5: CORS Configuration
- [ ] Backend `main.ts` updated with frontend URL
- [ ] Changes committed to GitHub
- [ ] Backend redeployed automatically
- [ ] CORS errors resolved

---

## 🧪 Testing Checklist

### Registration & Authentication
- [ ] Can access frontend URL
- [ ] Registration form loads
- [ ] Can register new user
- [ ] OTP email received
- [ ] Can verify OTP
- [ ] Can login successfully
- [ ] JWT token stored
- [ ] Protected routes work

### Core Features
- [ ] Dashboard loads
- [ ] Can add income
- [ ] Can add expense
- [ ] Can view transactions
- [ ] Can edit income/expense
- [ ] Can delete income/expense
- [ ] Charts display correctly
- [ ] Family summary works
- [ ] Personal summary works

### Family Features
- [ ] Family page loads
- [ ] Can see family members
- [ ] Family code displayed
- [ ] Can invite members (share family code)
- [ ] New members can join

### Admin Features (if admin)
- [ ] Member Reports page accessible
- [ ] Can view all member transactions
- [ ] Can send individual reminder
- [ ] Can send reminders to all
- [ ] Can select & send reminders
- [ ] Manual reminder emails received

### Email Features
- [ ] OTP emails arrive
- [ ] Forgot password emails arrive
- [ ] Forgot family code emails arrive
- [ ] Manual reminder emails arrive
- [ ] Check spam folder if not in inbox

### Cron Jobs
- [ ] Wait until 9:00 PM
- [ ] Check backend logs for reminder job
- [ ] Verify daily reminder emails sent
- [ ] All family members received email

---

## 📊 Monitoring Checklist

### Day 1 After Deployment
- [ ] Check backend logs for errors
- [ ] Check frontend logs for errors
- [ ] Monitor email delivery
- [ ] Test all features again
- [ ] Share URL with family

### Week 1 After Deployment
- [ ] Check Railway/Render usage
- [ ] Verify daily reminders working
- [ ] Check database size
- [ ] Monitor error rates
- [ ] Collect user feedback

### Monthly
- [ ] Review Railway/Render costs
- [ ] Check database backups
- [ ] Update dependencies if needed
- [ ] Review and optimize queries
- [ ] Check security updates

---

## 🔐 Security Checklist

- [ ] JWT secrets are strong (32+ chars)
- [ ] Environment variables not in code
- [ ] `.env` files in `.gitignore`
- [ ] CORS configured properly
- [ ] HTTPS enabled (auto by Railway/Vercel)
- [ ] Database credentials secure
- [ ] Gmail App Password used (not regular password)
- [ ] No sensitive data in logs
- [ ] Rate limiting considered (future)
- [ ] Input validation working

---

## 💰 Cost Tracking

### Current Setup
- **Railway**: $5 credit (free trial)
- **Vercel**: Free tier
- **Gmail**: Free (500 emails/day)
- **Total**: $0/month initially

### Monitor Usage
- [ ] Railway credit remaining: _______
- [ ] Vercel bandwidth used: _______
- [ ] Emails sent per day: _______

### When to Upgrade
- [ ] Railway credit exhausted → $5/month hobby plan
- [ ] Vercel bandwidth exceeded → $20/month pro plan
- [ ] Email limits hit → SendGrid $15/month

---

## 📝 Important URLs & Credentials

### Live Application
- **Frontend URL**: _______________________________
- **Backend URL**: _______________________________
- **Database**: (Railway internal)

### Dashboards
- **Railway Dashboard**: https://railway.app/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repo**: _______________________________

### Credentials (Keep Secure!)
- **JWT_SECRET**: _______________________________
- **JWT_REFRESH_SECRET**: _______________________________
- **EMAIL_PASSWORD**: _______________________________
- **Database Password**: (auto-generated by Railway)

⚠️ **Never commit these credentials to Git!**

---

## 🆘 Troubleshooting

### Backend Not Starting
- [ ] Check Railway logs
- [ ] Verify environment variables
- [ ] Check DATABASE_URL format
- [ ] Verify Node version (18+)
- [ ] Check build logs

### Frontend Not Loading
- [ ] Check Vercel logs
- [ ] Verify build succeeded
- [ ] Check VITE_API_URL
- [ ] Test API endpoint directly
- [ ] Check browser console

### Database Connection Fails
- [ ] Verify PostgreSQL provisioned
- [ ] Check DATABASE_URL in env vars
- [ ] Run Prisma migrations
- [ ] Check database logs

### CORS Errors
- [ ] Update backend main.ts
- [ ] Add frontend URL to CORS origins
- [ ] Redeploy backend
- [ ] Clear browser cache

### Emails Not Sending
- [ ] Check EMAIL_PASSWORD (no spaces)
- [ ] Verify App Password is correct
- [ ] Check Gmail security settings
- [ ] Review backend logs
- [ ] Consider SendGrid alternative

### Cron Jobs Not Running
- [ ] Check Railway logs at 9 PM
- [ ] Verify TZ environment variable
- [ ] Check SchedulerModule imported
- [ ] Verify platform supports cron

---

## ✅ Final Checklist

### Ready for Production?
- [ ] All features working
- [ ] All tests passed
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Documentation complete
- [ ] Family members invited
- [ ] Custom domain (optional)
- [ ] SSL/HTTPS enabled
- [ ] Performance acceptable
- [ ] Security reviewed

### Share With Family
- [ ] Send frontend URL
- [ ] Explain registration process
- [ ] Share family code
- [ ] Provide user guide
- [ ] Set up support channel

---

## 🎉 Post-Launch

### Congratulations! Your app is live! 🚀

**Next Steps:**
1. Monitor for 24 hours
2. Collect feedback
3. Fix any issues
4. Optimize performance
5. Plan future features

**Maintenance:**
- Check logs weekly
- Update dependencies monthly
- Backup database regularly
- Monitor costs
- Respond to user feedback

---

**Deployment Date**: _______________________
**Deployed By**: _______________________
**Version**: 1.0.0

---

**Need Help?** See:
- `DEPLOYMENT_GUIDE.md` - Complete guide
- `DEPLOY_NOW.md` - Quick start
- `ENVIRONMENT_SETUP.md` - Env variables
- `FIX_EMAIL_ISSUE.md` - Email troubleshooting

