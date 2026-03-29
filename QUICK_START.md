# ⚡ Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

- Node.js 16+
- PostgreSQL running
- Gmail account with app password

## 🚀 Quick Setup

### 1. Database (30 seconds)

```bash
# Create database in PostgreSQL
psql -U postgres -c "CREATE DATABASE family_expense_tracker;"
```

### 2. Backend (2 minutes)

```bash
# Navigate and install
cd backend
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database URL and Gmail credentials

# Setup database
npx prisma generate
npx prisma migrate dev --name init

# Start server
npm run start:dev
```

**Backend should be running on http://localhost:3000**

### 3. Frontend (2 minutes)

```bash
# Open new terminal
cd frontend
npm install

# Start server
npm run dev
```

**Frontend should be running on http://localhost:8100**

### 4. Test the App (1 minute)

1. Open http://localhost:8100
2. Click "Register"
3. Enter email and get OTP
4. Complete registration
5. Start tracking! 🎉

## 📝 Minimal .env Configuration

```env
# Backend .env (minimum required)
DATABASE_URL="postgresql://postgres:password@localhost:5432/family_expense_tracker"
JWT_ACCESS_SECRET="change-this-secret-key-123"
JWT_REFRESH_SECRET="change-this-refresh-key-456"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
```

## 🔍 Check Everything Works

```bash
# Backend health check
curl http://localhost:3000/api

# Database viewer
cd backend && npx prisma studio

# Frontend
# Open http://localhost:8100 in browser
```

## 📱 URLs

- **Frontend**: http://localhost:8100
- **Backend API**: http://localhost:3000/api
- **Prisma Studio**: http://localhost:5555 (when running)

## 🆘 Quick Fixes

**Backend won't start?**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

**Database error?**
```bash
cd backend
npx prisma generate
npx prisma migrate reset
```

**Frontend won't start?**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## ✅ You're Done!

Now you can:
- 📝 Register an account
- 👨‍👩‍👧‍👦 Create or join a family
- 💵 Add incomes and expenses
- 📊 View beautiful dashboards
- 📱 Build mobile apps (optional)

For detailed setup, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

**Happy Tracking! 💰**

