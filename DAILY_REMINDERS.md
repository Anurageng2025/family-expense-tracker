# ⏰ Daily Expense Reminder Feature

## 🎉 Feature Overview

Automatic daily email reminders sent to ALL family members at 9:00 PM every day to encourage them to log their expenses.

---

## ✨ What It Does

### Automated Email Reminders
- 📧 Sends email to **every family member**
- ⏰ **Sent at 9:00 PM** every day (automated)
- 🔄 **Runs automatically** - no manual action needed
- 👨‍👩‍👧‍👦 Includes **all families** in the system

### Email Content
Beautiful, professional HTML emails that include:
- ⏰ Reminder header with time
- 📅 Current date
- 👨‍👩‍👧‍👦 Family name
- 📝 Checklist of common expenses
- 🔘 Direct link to add expenses
- 💡 Helpful tips

---

## 📧 Email Template Preview

```
═══════════════════════════════════════════
        ⏰ DAILY EXPENSE REMINDER
═══════════════════════════════════════════

Hi John Doe,

It's 9:00 PM! Time to update your expenses for today.

📅 Date: Friday, November 29, 2025
👨‍👩‍👧‍👦 Family: Smith Family

📝 Don't forget to log:
  🛒 Groceries and shopping
  🍔 Food and dining
  🚗 Transportation costs
  💡 Bills and utilities
  🎉 Entertainment
  💊 Healthcare
  📦 Any other expenses

[Add Today's Expenses] ← Button linking to app

💡 Tip: Tracking daily expenses helps you stay 
within budget and achieve your financial goals!

═══════════════════════════════════════════
```

---

## ⚙️ Technical Implementation

### Scheduler Service
- **Technology**: NestJS Schedule (@nestjs/schedule)
- **Cron Expression**: `'0 0 21 * * *'`
  - 0 seconds
  - 0 minutes
  - 21 hours (9:00 PM)
  - Every day
  - Every month
  - Every day of week

### Architecture
```
SchedulerModule
  └─ ReminderService
       └─ @Cron('0 0 21 * * *')
            └─ handleDailyExpenseReminder()
                 ├─ Get all families
                 ├─ Get all family members
                 └─ Send email to each member
```

### Files Created
1. `backend/src/scheduler/scheduler.module.ts`
2. `backend/src/scheduler/reminder.service.ts`
3. Updated: `backend/src/auth/email.service.ts` (added sendExpenseReminder method)
4. Updated: `backend/src/app.module.ts` (imported SchedulerModule)

---

## 🕐 Schedule Details

### Default Schedule
- **Time**: 9:00 PM (21:00)
- **Frequency**: Daily
- **Timezone**: America/New_York (EST/EDT)

### Change Timezone
To change the timezone, edit `backend/src/scheduler/reminder.service.ts`:

```typescript
@Cron('0 0 21 * * *', {
  name: 'daily-expense-reminder',
  timeZone: 'Your/Timezone', // Change this!
})
```

### Common Timezones
- `America/New_York` - Eastern Time
- `America/Los_Angeles` - Pacific Time
- `America/Chicago` - Central Time
- `America/Denver` - Mountain Time
- `Europe/London` - UK Time
- `Asia/Kolkata` - India Time
- `Asia/Tokyo` - Japan Time

### Change Time
To change from 9:00 PM to another time, modify the cron expression:

```typescript
// 8:00 PM
@Cron('0 0 20 * * *')

// 10:00 PM
@Cron('0 0 22 * * *')

// 6:30 PM
@Cron('0 30 18 * * *')
```

---

## 🔍 How It Works

### Step-by-Step Flow

1. **Scheduler Triggers** at 9:00 PM
   ```
   → Cron job runs automatically
   ```

2. **Fetch All Families**
   ```
   → Query database for all families
   → Include family members
   ```

3. **Loop Through Each Family**
   ```
   → For each family:
     → Get all family members
   ```

4. **Send Email to Each Member**
   ```
   → For each member:
     → Generate personalized email
     → Send via nodemailer
     → Log success/failure
   ```

5. **Log Completion**
   ```
   → Log total emails sent
   → Log any errors
   ```

### Error Handling
- ✅ Individual email failures don't stop other emails
- ✅ Errors are logged to console
- ✅ Process continues even if some emails fail
- ✅ Each family/member is processed independently

---

## 📊 Logging & Monitoring

### Console Logs

When the scheduler runs, you'll see in Terminal (backend):

```bash
[ReminderService] Running daily expense reminder task at 9:00 PM
[ReminderService] Found 5 families
[ReminderService] Reminder sent to john@example.com
[ReminderService] Reminder sent to jane@example.com
[ReminderService] Reminder sent to bob@example.com
✅ Expense reminder email sent to john@example.com
✅ Expense reminder email sent to jane@example.com
✅ Expense reminder email sent to bob@example.com
[ReminderService] Daily expense reminder task completed
```

### Error Logs

If email fails:
```bash
❌ Error sending expense reminder email: Connection timeout
[ReminderService] Failed to send reminder to user@example.com: Connection timeout
📧 Development Mode - Expense Reminder for user@example.com (John - Smith Family)
```

---

## 🧪 Testing the Reminder

### Option 1: Wait Until 9:00 PM
Just wait! The reminder will automatically send at 9:00 PM.

### Option 2: Test Immediately (Recommended)

**Create a test endpoint** (optional):

1. Create `backend/src/scheduler/reminder.controller.ts`:
```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { ReminderService } from './reminder.service';

@Controller('scheduler')
export class ReminderController {
  constructor(private reminderService: ReminderService) {}

  @Post('test-reminder')
  async testReminder(@Body() body: { email: string }) {
    return await this.reminderService.sendTestReminder(body.email);
  }
}
```

2. Update `scheduler.module.ts`:
```typescript
@Module({
  imports: [ScheduleModule.forRoot(), AuthModule],
  controllers: [ReminderController], // Add this
  providers: [ReminderService],
})
```

3. Test with curl:
```bash
curl -X POST http://localhost:3000/api/scheduler/test-reminder \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com"}'
```

---

## 🎯 Email Delivery Status

### Development Mode
- ✅ Emails attempted
- ✅ Logged to console
- ❌ May not be delivered (if Gmail not configured)
- ✅ Console shows reminder was sent

### Production Mode
- ✅ Emails delivered to inbox
- ✅ Gmail App Password required
- ✅ Professional HTML formatting
- ✅ Direct link to app

---

## 📧 Configure Email for Reminders

The reminder uses the same email configuration as OTP emails.

### Required Setup:
1. ✅ Gmail 2-Factor Authentication enabled
2. ✅ Gmail App Password created
3. ✅ `.env` file configured
4. ✅ Backend restarted

### .env Configuration:
```env
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-16-char-app-password"
```

**See `FIX_EMAIL_ISSUE.md` for detailed email setup!**

---

## 🎨 Email Design Features

### Professional HTML Design
- ✅ Responsive layout
- ✅ Color-coded sections
- ✅ Green theme matching app
- ✅ Mobile-friendly
- ✅ Clear call-to-action button

### Sections Included
1. **Header**: Eye-catching green banner
2. **Greeting**: Personalized with user name
3. **Reminder**: Clear message about 9 PM
4. **Date & Family**: Current date and family name
5. **Checklist**: Common expense categories
6. **Action Button**: Direct link to add expenses
7. **Tip**: Motivational financial advice
8. **Footer**: Family info and branding

---

## 🔧 Customization Options

### Change Email Content

Edit `backend/src/auth/email.service.ts` in the `sendExpenseReminder` method:

```typescript
async sendExpenseReminder(
  email: string,
  userName: string,
  familyName: string,
): Promise<void> {
  // Customize the HTML here!
  const html = `...your custom HTML...`;
  
  await this.transporter.sendMail({
    from: this.config.get('EMAIL_FROM'),
    to: email,
    subject: 'Your Custom Subject',
    html: html,
  });
}
```

### Change Reminder Frequency

```typescript
// Every 2 days at 9 PM
@Cron('0 0 21 */2 * *')

// Only weekdays at 9 PM
@Cron('0 0 21 * * 1-5')

// Twice a day (9 AM and 9 PM)
@Cron('0 0 9,21 * * *')
```

### Disable Reminders Temporarily

Comment out the `@Cron` decorator:

```typescript
// @Cron('0 0 21 * * *')
async handleDailyExpenseReminder() {
  // This won't run automatically now
}
```

---

## 📊 Statistics & Monitoring

### What's Tracked
- ✅ Number of families processed
- ✅ Emails sent successfully
- ✅ Emails that failed
- ✅ Total execution time
- ✅ Individual errors

### Where to Check
- **Backend Console**: Real-time logs
- **Production**: Use logging service (e.g., Winston, Sentry)

---

## 🎯 Best Practices

### For Development
1. ✅ Test email content thoroughly
2. ✅ Check all timezones
3. ✅ Monitor console logs
4. ✅ Test with multiple families

### For Production
1. ✅ Set up proper logging
2. ✅ Monitor email delivery rates
3. ✅ Have fallback for failures
4. ✅ Set up alerts for errors
5. ✅ Consider rate limiting

---

## 🚨 Troubleshooting

### Reminders Not Sending

**Check 1: Is scheduler loaded?**
```bash
# Look for this in backend logs:
[InstanceLoader] ScheduleModule dependencies initialized
```

**Check 2: Is time correct?**
- Verify timezone in code
- Check server time: `date`

**Check 3: Email configured?**
- Check `.env` EMAIL_* variables
- Test with manual send

### Emails Going to Spam

**Solutions:**
- ✅ Configure SPF/DKIM records
- ✅ Use professional email service
- ✅ Add "Reply-To" header
- ✅ Ask users to whitelist email

### Performance Issues

If you have many families (100+):
- ✅ Add delay between emails
- ✅ Use email queue (Bull/Redis)
- ✅ Batch process families
- ✅ Use background workers

---

## 📈 Future Enhancements

### Possible Improvements
- [ ] User preference: Enable/disable reminders
- [ ] Custom reminder time per user
- [ ] Weekly summary emails
- [ ] Monthly report emails
- [ ] SMS reminders
- [ ] In-app notifications
- [ ] Reminder for specific expense categories

---

## ✅ Current Status

### Implemented Features
- [x] Daily automated emails at 9 PM
- [x] Sent to all family members
- [x] Beautiful HTML email template
- [x] Personalized content
- [x] Error handling
- [x] Logging & monitoring
- [x] Timezone support
- [x] Direct link to app

### Ready to Use
- ✅ **Backend**: Running with scheduler ✓
- ✅ **Scheduler Module**: Loaded ✓
- ✅ **Cron Job**: Active ✓
- ✅ **Email Service**: Ready ✓

---

## 🎉 Summary

The **Daily Expense Reminder** feature:

- ⏰ **Automatically reminds** family members at 9 PM
- 📧 **Sends beautiful emails** with checklist and tips
- 🔄 **Runs every day** without manual intervention
- 👨‍👩‍👧‍👦 **Includes all families** in the system
- 📝 **Encourages** daily expense tracking
- 💰 **Helps families** stay on budget

**The reminder will send automatically at 9:00 PM today!** 🚀

---

## 📖 Additional Resources

- **Email Setup**: See `FIX_EMAIL_ISSUE.md`
- **Admin Features**: See `ADMIN_FEATURES.md`
- **Main Documentation**: See `README.md`

---

**Keep your family finances on track with daily reminders!** 💰⏰

