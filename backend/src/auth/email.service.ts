import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor(private config: ConfigService) {
    const apiKey = this.config.get('RESEND_API_KEY');

    if (apiKey) {
      this.resend = new Resend(apiKey);
      console.log('📧 Email service initialized via Resend API');
    } else {
      console.warn('⚠️ RESEND_API_KEY missing. Emails will not be sent.');
    }
  }

  private getFromAddress(): string {
    // If you haven't verified a domain on Resend, you MUST use this address
    return this.config.get('EMAIL_FROM') || 'onboarding@resend.dev';
  }

  async sendOTP(email: string, otp: string): Promise<void> {
    console.log(`\n📧 [SYSTEM LOG] OTP for ${email}: ${otp}\n`);

    if (!this.resend) {
      console.log('ℹ️ Skipping real email send: Resend service not configured.');
      return;
    }

    try {
      await this.resend.emails.send({
        from: this.getFromAddress(),
        to: email,
        subject: 'Your OTP for Family Expense Tracker Registration',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4CAF50;">Family Expense Tracker</h2>
            <p>Your OTP for registration is:</p>
            <h1 style="background-color: #f4f4f4; padding: 20px; text-align: center; letter-spacing: 5px;">
              ${otp}
            </h1>
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you didn't request this OTP, please ignore this email.</p>
          </div>
        `,
      });
      console.log(`✅ OTP email sent to ${email}`);
    } catch (error) {
      console.error('❌ Error sending email:', error);
      // In development, log the OTP to console
      if (this.config.get('NODE_ENV') === 'development') {
        console.log(`📧 Development Mode - OTP for ${email}: ${otp}`);
      }
    }
  }

  async sendFamilyCode(
    email: string,
    userName: string,
    familyCode: string,
    familyName: string,
  ): Promise<void> {
    if (!this.resend) return;

    try {
      await this.resend.emails.send({
        from: this.getFromAddress(),
        to: email,
        subject: 'Your Family Code - Family Expense Tracker',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4CAF50;">Family Expense Tracker</h2>
            <p>Hi ${userName},</p>
            <p>You requested your family code. Here are your family details:</p>
            
            <div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0; border-radius: 5px;">
              <p style="margin: 10px 0;"><strong>Family Name:</strong> ${familyName}</p>
              <p style="margin: 10px 0;"><strong>Family Code:</strong></p>
              <h1 style="background-color: #ffffff; padding: 15px; text-align: center; letter-spacing: 5px; margin: 10px 0;">
                ${familyCode}
              </h1>
            </div>

            <p>Use this family code along with your email and password to login to your account.</p>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              If you didn't request this, please ignore this email or contact support if you have concerns.
            </p>
          </div>
        `,
      });
      console.log(`✅ Family code email sent to ${email}`);
    } catch (error) {
      console.error('❌ Error sending family code email:', error);
      // In development, log the family code to console
      if (this.config.get('NODE_ENV') === 'development') {
        console.log(`📧 Development Mode - Family Code for ${email}: ${familyCode} (Family: ${familyName})`);
      }
    }
  }

  async sendExpenseReminder(
    email: string,
    userName: string,
    familyName: string,
  ): Promise<void> {
    if (!this.resend) return;

    try {
      const currentDate = new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      await this.resend.emails.send({
        from: this.getFromAddress(),
        to: email,
        subject: '⏰ Daily Reminder: Update Your Expenses - Family Expense Tracker',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 2px solid #4CAF50; border-radius: 10px;">
            <div style="text-align: center; padding: 20px; background-color: #4CAF50; color: white; border-radius: 8px 8px 0 0; margin: -20px -20px 20px -20px;">
              <h1 style="margin: 0; font-size: 28px;">⏰ Daily Expense Reminder</h1>
            </div>

            <p style="font-size: 18px;">Hi <strong>${userName}</strong>,</p>
            
            <p style="font-size: 16px; line-height: 1.6;">
              It's 9:00 PM! Time to update your expenses for today.
            </p>

            <div style="background-color: #fff3cd; padding: 15px; margin: 20px 0; border-left: 4px solid #ffc107; border-radius: 5px;">
              <p style="margin: 5px 0; font-size: 14px;">
                <strong>📅 Date:</strong> ${currentDate}
              </p>
              <p style="margin: 5px 0; font-size: 14px;">
                <strong>👨‍👩‍👧‍👦 Family:</strong> ${familyName}
              </p>
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
              <h3 style="color: #333; margin-top: 0;">📝 Don't forget to log:</h3>
              <ul style="line-height: 1.8; color: #555;">
                <li>🛒 Groceries and shopping</li>
                <li>🍔 Food and dining</li>
                <li>🚗 Transportation costs</li>
                <li>💡 Bills and utilities</li>
                <li>🎉 Entertainment</li>
                <li>💊 Healthcare</li>
                <li>📦 Any other expenses</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://nextjs-frontend-five-weld.vercel.app/expenses" style="display: inline-block; padding: 15px 40px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
                Add Today's Expenses
              </a>
            </div>

            <div style="background-color: #e3f2fd; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p style="margin: 0; font-size: 13px; color: #555;">
                💡 <strong>Tip:</strong> Tracking daily expenses helps you stay within budget and achieve your financial goals!
              </p>
            </div>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

            <p style="font-size: 12px; color: #999; text-align: center;">
              You're receiving this daily reminder because you're a member of <strong>${familyName}</strong>.
              <br>
              Family Expense Tracker - Managing finances together! 💰
            </p>
          </div>
        `,
      });
      console.log(`✅ Expense reminder email sent to ${email}`);
    } catch (error) {
      console.error('❌ Error sending expense reminder email:', error);
      // In development, log the reminder
      if (this.config.get('NODE_ENV') === 'development') {
        console.log(`📧 Development Mode - Expense Reminder for ${email} (${userName} - ${familyName})`);
      }
    }
  }

  async sendMonthlySummary(
    email: string,
    userName: string,
    familyName: string,
    summaryMonth: string,
    totalIncome: number,
    totalExpense: number,
    balance: number,
  ): Promise<void> {
    if (!this.resend) return;

    try {
      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0,
        }).format(amount);
      };

      const balanceColor = balance >= 0 ? '#10b981' : '#ef4444';

      await this.resend.emails.send({
        from: this.getFromAddress(),
        to: email,
        subject: `📊 Monthly Financial Summary: ${summaryMonth} - Family Expense Tracker`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 2px solid #3b82f6; border-radius: 10px;">
            <div style="text-align: center; padding: 20px; background-color: #3b82f6; color: white; border-radius: 8px 8px 0 0; margin: -20px -20px 20px -20px;">
              <h1 style="margin: 0; font-size: 28px;">📊 Monthly Summary</h1>
              <p style="margin: 5px 0 0 0; font-size: 16px; opacity: 0.9;">${summaryMonth}</p>
            </div>

            <p style="font-size: 18px;">Hi <strong>${userName}</strong>,</p>
            
            <p style="font-size: 16px; line-height: 1.6;">
              Here is your family's official monthly financial summary for <strong>${summaryMonth}</strong>.
            </p>

            <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 10px;">
                <span style="font-size: 16px; color: #64748b;">Total Income</span>
                <span style="font-size: 18px; font-weight: bold; color: #10b981;">${formatCurrency(totalIncome)}</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 10px;">
                <span style="font-size: 16px; color: #64748b;">Total Expenses</span>
                <span style="font-size: 18px; font-weight: bold; color: #ef4444;">${formatCurrency(totalExpense)}</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; padding-top: 5px;">
                <span style="font-size: 18px; font-weight: bold; color: #0f172a;">Net Balance</span>
                <span style="font-size: 22px; font-weight: bold; color: ${balanceColor};">${formatCurrency(balance)}</span>
              </div>

            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://nextjs-frontend-five-weld.vercel.app/dashboard" style="display: inline-block; padding: 15px 40px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
                View Dashboard
              </a>
            </div>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

            <p style="font-size: 12px; color: #999; text-align: center;">
              You're receiving this official report because you are the admin of <strong>${familyName}</strong>.
              <br>
              Family Expense Tracker
            </p>
          </div>
        `,
      });
      console.log(`✅ Monthly summary email sent to ${email}`);
    } catch (error) {
      console.error('❌ Error sending monthly summary email:', error);
      if (this.config.get('NODE_ENV') === 'development') {
        console.log(`📧 Development Mode - Monthly Summary Reminder for ${email} (${userName} - ${familyName})`);
      }
    }
  }

  async sendOnDemandReport(
    email: string,
    userName: string,
    reportName: string,
    csvContent: string,
  ): Promise<void> {
    if (!this.resend) return;

    try {
      await this.resend.emails.send({
        from: this.getFromAddress(),
        to: email,
        subject: `📩 Your Financial Report: ${reportName}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 2px solid #10b981; border-radius: 10px;">
            <div style="text-align: center; padding: 20px; background-color: #10b981; color: white; border-radius: 8px 8px 0 0; margin: -20px -20px 20px -20px;">
              <h1 style="margin: 0; font-size: 24px;">📊 Family Expense Tracker</h1>
              <p style="margin: 5px 0 0 0; font-size: 16px; opacity: 0.9;">On-Demand Transaction Report</p>
            </div>

            <p style="font-size: 18px;">Hi <strong>${userName}</strong>,</p>
            
            <p style="font-size: 16px; line-height: 1.6;">
              An admin has requested to send you the <strong>${reportName}</strong>. 
            </p>
            <p style="font-size: 16px; line-height: 1.6;">
              Please find your detailed transaction history securely attached to this email as a CSV file. You can open this natively in Microsoft Excel, Google Sheets, or Apple Numbers.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://nextjs-frontend-five-weld.vercel.app/dashboard" style="display: inline-block; padding: 15px 40px; background-color: #10b981; color: white; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
                View Dashboard
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            <p style="font-size: 12px; color: #999; text-align: center;">
              Family Expense Tracker<br>
              This is an automatically generated email.
            </p>
          </div>
        `,
        attachments: [
          {
            filename: `transactions_report_${new Date().toISOString().split('T')[0]}.csv`,
            content: csvContent,
          }
        ]
      });
      console.log(`✅ On-Demand Report email sent to ${email}`);
    } catch (error) {
      console.error('❌ Error sending on-demand report email:', error);
      if (this.config.get('NODE_ENV') === 'development') {
        console.log(`📧 Development Mode - On-Demand Report for ${email} (${userName})`);
      }
    }
  }

  async sendLocationReport(
    email: string,
    userName: string,
    members: any[],
  ): Promise<void> {
    if (!this.resend) return;

    try {
      const formatDate = (date: Date) => {
        if (!date) return 'Never';
        return new Date(date).toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      };

      const memberRows = members.map(m => `
        <tr style="border-bottom: 1px solid #edf2f7;">
          <td style="padding: 12px 8px; font-weight: 600;">${m.name}</td>
          <td style="padding: 12px 8px; color: #4a5568;">
            ${m.lat && m.lng ? `${m.lat.toFixed(6)}, ${m.lng.toFixed(6)}` : 'Not available'}
            ${m.type ? `<br><span style="font-size: 10px; padding: 2px 6px; background: ${m.type === 'IP' ? '#feebc8' : '#c6f6d5'}; color: ${m.type === 'IP' ? '#7b341e' : '#22543d'}; border-radius: 4px; font-weight: bold;">${m.type === 'IP' ? 'Estimate (IP)' : 'Precise (GPS)'}</span>` : ''}
          </td>
          <td style="padding: 12px 8px; font-size: 13px; color: #718096;">
            ${formatDate(m.lastSeen)}
          </td>
          <td style="padding: 12px 8px; text-align: center;">
            ${m.lat && m.lng 
              ? `<a href="https://www.google.com/maps/search/?api=1&query=${m.lat},${m.lng}" style="color: #4f46e5; text-decoration: none; font-weight: bold;">View Map</a>` 
              : '-'
            }
          </td>
        </tr>
      `).join('');

      await this.resend.emails.send({
        from: this.getFromAddress(),
        to: email,
        subject: `📍 Family Location Report - Expansis Track`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 700px; margin: 0 auto; border: 2px solid #4f46e5; border-radius: 12px;">
            <div style="text-align: center; padding: 20px; background-color: #4f46e5; color: white; border-radius: 10px 10px 0 0; margin: -20px -20px 20px -20px;">
              <h1 style="margin: 0; font-size: 24px;">📍 Family Location Report</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">On-demand coordinates for all family members</p>
            </div>

            <p style="font-size: 16px; margin: 20px 0;">Hi <strong>${userName}</strong>,</p>
            
            <p style="font-size: 15px; color: #4a5568; line-height: 1.5;">
              Here is the latest reported location data for your family members. If a member's location isn't showing, they may have location services disabled or haven't opened the app recently.
            </p>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background-color: #f7fafc; text-align: left; font-size: 14px; text-transform: uppercase; color: #4a5568;">
                  <th style="padding: 12px 8px; border-bottom: 2px solid #e2e8f0;">Member</th>
                  <th style="padding: 12px 8px; border-bottom: 2px solid #e2e8f0;">Coordinates</th>
                  <th style="padding: 12px 8px; border-bottom: 2px solid #e2e8f0;">Last Seen</th>
                  <th style="padding: 12px 8px; border-bottom: 2px solid #e2e8f0; text-align: center;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${memberRows}
              </tbody>
            </table>

            <div style="background-color: #ebf4ff; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0; font-size: 13px; color: #2c5282;">
                <strong>Note:</strong> Locations are recorded only when a member has the Expansis Track app open. If "Last Seen" was a long time ago, the coordinates may no longer be accurate.
              </p>
            </div>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 40px 0 20px 0;">
            <p style="font-size: 12px; color: #a0aec0; text-align: center;">
              Family Expense Tracker<br>
              Managing finances and family safety together. 💰
            </p>
          </div>
        `,
      });
      console.log(`✅ Location report email sent to ${email}`);
    } catch (error) {
      console.error('❌ Error sending location report email:', error);
      if (this.config.get('NODE_ENV') === 'development') {
        console.log(`📧 Dev Mode: Location report for ${email} failed: ${error.message}`);
      }
    }
  }
}
