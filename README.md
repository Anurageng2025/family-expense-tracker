# 💰 Family Expense Tracker

A full-stack family expense tracking application with role-based access, real-time analytics, and beautiful UI.

## 🌟 Overview

Family Expense Tracker is a production-ready application that helps families manage their finances together. Track income and expenses, visualize spending patterns, and collaborate with family members—all in one place.

## ✨ Key Features

### 👨‍👩‍👧‍👦 Family-Based System
- Unique family codes for easy joining
- Admin and Member roles
- Invite family members with a simple code
- Family-level and personal views

### 🔐 Secure Authentication
- Email OTP verification for registration
- JWT access and refresh tokens
- Family code + Email + Password login
- Role-based access control

### 💵 Finance Tracking
- Record income and expenses
- Multiple categories
- Date-based tracking
- Optional notes for each entry
- Edit and delete capabilities

### 📊 Analytics & Visualization
- Real-time dashboard
- Interactive charts (Pie & Bar)
- Family and personal summaries
- Category-wise breakdown
- Monthly trends
- Member-wise statistics

### 📱 Modern UI/UX
- Responsive design (Mobile, Tablet, Desktop)
- Pull-to-refresh functionality
- Intuitive navigation
- Side menu with quick access
- Loading states and error handling

## 🏗️ Architecture

### Backend (NestJS)
- **Clean Architecture**: Controller → Service → Repository
- **Database**: PostgreSQL with Prisma ORM
- **API**: RESTful with structured responses
- **Security**: bcrypt password hashing, JWT tokens
- **Validation**: class-validator decorators
- **Email**: Nodemailer for OTP delivery

### Frontend (Ionic React)
- **Framework**: Ionic React with TypeScript
- **State Management**: Zustand
- **HTTP Client**: Axios with interceptors
- **Charts**: Chart.js with React wrapper
- **Routing**: React Router
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js 16+
- PostgreSQL database
- Email account (Gmail recommended)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd expansis_Track
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database and email credentials

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Start backend server
npm run start:dev
```

Backend will run on `http://localhost:3000`

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

Frontend will run on `http://localhost:8100`

### 4. Access the Application

Open `http://localhost:8100` in your browser and:
1. Register a new account (you'll receive an OTP)
2. Create a new family or join existing one
3. Start tracking your finances!

## 📁 Project Structure

```
expansis_Track/
├── backend/                 # NestJS Backend
│   ├── prisma/             # Database schema & migrations
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── family/         # Family management
│   │   ├── income/         # Income tracking
│   │   ├── expense/        # Expense tracking
│   │   ├── dashboard/      # Analytics
│   │   ├── prisma/         # Prisma service
│   │   └── common/         # Shared utilities
│   └── README.md
│
├── frontend/               # Ionic React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # State management
│   │   └── theme/          # Styling
│   └── README.md
│
└── README.md               # This file
```

## 🔑 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/family_expense_tracker"
JWT_ACCESS_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_FROM="Family Expense Tracker <noreply@familyexpense.com>"
PORT=3000
NODE_ENV=development
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout

### Income
- `GET /api/incomes/my` - Get user incomes
- `GET /api/incomes/family` - Get family incomes
- `GET /api/incomes/my/stats` - Get income stats
- `POST /api/incomes` - Create income
- `PUT /api/incomes/:id` - Update income
- `DELETE /api/incomes/:id` - Delete income

### Expense
- `GET /api/expenses/my` - Get user expenses
- `GET /api/expenses/family` - Get family expenses
- `GET /api/expenses/my/stats` - Get expense stats
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Dashboard
- `GET /api/dashboard/my` - Get personal dashboard
- `GET /api/dashboard/family` - Get family dashboard
- `GET /api/dashboard/my/trends` - Get personal trends
- `GET /api/dashboard/family/trends` - Get family trends

### Family
- `GET /api/family` - Get family details
- `GET /api/family/members` - Get family members
- `DELETE /api/family/members/:id` - Remove member (Admin)
- `PATCH /api/family/name` - Update family name (Admin)

## 🎯 Design Principles

- **SOLID Principles**: Single responsibility, dependency injection
- **DRY Pattern**: No code duplication
- **Clean Code**: Readable and maintainable
- **Type Safety**: Full TypeScript support
- **Modular Structure**: Feature-based organization
- **Security First**: Encrypted passwords, JWT tokens, validation

## 🧪 Database Schema

### Tables
- **families**: Family information and unique codes
- **users**: User accounts with roles (ADMIN/MEMBER)
- **incomes**: Income records with categories
- **expenses**: Expense records with categories
- **otp_verification**: Email verification
- **refresh_tokens**: Token management

### Relationships
- One family has many users
- One user has many incomes
- One user has many expenses
- Cascade delete on family/user removal

## 📱 Mobile App Build

### Android
```bash
cd frontend
npx cap add android
npm run build
npx cap sync
npx cap open android
```

### iOS
```bash
cd frontend
npx cap add ios
npm run build
npx cap sync
npx cap open ios
```

## 🛠️ Development Commands

### Backend
```bash
npm run start:dev      # Development mode
npm run build          # Build
npm run start:prod     # Production mode
npm run prisma:studio  # Open Prisma Studio
```

### Frontend
```bash
npm run dev           # Development server
npm run build         # Production build
npm run preview       # Preview build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👨‍💻 Author

Built with ❤️ using modern web technologies.

## 🙏 Acknowledgments

- NestJS for the amazing backend framework
- Ionic for the beautiful UI components
- Prisma for the excellent ORM
- Chart.js for data visualization

---

**Happy Tracking! 💰📊**

