# 💻 Setup on New Device - Complete Guide

Complete guide to set up the Family Expense Tracker on a new computer or after deleting `node_modules`.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Clone or Copy Project](#clone-or-copy-project)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Database Setup](#database-setup)
6. [Environment Variables](#environment-variables)
7. [Run the Application](#run-the-application)
8. [Verify Everything Works](#verify-everything-works)
9. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

Install these on your new device:

### 1. Node.js & npm

**Check if installed:**
```bash
node -v
npm -v
```

**If not installed:**

**macOS:**
```bash
# Using Homebrew
brew install node

# Or download from: https://nodejs.org (LTS version)
```

**Windows:**
```
Download from: https://nodejs.org
Install LTS version (20.x or 18.x)
```

**Linux:**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

**Required versions:**
- Node.js: >= 18.0.0
- npm: >= 9.0.0

### 2. PostgreSQL

**Check if installed:**
```bash
psql --version
```

**If not installed:**

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Windows:**
```
Download from: https://www.postgresql.org/download/windows/
Install PostgreSQL 15
```

**Linux:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 3. Git (if cloning from GitHub)

**Check if installed:**
```bash
git --version
```

**If not installed:**

**macOS:**
```bash
brew install git
```

**Windows:**
```
Download from: https://git-scm.com/download/win
```

**Linux:**
```bash
sudo apt install git
```

---

## 📁 Clone or Copy Project

### Option 1: Clone from GitHub (if you pushed to GitHub)

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/family-expense-tracker.git

# Navigate to project
cd family-expense-tracker
```

### Option 2: Copy from USB/Drive (if transferring files)

```bash
# Copy the entire project folder to your new device
# Make sure to copy EVERYTHING except node_modules folders
```

### Option 3: Already have files (reinstalling packages)

```bash
# If you already have the project but deleted node_modules
cd /path/to/expansis_Track
```

---

## 🔧 Backend Setup

### Step 1: Navigate to Backend

```bash
cd backend
```

### Step 2: Install All Backend Packages

```bash
npm install
```

**This will install ALL packages listed in `package.json`:**

```json
{
  "dependencies": {
    "@nestjs/common": "^10.3.0",
    "@nestjs/config": "^3.1.1",
    "@nestjs/core": "^10.3.0",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/passport": "^10.0.3",
    "@nestjs/platform-express": "^10.3.0",
    "@nestjs/schedule": "^4.1.2",
    "@prisma/client": "^5.8.0",
    "bcrypt": "^5.1.1",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "nodemailer": "^6.9.7",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "reflect-metadata": "^0.1.13",
    "rimraf": "^5.0.5",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.3.0",
    "@nestjs/schematics": "^10.1.0",
    "@types/bcrypt": "^5.0.2",
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.6",
    "@types/nodemailer": "^6.4.14",
    "@types/passport-jwt": "^4.0.0",
    "@typescript-eslint/eslint-plugin": "^6.18.0",
    "@typescript-eslint/parser": "^6.18.0",
    "eslint": "^8.56.0",
    "prettier": "^3.1.1",
    "prisma": "^5.8.0",
    "ts-loader": "^9.5.1",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.3.3"
  }
}
```

**Installation time:** 2-3 minutes

### Step 3: Generate Prisma Client

```bash
npx prisma generate
```

This generates the Prisma database client based on your schema.

### Step 4: Create .env File

```bash
# Create .env file
touch .env

# Or on Windows
type nul > .env
```

**Copy this content into `backend/.env`:**

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/family_expense_tracker?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-min-32-chars"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-too-min-32-chars"

# Email Configuration (Gmail)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your.email@gmail.com"
EMAIL_PASSWORD="your-16-character-gmail-app-password"
EMAIL_FROM="your.email@gmail.com"

# Application
NODE_ENV="development"
PORT="3000"

# Timezone (for cron jobs)
TZ="America/New_York"
```

**Update these values:**
- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - A long random string (min 32 characters)
- `JWT_REFRESH_SECRET` - Another long random string
- `EMAIL_USER` - Your Gmail address
- `EMAIL_PASSWORD` - Your Gmail App Password (see `FIX_EMAIL_ISSUE.md`)
- `EMAIL_FROM` - Same as EMAIL_USER

### Step 5: Verify Backend Installation

```bash
# Check if all packages installed
ls node_modules/

# You should see folders like:
# @nestjs, @prisma, bcrypt, nodemailer, etc.
```

---

## 🎨 Frontend Setup

### Step 1: Navigate to Frontend

```bash
# From project root
cd ../frontend

# Or directly
cd frontend
```

### Step 2: Install All Frontend Packages

```bash
npm install
```

**This will install ALL packages listed in `package.json`:**

```json
{
  "dependencies": {
    "@ionic/react": "^7.6.4",
    "@ionic/react-router": "^7.6.4",
    "axios": "^1.6.5",
    "chart.js": "^4.4.1",
    "ionicons": "^7.2.2",
    "react": "^18.2.0",
    "react-chartjs-2": "^5.2.0",
    "react-dom": "^18.2.0",
    "react-router": "^6.21.2",
    "react-router-dom": "^6.21.2",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "@types/node": "^20.10.6",
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "@typescript-eslint/eslint-plugin": "^6.18.0",
    "@typescript-eslint/parser": "^6.18.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.56.0",
    "eslint-plugin-react": "^7.33.2",
    "typescript": "^5.3.3",
    "vite": "^5.0.11"
  }
}
```

**Installation time:** 2-3 minutes

### Step 3: Create .env File (Optional for Development)

```bash
# Create .env file
touch .env

# Or on Windows
type nul > .env
```

**Copy this content into `frontend/.env`:**

```env
# API Configuration
VITE_API_URL="http://localhost:3000/api"
```

### Step 4: Verify Frontend Installation

```bash
# Check if all packages installed
ls node_modules/

# You should see folders like:
# @ionic, axios, react, vite, etc.
```

---

## 🗄️ Database Setup

### Step 1: Create PostgreSQL Database

**Option A: Using psql command line**

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE family_expense_tracker;

# Exit
\q
```

**Option B: Using pgAdmin (GUI)**
```
1. Open pgAdmin
2. Right-click "Databases"
3. Create → Database
4. Name: family_expense_tracker
5. Click "Save"
```

### Step 2: Update DATABASE_URL

In `backend/.env`, update the DATABASE_URL:

```env
# Format: postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/family_expense_tracker?schema=public"
```

**Replace:**
- `postgres` - Your PostgreSQL username (default is `postgres`)
- `your_password` - Your PostgreSQL password
- `localhost` - Database host (use `localhost` for local development)
- `5432` - PostgreSQL port (default is `5432`)
- `family_expense_tracker` - Your database name

### Step 3: Run Database Migrations

```bash
cd backend

# Run migrations to create all tables
npx prisma migrate dev

# This will create tables: User, Family, Income, Expense, etc.
```

**You should see:**
```
✔ Generated Prisma Client
✔ The migration has been created successfully
✔ Database synchronized
```

### Step 4: Verify Database Setup

```bash
# Open Prisma Studio to view database
npx prisma studio
```

This opens a browser window where you can see all your database tables.

---

## 🔐 Environment Variables

### Backend Environment Variables

**File**: `backend/.env`

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/family_expense_tracker?schema=public"

# JWT Secrets (generate strong random strings)
JWT_SECRET="use-a-very-long-random-string-here-at-least-32-characters-long"
JWT_REFRESH_SECRET="use-another-different-long-random-string-32-chars-minimum"

# Email Configuration
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your.actual.email@gmail.com"
EMAIL_PASSWORD="abcdefghijklmnop"  # 16-char Gmail App Password
EMAIL_FROM="your.actual.email@gmail.com"

# Application Settings
NODE_ENV="development"
PORT="3000"

# Timezone for cron jobs (9 PM daily reminders)
TZ="America/New_York"
```

### Frontend Environment Variables

**File**: `frontend/.env`

```env
VITE_API_URL="http://localhost:3000/api"
```

### Generate Strong Secrets

**Option 1: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2: Using OpenSSL**
```bash
openssl rand -hex 32
```

**Option 3: Online Generator**
https://randomkeygen.com/ (use "CodeIgniter Encryption Keys")

---

## 🚀 Run the Application

### Terminal 1: Start Backend

```bash
cd backend
npm run start:dev
```

**You should see:**
```
[Nest] 12345  - LOG [NestFactory] Starting Nest application...
[Nest] 12345  - LOG [InstanceLoader] PrismaModule dependencies initialized
[Nest] 12345  - LOG [InstanceLoader] ScheduleModule dependencies initialized
✅ Database connected successfully
[Nest] 12345  - LOG [NestApplication] Nest application successfully started
🚀 Application is running on: http://localhost:3000/api
```

**Backend is ready when you see:** ✅ Database connected successfully

### Terminal 2: Start Frontend

**Open a NEW terminal window:**

```bash
cd frontend
npm run dev
```

**You should see:**
```
VITE v5.4.21  ready in 196 ms

➜  Local:   http://localhost:8100/
➜  Network: use --host to expose
```

**Frontend is ready!**

---

## ✅ Verify Everything Works

### 1. Check Backend API

**Open browser:** http://localhost:3000/api

You should see API response or welcome message.

### 2. Check Frontend

**Open browser:** http://localhost:8100

You should see the login/register page.

### 3. Test Registration

```
1. Click "Register" tab
2. Fill in:
   - Email: test@example.com
   - Password: Test123!
   - Name: Test User
   - Family Name: Test Family
3. Click "Register & Send OTP"
4. Check your email for OTP
5. Enter OTP and verify
6. You should be logged in!
```

### 4. Test Features

- ✅ Add Income
- ✅ Add Expense
- ✅ View Dashboard
- ✅ Check Family page
- ✅ View charts

### 5. Check Daily Reminder (Wait until 9 PM)

Check backend terminal at 9:00 PM for:
```
[ReminderService] Running daily expense reminder task at 9:00 PM
```

---

## 📦 Package Installation Summary

### Backend Packages (26 total)

**Dependencies (13):**
1. `@nestjs/common` - Core NestJS functionality
2. `@nestjs/config` - Configuration management
3. `@nestjs/core` - NestJS core
4. `@nestjs/jwt` - JWT authentication
5. `@nestjs/passport` - Authentication strategies
6. `@nestjs/platform-express` - Express platform
7. `@nestjs/schedule` - Cron jobs for daily reminders
8. `@prisma/client` - Database ORM client
9. `bcrypt` - Password hashing
10. `class-transformer` - Object transformation
11. `class-validator` - Input validation
12. `nodemailer` - Email sending
13. `passport` & `passport-jwt` - Authentication
14. `reflect-metadata` - Metadata reflection
15. `rxjs` - Reactive programming

**DevDependencies (13):**
1. `@nestjs/cli` - NestJS CLI tools
2. `@nestjs/schematics` - Code generation
3. `@types/*` - TypeScript type definitions
4. `eslint` - Code linting
5. `prettier` - Code formatting
6. `prisma` - Database schema management
7. `typescript` - TypeScript compiler
8. Others - Development tools

**Install command:**
```bash
cd backend
npm install
```

### Frontend Packages (21 total)

**Dependencies (11):**
1. `@ionic/react` - Ionic UI framework
2. `@ionic/react-router` - Ionic routing
3. `axios` - HTTP client
4. `chart.js` - Charting library
5. `react-chartjs-2` - React wrapper for Chart.js
6. `ionicons` - Icon library
7. `react` - React core
8. `react-dom` - React DOM
9. `react-router` & `react-router-dom` - Routing
10. `zustand` - State management

**DevDependencies (10):**
1. `@types/*` - TypeScript types
2. `@vitejs/plugin-react` - Vite React plugin
3. `eslint` - Code linting
4. `typescript` - TypeScript compiler
5. `vite` - Build tool
6. Others - Development tools

**Install command:**
```bash
cd frontend
npm install
```

---

## 🔧 Troubleshooting

### ❌ "npm install" fails

**Error: Python required for node-gyp**
```bash
# macOS
xcode-select --install

# Windows
npm install --global windows-build-tools

# Linux
sudo apt-get install build-essential
```

**Error: Permission denied**
```bash
# Fix npm permissions (Linux/macOS)
sudo chown -R $USER ~/.npm
```

### ❌ "Prisma migrate failed"

```bash
# Reset database (⚠️ deletes all data)
cd backend
npx prisma migrate reset

# Then run migrations again
npx prisma migrate dev
```

### ❌ "Database connection failed"

**Check:**
1. PostgreSQL is running
2. DATABASE_URL is correct
3. Database exists

**Fix:**
```bash
# Check PostgreSQL status
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql

# Start if not running
brew services start postgresql  # macOS
sudo systemctl start postgresql  # Linux
```

### ❌ "Port already in use"

**Backend (port 3000):**
```bash
# Find process
lsof -i :3000

# Kill it
kill -9 <PID>
```

**Frontend (port 8100):**
```bash
# Find process
lsof -i :8100

# Kill it
kill -9 <PID>
```

### ❌ "Module not found"

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### ❌ "Prisma Client not generated"

```bash
cd backend
npx prisma generate
```

---

## 📝 Complete Setup Checklist

### Prerequisites
- [ ] Node.js installed (v18+)
- [ ] npm installed (v9+)
- [ ] PostgreSQL installed
- [ ] Git installed (if cloning)

### Backend
- [ ] Navigate to backend folder
- [ ] Run `npm install`
- [ ] Run `npx prisma generate`
- [ ] Create `.env` file
- [ ] Configure environment variables
- [ ] Create PostgreSQL database
- [ ] Run `npx prisma migrate dev`
- [ ] Start with `npm run start:dev`

### Frontend
- [ ] Navigate to frontend folder
- [ ] Run `npm install`
- [ ] Create `.env` file (optional)
- [ ] Configure VITE_API_URL
- [ ] Start with `npm run dev`

### Verification
- [ ] Backend running on http://localhost:3000
- [ ] Frontend running on http://localhost:8100
- [ ] Can register new user
- [ ] Email OTP received
- [ ] Can login
- [ ] Can add income/expense
- [ ] Dashboard displays correctly

---

## 🚀 Quick Setup Script

Save this as `setup.sh` in project root:

```bash
#!/bin/bash

echo "🚀 Setting up Family Expense Tracker..."

# Backend setup
echo "📦 Installing backend packages..."
cd backend
npm install
npx prisma generate
echo "✅ Backend packages installed"

# Frontend setup
echo "📦 Installing frontend packages..."
cd ../frontend
npm install
echo "✅ Frontend packages installed"

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure backend/.env file"
echo "2. Create PostgreSQL database"
echo "3. Run: cd backend && npx prisma migrate dev"
echo "4. Run: npm run start:dev (in backend)"
echo "5. Run: npm run dev (in frontend)"
```

**Run it:**
```bash
chmod +x setup.sh
./setup.sh
```

---

## 📚 Additional Resources

- **Deployment Guide**: `VERCEL_DEPLOYMENT_STEP_BY_STEP.md`
- **Email Setup**: `FIX_EMAIL_ISSUE.md`
- **Project Overview**: `PROJECT_SUMMARY.md`
- **Quick Start**: `QUICK_START.md`

---

**✅ Your project is now set up on the new device!**

Run the backend and frontend, then access: http://localhost:8100 🚀

