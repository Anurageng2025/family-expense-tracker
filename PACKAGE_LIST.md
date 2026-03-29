# 📦 Complete Package List

All packages required for Frontend and Backend with their purposes.

---

## 🔧 Backend Packages

### Installation Command
```bash
cd backend
npm install
```

This installs all 26 packages below:

---

### Production Dependencies (15 packages)

#### Core Framework
```json
"@nestjs/common": "^10.3.0"           // Core NestJS functionality
"@nestjs/core": "^10.3.0"             // NestJS core modules
"@nestjs/platform-express": "^10.3.0" // Express platform adapter
```

#### Configuration & Environment
```json
"@nestjs/config": "^3.1.1"            // Environment configuration
```

#### Authentication & Security
```json
"@nestjs/jwt": "^10.2.0"              // JWT token handling
"@nestjs/passport": "^10.0.3"         // Passport integration
"passport": "^0.7.0"                  // Authentication middleware
"passport-jwt": "^4.0.1"              // JWT strategy for Passport
"bcrypt": "^5.1.1"                    // Password hashing
```

#### Database (Prisma ORM)
```json
"@prisma/client": "^5.8.0"            // Prisma database client
```

#### Validation & Transformation
```json
"class-validator": "^0.14.0"          // Input validation with decorators
"class-transformer": "^0.5.1"         // Object transformation
```

#### Email
```json
"nodemailer": "^6.9.7"                // Email sending (OTP, reminders)
```

#### Scheduling (Daily Reminders)
```json
"@nestjs/schedule": "^4.1.2"          // Cron jobs for 9 PM reminders
```

#### Utilities
```json
"reflect-metadata": "^0.1.13"         // Metadata reflection API
"rxjs": "^7.8.1"                      // Reactive programming
"rimraf": "^5.0.5"                    // Cross-platform rm -rf
```

---

### Development Dependencies (11 packages)

#### NestJS Tools
```json
"@nestjs/cli": "^10.3.0"              // NestJS CLI commands
"@nestjs/schematics": "^10.1.0"       // Code generators
```

#### TypeScript
```json
"typescript": "^5.3.3"                // TypeScript compiler
"ts-node": "^10.9.2"                  // Run TypeScript directly
"ts-loader": "^9.5.1"                 // TypeScript loader
"tsconfig-paths": "^4.2.0"            // Path mapping support
```

#### Type Definitions
```json
"@types/bcrypt": "^5.0.2"             // Types for bcrypt
"@types/express": "^4.17.21"          // Types for Express
"@types/node": "^20.10.6"             // Types for Node.js
"@types/nodemailer": "^6.4.14"        // Types for nodemailer
"@types/passport-jwt": "^4.0.0"       // Types for passport-jwt
```

#### Database Tools
```json
"prisma": "^5.8.0"                    // Prisma CLI & migrations
```

#### Code Quality
```json
"@typescript-eslint/eslint-plugin": "^6.18.0"  // ESLint TypeScript rules
"@typescript-eslint/parser": "^6.18.0"         // ESLint TypeScript parser
"eslint": "^8.56.0"                            // Code linting
"prettier": "^3.1.1"                           // Code formatting
```

---

### Backend Package Purpose Summary

| Package | Purpose |
|---------|---------|
| **NestJS** | Backend framework (Express-based) |
| **Prisma** | Database ORM (PostgreSQL) |
| **Passport/JWT** | Authentication system |
| **bcrypt** | Password encryption |
| **class-validator** | Input validation |
| **nodemailer** | Email (OTP, forgot password, reminders) |
| **@nestjs/schedule** | Daily 9 PM reminder cron job |
| **TypeScript** | Type-safe JavaScript |

---

## 🎨 Frontend Packages

### Installation Command
```bash
cd frontend
npm install
```

This installs all 21 packages below:

---

### Production Dependencies (11 packages)

#### UI Framework
```json
"@ionic/react": "^7.6.4"              // Ionic UI components
"@ionic/react-router": "^7.6.4"       // Ionic routing
"ionicons": "^7.2.2"                  // Icon library
```

#### React Core
```json
"react": "^18.2.0"                    // React library
"react-dom": "^18.2.0"                // React DOM rendering
```

#### Routing
```json
"react-router": "^6.21.2"             // React routing core
"react-router-dom": "^6.21.2"         // React routing for web
```

#### HTTP Client
```json
"axios": "^1.6.5"                     // HTTP requests to backend API
```

#### Charts & Visualization
```json
"chart.js": "^4.4.1"                  // Charting library
"react-chartjs-2": "^5.2.0"           // React wrapper for Chart.js
```

#### State Management
```json
"zustand": "^4.4.7"                   // Lightweight state management
```

---

### Development Dependencies (10 packages)

#### Build Tool
```json
"vite": "^5.0.11"                     // Fast build tool & dev server
"@vitejs/plugin-react": "^4.2.1"      // Vite React plugin
```

#### TypeScript
```json
"typescript": "^5.3.3"                // TypeScript compiler
```

#### Type Definitions
```json
"@types/node": "^20.10.6"             // Types for Node.js
"@types/react": "^18.2.48"            // Types for React
"@types/react-dom": "^18.2.18"        // Types for React DOM
```

#### Code Quality
```json
"@typescript-eslint/eslint-plugin": "^6.18.0"  // ESLint TypeScript rules
"@typescript-eslint/parser": "^6.18.0"         // ESLint TypeScript parser
"eslint": "^8.56.0"                            // Code linting
"eslint-plugin-react": "^7.33.2"               // React-specific linting
```

---

### Frontend Package Purpose Summary

| Package | Purpose |
|---------|---------|
| **Ionic React** | Mobile-first UI components |
| **React** | Frontend framework |
| **Vite** | Fast development server & build tool |
| **axios** | API calls to backend |
| **Chart.js** | Dashboard charts & graphs |
| **Zustand** | State management (auth, user data) |
| **React Router** | Page navigation |
| **ionicons** | Beautiful icons |

---

## 🚀 Installation Steps

### New Device Setup

**1. Install Backend Packages:**
```bash
cd /path/to/expansis_Track/backend
npm install
npx prisma generate
```

**2. Install Frontend Packages:**
```bash
cd /path/to/expansis_Track/frontend
npm install
```

**Total installation time:** ~5 minutes (depending on internet speed)

---

### After Deleting node_modules

**Backend:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npx prisma generate
```

**Frontend:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

### Install Specific Package (if needed)

**Backend:**
```bash
cd backend
npm install <package-name>
```

**Frontend:**
```bash
cd frontend
npm install <package-name>
```

---

## 📊 Package Sizes

### Backend
- **node_modules size:** ~350MB
- **Number of packages:** ~800+ (including dependencies)
- **Direct dependencies:** 15
- **Dev dependencies:** 11

### Frontend
- **node_modules size:** ~400MB
- **Number of packages:** ~1000+ (including dependencies)
- **Direct dependencies:** 11
- **Dev dependencies:** 10

---

## 🔍 Verify Installation

### Check Installed Packages

**Backend:**
```bash
cd backend
npm list --depth=0
```

**Frontend:**
```bash
cd frontend
npm list --depth=0
```

### Check for Missing Dependencies

```bash
npm outdated
```

### Check for Vulnerabilities

```bash
npm audit
```

### Fix Vulnerabilities (if any)

```bash
npm audit fix
```

---

## 🛠️ Update Packages

### Update All Packages

**Backend:**
```bash
cd backend
npm update
```

**Frontend:**
```bash
cd frontend
npm update
```

### Update Specific Package

```bash
npm update <package-name>
```

### Update to Latest (including major versions)

```bash
npm install <package-name>@latest
```

---

## ⚠️ Important Notes

### Don't Delete These Files
- `package.json` - Lists all dependencies
- `package-lock.json` - Locks dependency versions
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` (frontend) - Vite configuration
- `nest-cli.json` (backend) - NestJS configuration

### Safe to Delete
- `node_modules/` - Can be reinstalled with `npm install`
- `dist/` or `build/` - Build output, regenerated on build

### Never Commit to Git
- `node_modules/` (already in .gitignore)
- `.env` files (already in .gitignore)
- `dist/` or `build/` folders

---

## 📚 Package Documentation

### Backend Packages
- **NestJS**: https://docs.nestjs.com
- **Prisma**: https://www.prisma.io/docs
- **Passport**: https://www.passportjs.org
- **Nodemailer**: https://nodemailer.com

### Frontend Packages
- **Ionic**: https://ionicframework.com/docs
- **React**: https://react.dev
- **Vite**: https://vitejs.dev
- **Chart.js**: https://www.chartjs.org
- **Axios**: https://axios-http.com

---

## ✅ Installation Checklist

### Backend
- [ ] Navigate to backend folder
- [ ] Run `npm install`
- [ ] Wait for installation (~2-3 minutes)
- [ ] Run `npx prisma generate`
- [ ] Verify: `ls node_modules/` shows packages
- [ ] Success: ~800+ packages installed

### Frontend
- [ ] Navigate to frontend folder
- [ ] Run `npm install`
- [ ] Wait for installation (~2-3 minutes)
- [ ] Verify: `ls node_modules/` shows packages
- [ ] Success: ~1000+ packages installed

---

**✅ All packages installed! You're ready to run the application.**

Next steps: See `NEW_DEVICE_SETUP.md` for complete configuration guide.

