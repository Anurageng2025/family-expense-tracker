# 📧 Email Setup Guide - OTP Configuration

## 🎯 Quick Summary

Your OTPs are currently being logged to the backend console in development mode.
To actually send emails, follow these steps:

---

## ✅ OPTION 1: Use Console OTPs (Current Setup)

**No configuration needed!** Just check the backend terminal for OTPs.

When you request an OTP, look at Terminal 3 (backend) for a line like:
```
📧 Development Mode - OTP for your-email@gmail.com: 123456
```

Use that OTP code to continue registration.

---

## 📨 OPTION 2: Enable Real Email Sending

### Step 1: Enable Gmail 2-Factor Authentication

1. Visit: https://myaccount.google.com/security
2. Under "How you sign in to Google"
3. Click "2-Step Verification"
4. Follow the steps to enable it (if not already enabled)

### Step 2: Create App Password

1. Visit: https://myaccount.google.com/apppasswords
   
   **OR**
   
   - Go to https://myaccount.google.com/
   - Click "Security" in left menu
   - Scroll down to "App passwords"

2. You might need to sign in again

3. In the App passwords page:
   - **Select app**: Choose "Mail"
   - **Select device**: Choose "Other (Custom name)"
   - **Type**: "Family Expense Tracker"
   - Click **Generate**

4. Google will show you a 16-character password like:
   ```
   abcd efgh ijkl mnop
   ```
   **Copy this password!** (Remove the spaces)

### Step 3: Update .env File

1. Open: `/Users/anurag/Desktop/expansis_Track/backend/.env`

2. Find this line:
   ```env
   EMAIL_PASSWORD="REPLACE_WITH_YOUR_16_CHAR_APP_PASSWORD"
   ```

3. Replace with your app password (no spaces):
   ```env
   EMAIL_PASSWORD="abcdefghijklmnop"
   ```

4. Save the file

### Step 4: Restart Backend

1. Go to Terminal 3 (where backend is running)
2. Press `Ctrl + C` to stop the server
3. Run:
   ```bash
   cd /Users/anurag/Desktop/expansis_Track/backend && npm run start:dev
   ```

### Step 5: Test It!

1. Go to http://localhost:8100/register
2. Enter your email
3. Click "Send OTP"
4. Check your email inbox! 📬

---

## 🐛 Troubleshooting

### "Username and Password not accepted"
- ❌ You're using your regular Gmail password
- ✅ Use the 16-character App Password instead
- ✅ Make sure 2-Factor Authentication is enabled first

### "App Passwords option not showing"
- Enable 2-Factor Authentication first
- Wait a few minutes and try again
- Make sure you're using your personal Gmail (not G Suite/Workspace)

### Still not working?
- Check if EMAIL_USER matches your Gmail address
- Make sure there are no spaces in the app password
- Restart the backend server after changing .env

### Emails going to spam?
- Check your spam/junk folder
- Mark the email as "Not Spam"
- Add noreply@familyexpense.com to your contacts

---

## 📋 Current Configuration

Your `.env` file is currently set to:
- **Email**: anurag36512@gmail.com
- **Password**: Needs your App Password
- **SMTP**: smtp.gmail.com:587
- **Mode**: Development (logs to console)

---

## 🎓 How It Works

1. **Development Mode**: OTPs are logged to console (current behavior)
2. **With Email Configured**: OTPs are sent via email AND logged to console
3. **Production Mode**: OTPs are only sent via email (not logged)

---

## 💡 Pro Tips

- **Keep your App Password safe** - treat it like a password
- **One App Password per app** - create a new one for each application
- **Revoke if compromised** - you can delete App Passwords anytime
- **Works with any Gmail** - personal or business accounts

---

## 🚀 Quick Start (For Now)

Don't want to configure email right now? Just:

1. Request an OTP in the app
2. Look at backend Terminal 3
3. Find the line with 📧 and your email
4. Copy the 6-digit code
5. Enter it in the app

**It works perfectly for development!** 🎉

---

## ✅ Verification

After configuration, you should see in Terminal 3:
```
✅ OTP email sent to your-email@gmail.com
```

Instead of:
```
❌ Error sending email: Invalid login
📧 Development Mode - OTP for your-email@gmail.com: 123456
```

---

**Need help?** Check the terminal logs for detailed error messages!

