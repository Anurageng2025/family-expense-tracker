# 🚀 Family Expense Tracker - Setup Guide

Complete step-by-step guide to get your application running.

## 📋 Prerequisites Checklist

Before you begin, ensure you have:

- [ ] **Node.js** (version 16 or higher) - [Download](https://nodejs.org/)
- [ ] **PostgreSQL** installed and running - [Download](https://www.postgresql.org/download/)
- [ ] **Gmail account** (or other SMTP service) for sending OTPs
- [ ] **Git** (optional, for version control)

## 🗄️ Database Setup

### Step 1: Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE family_expense_tracker;

# Create user (optional)
CREATE USER expense_user WITH PASSWORD 'your_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE family_expense_tracker TO expense_user;

# Exit psql
\q
```

### Step 2: Get Database Connection String

Your connection string format:
```
postgresql://username:password@localhost:5432/family_expense_tracker
```

Example:
```
postgresql://postgres:mypassword@localhost:5432/family_expense_tracker
```

## 📧 Email Setup (Gmail)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification

### Step 2: Create App Password
1. Go to Google Account → Security
2. Click "App passwords"
3. Select "Mail" and "Other (Custom name)"
4. Copy the 16-character password

## 🔧 Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- NestJS framework
- Prisma ORM
- JWT authentication
- bcrypt for password hashing
- nodemailer for emails
- And all other dependencies

### Step 3: Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` file with your credentials:

```env
# Database - Update with your credentials
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/family_expense_tracker?schema=public"

# JWT Secrets - Generate strong random strings
JWT_ACCESS_SECRET="your-super-secret-access-key-change-this"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"

# Email Configuration - Use your Gmail credentials
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-16-char-app-password"
EMAIL_FROM="Family Expense Tracker <noreply@familyexpense.com>"

# Application
PORT=3000
NODE_ENV=development
```

**Important**: Replace:
- `yourpassword` with your PostgreSQL password
- `your-super-secret-*` with strong random strings
- `your-email@gmail.com` with your Gmail
- `your-16-char-app-password` with the app password from Gmail

### Step 4: Generate Prisma Client

```bash
npx prisma generate
```

### Step 5: Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This creates all database tables.

### Step 6: Start Backend Server

```bash
npm run start:dev
```

You should see:
```
✅ Database connected successfully
🚀 Application is running on: http://localhost:3000/api
```

**Test the backend**: Visit `http://localhost:3000/api` in your browser.

## 🎨 Frontend Setup

### Step 1: Open New Terminal & Navigate to Frontend

```bash
# Don't close the backend terminal!
# Open a new terminal window/tab

cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- Ionic React
- React Router
- Zustand (state management)
- Axios (HTTP client)
- Chart.js (for charts)
- And all other dependencies

### Step 3: Start Frontend Server

```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:8100/
```

### Step 4: Open Application

Open your browser and navigate to: `http://localhost:8100`

## ✅ Verification Steps

### 1. Check Backend is Running

```bash
curl http://localhost:3000/api
```

### 2. Check Database Connection

```bash
cd backend
npx prisma studio
```

This opens Prisma Studio at `http://localhost:5555` where you can view your database.

### 3. Test the Application

1. Open `http://localhost:8100`
2. Click "Register"
3. Enter your email
4. Check your email for OTP
5. Complete registration
6. Login and explore!

## 🎯 First Time Usage

### Create Your First Family

1. **Register** with your email
2. Receive **OTP** in email
3. Verify OTP
4. Choose **"Create New Family"**
5. Enter a family name (e.g., "Smith Family")
6. Complete registration
7. **Save your Family Code!** - You'll need this to login and invite members

### Invite Family Members

1. Share your **Family Code** with family members
2. They should:
   - Register with their email
   - Verify OTP
   - Choose **"Join Existing Family"**
   - Enter your Family Code
   - Complete registration

### Add Your First Transaction

1. Go to **Incomes** or **Expenses**
2. Click the **"+"** button
3. Enter amount, category, date
4. Save
5. View it on the **Dashboard**!

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Database connection failed
```
Solution:
1. Check if PostgreSQL is running
2. Verify DATABASE_URL in .env
3. Ensure database exists
```

**Problem**: OTP not received
```
Solution:
1. Check EMAIL_* variables in .env
2. Verify Gmail App Password is correct
3. Check spam folder
4. In development, OTP is logged to console
```

**Problem**: Port 3000 already in use
```
Solution:
Change PORT in .env to another port (e.g., 3001)
Update API_BASE_URL in frontend/src/services/api.ts
```

### Frontend Issues

**Problem**: Can't connect to backend
```
Solution:
1. Ensure backend is running
2. Check API_BASE_URL in src/services/api.ts
3. Check browser console for errors
```

**Problem**: Port 8100 already in use
```
Solution:
Change port in frontend/vite.config.ts:
server: {
  port: 8101,
}
```

### Common Issues

**Problem**: "Module not found" errors
```
Solution:
Delete node_modules and reinstall:
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Prisma errors
```
Solution:
Regenerate Prisma client:
cd backend
npx prisma generate
npx prisma migrate reset  # WARNING: This deletes all data
```

## 📱 Building for Production

### Backend

```bash
cd backend
npm run build
npm run start:prod
```

### Frontend

```bash
cd frontend
npm run build
# Output will be in dist/ folder
```

### Mobile Apps

**Android**:
```bash
cd frontend
npx cap add android
npm run build
npx cap sync
npx cap open android
```

**iOS**:
```bash
cd frontend
npx cap add ios
npm run build
npx cap sync
npx cap open ios
```

## 🔐 Security Notes

1. **Change all secrets** in production
2. **Never commit** .env files to git
3. **Use strong passwords** for database
4. **Enable HTTPS** in production
5. **Regular backups** of database

## 📞 Support

If you encounter issues:

1. Check the console logs (backend and browser)
2. Review the error messages
3. Consult the README files
4. Check database with Prisma Studio

## 🎉 Success!

If everything is working:
- ✅ Backend running on `localhost:3000`
- ✅ Frontend running on `localhost:8100`
- ✅ Database connected
- ✅ Can register and login
- ✅ Can add incomes/expenses
- ✅ Dashboard shows charts

**You're all set! Happy tracking! 💰📊**

---

## 📚 Next Steps

- Explore all features
- Add income and expense records
- Invite family members
- View analytics on dashboard
- Customize categories
- Build mobile apps (optional)

## 🎨 Customization

### Change App Colors
Edit `frontend/src/theme/variables.css`

### Add Categories
Edit category arrays in:
- `frontend/src/pages/Income/Incomes.tsx`
- `frontend/src/pages/Expense/Expenses.tsx`

### Change App Name
Update in:
- `frontend/index.html` (title)
- `frontend/capacitor.config.ts` (appName)
- `backend/src/auth/email.service.ts` (email template)

