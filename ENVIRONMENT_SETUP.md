# 🔐 Environment Variables Setup

## Backend Environment Variables

Create `backend/.env` file with:

```bash
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

## Frontend Environment Variables

Create `frontend/.env.production` file with:

```bash
# Production API URL
# Replace with your actual backend URL from Railway/Render/Heroku
VITE_API_URL="https://your-backend-url.railway.app/api"
```

For local development, create `frontend/.env`:

```bash
VITE_API_URL="http://localhost:3000/api"
```

## For Production Deployment

Use these exact variables in your hosting platform (Railway, Render, etc.):

### Backend Variables:
```
DATABASE_URL=(auto-set by platform)
JWT_SECRET=your-long-random-string-min-32-characters
JWT_REFRESH_SECRET=another-long-random-string-min-32-characters
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM=your.email@gmail.com
NODE_ENV=production
```

### Frontend Variables:
```
VITE_API_URL=https://your-backend-url.com/api
```

