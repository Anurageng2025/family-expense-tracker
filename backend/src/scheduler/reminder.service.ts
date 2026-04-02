import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../auth/email.service';

@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  /**
   * Send daily expense reminder at 9:00 PM every day
   * Cron format: second minute hour day month weekday
   * '0 0 21 * * *' = At 9:00 PM every day
   */
  @Cron('0 0 21 * * *', {
    name: 'daily-expense-reminder',
    timeZone: 'America/New_York', // Change this to your timezone
  })
  async handleDailyExpenseReminder() {
    this.logger.log('Running daily expense reminder task at 9:00 PM');

    try {
      // Get all families
      const families = await this.prisma.family.findMany({
        include: {
          users: true,
        },
      });

      this.logger.log(`Found ${families.length} families`);

      // Send reminder to each family member
      for (const family of families) {
        for (const user of family.users) {
          try {
            await this.emailService.sendExpenseReminder(
              user.email,
              user.name,
              family.familyName,
            );
            this.logger.log(`Reminder sent to ${user.email}`);
          } catch (error) {
            this.logger.error(
              `Failed to send reminder to ${user.email}: ${error.message}`,
            );
          }
        }
      }

      this.logger.log('Daily expense reminder task completed');
    } catch (error) {
      this.logger.error(`Error in daily reminder task: ${error.message}`);
    }
  }

  /**
   * Send monthly summary to family Admin on the 1st of every month at 9:00 AM
   */
  @Cron('0 9 1 * *', {
    name: 'monthly-summary',
    timeZone: 'America/New_York',
  })
  async handleMonthlySummary() {
    this.logger.log('Running monthly summary task');
    
    try {
      const now = new Date();
      // Get first day and last day of previous month
      const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      
      const summaryMonthStr = startOfPrevMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

      // Find all families
      const families = await this.prisma.family.findMany({
        include: {
          users: {
            include: {
              incomes: {
                where: {
                  date: {
                    gte: startOfPrevMonth,
                    lte: endOfPrevMonth,
                  }
                }
              },
              expenses: {
                where: {
                  date: {
                    gte: startOfPrevMonth,
                    lte: endOfPrevMonth,
                  }
                }
              }
            }
          }
        },
      });

      for (const family of families) {
        if (!family.users || family.users.length === 0) continue;
        const adminUser = family.users.find(u => u.role === 'ADMIN') || family.users[0];

        let totalIncome = 0;
        let totalExpense = 0;

        for (const user of family.users) {
          totalIncome += user.incomes.reduce((sum, inc) => sum + inc.amount, 0);
          totalExpense += user.expenses.reduce((sum, exp) => sum + exp.amount, 0);
        }

        const balance = totalIncome - totalExpense;

        try {
          await this.emailService.sendMonthlySummary(
            adminUser.email,
            adminUser.name,
            family.familyName,
            summaryMonthStr,
            totalIncome,
            totalExpense,
            balance
          );
          this.logger.log(`Monthly summary sent to admin ${adminUser.email}`);
        } catch (error) {
          this.logger.error(`Failed to send monthly summary to ${adminUser.email}: ${error.message}`);
        }
      }

      this.logger.log('Monthly summary task completed');
    } catch (error) {
      this.logger.error(`Error in monthly summary task: ${error.message}`);
    }
  }

  /**
   * Send reminder to a specific family member (Admin feature)
   */
  async sendReminderToMember(familyId: string, memberId: string) {
    try {
      const member = await this.prisma.user.findFirst({
        where: {
          id: memberId,
          familyId: familyId,
        },
        include: { family: true },
      });

      if (!member) {
        throw new Error('Member not found in your family');
      }

      await this.emailService.sendExpenseReminder(
        member.email,
        member.name,
        member.family.familyName,
      );

      this.logger.log(`Manual reminder sent to ${member.email} by admin`);

      return {
        message: `Reminder sent successfully to ${member.name}`,
        sentTo: member.email,
      };
    } catch (error) {
      this.logger.error(`Failed to send manual reminder: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send reminder to all family members (Admin feature)
   */
  async sendReminderToAllMembers(familyId: string) {
    try {
      const family = await this.prisma.family.findUnique({
        where: { id: familyId },
        include: { users: true },
      });

      if (!family) {
        throw new Error('Family not found');
      }

      let successCount = 0;
      let failCount = 0;
      const results = [];

      for (const member of family.users) {
        try {
          await this.emailService.sendExpenseReminder(
            member.email,
            member.name,
            family.familyName,
          );
          successCount++;
          results.push({ email: member.email, status: 'sent' });
          this.logger.log(`Manual reminder sent to ${member.email}`);
        } catch (error) {
          failCount++;
          results.push({ email: member.email, status: 'failed' });
          this.logger.error(`Failed to send to ${member.email}: ${error.message}`);
        }
      }

      return {
        message: `Reminders sent to ${successCount} member(s), ${failCount} failed`,
        successCount,
        failCount,
        totalMembers: family.users.length,
        results,
      };
    } catch (error) {
      this.logger.error(`Failed to send bulk reminders: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send reminder to multiple selected members (Admin feature)
   */
  async sendBulkReminders(familyId: string, memberIds: string[]) {
    try {
      const members = await this.prisma.user.findMany({
        where: {
          id: { in: memberIds },
          familyId: familyId,
        },
        include: { family: true },
      });

      if (members.length === 0) {
        throw new Error('No valid members found');
      }

      let successCount = 0;
      let failCount = 0;
      const results = [];

      for (const member of members) {
        try {
          await this.emailService.sendExpenseReminder(
            member.email,
            member.name,
            member.family.familyName,
          );
          successCount++;
          results.push({ email: member.email, name: member.name, status: 'sent' });
          this.logger.log(`Manual reminder sent to ${member.email}`);
        } catch (error) {
          failCount++;
          results.push({ email: member.email, name: member.name, status: 'failed' });
          this.logger.error(`Failed to send to ${member.email}: ${error.message}`);
        }
      }

      return {
        message: `Reminders sent to ${successCount} member(s), ${failCount} failed`,
        successCount,
        failCount,
        totalRequested: memberIds.length,
        results,
      };
    } catch (error) {
      this.logger.error(`Failed to send bulk reminders: ${error.message}`);
      throw error;
    }
  }

  /**
   * Manual trigger for testing (optional)
   * You can call this method to test the reminder without waiting for 9 PM
   */
  async sendTestReminder(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { family: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    await this.emailService.sendExpenseReminder(
      user.email,
      user.name,
      user.family.familyName,
    );

    return { message: 'Test reminder sent successfully' };
  }

  /**
   * Send on-demand transaction report to a specific member with CSV securely attached
   */
  async sendTransactionReport(familyId: string, memberId: string, csvData: string, reportName: string) {
    try {
      const member = await this.prisma.user.findFirst({
        where: {
          id: memberId,
          familyId: familyId,
        },
        include: { family: true },
      });

      if (!member) {
        throw new Error('Member not found in your family');
      }

      await this.emailService.sendOnDemandReport(
        member.email,
        member.name,
        reportName,
        csvData,
      );

      this.logger.log(`On-demand transaction report sent to ${member.email} by admin`);

      return {
        message: `Report sent successfully to ${member.name}`,
        sentTo: member.email,
      };
    } catch (error) {
      this.logger.error(`Failed to send on-demand transaction report: ${error.message}`);
      throw error;
    }
  }
}

