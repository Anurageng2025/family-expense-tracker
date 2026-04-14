import { Injectable, ForbiddenException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../auth/email.service';
import axios from 'axios';

@Injectable()
export class FamilyService {
  private readonly logger = new Logger(FamilyService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  /**
   * Get family details with all members
   */
  async getFamilyDetails(familyId: string) {
    const family = await this.prisma.family.findUnique({
      where: { id: familyId },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            lastLat: true,
            lastLng: true,
            locationType: true,
            lastLocationAt: true,
          },
        },
      },
    });

    return family;
  }

  /**
   * Get all family members
   */
  async getFamilyMembers(familyId: string) {
    const members = await this.prisma.user.findMany({
      where: { familyId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        lastLat: true,
        lastLng: true,
        locationType: true,
        lastLocationAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return members;
  }

  /**
   * Remove a family member (ADMIN only)
   */
  async removeMember(familyId: string, memberId: string, requestorRole: string) {
    if (requestorRole !== 'ADMIN') {
      throw new ForbiddenException('Only admins can remove members');
    }

    // Check if member belongs to the family
    const member = await this.prisma.user.findFirst({
      where: {
        id: memberId,
        familyId,
      },
    });

    if (!member) {
      throw new ForbiddenException('Member not found in your family');
    }

    // Cannot remove admin
    if (member.role === 'ADMIN') {
      throw new ForbiddenException('Cannot remove admin user');
    }

    // Delete member
    await this.prisma.user.delete({
      where: { id: memberId },
    });

    return { message: 'Member removed successfully' };
  }

  /**
   * Update family name (ADMIN only)
   */
  async updateFamilyName(familyId: string, newName: string, requestorRole: string) {
    if (requestorRole !== 'ADMIN') {
      throw new ForbiddenException('Only admins can update family name');
    }

    const family = await this.prisma.family.update({
      where: { id: familyId },
      data: { familyName: newName },
    });

    return family;
  }

  /**
   * Update user's current location
   */
  async updateLocation(userId: string, lat?: number, lng?: number, ip?: string) {
    let finalLat = lat;
    let finalLng = lng;
    let type = 'GPS';

    // If coordinates are missing, fall back to IP
    if ((finalLat === undefined || finalLng === undefined || finalLat === null || finalLng === null) && ip) {
      try {
        const ipLocation = await this.getIpLocation(ip);
        if (ipLocation) {
          finalLat = ipLocation.lat;
          finalLng = ipLocation.lng;
          type = 'IP';
        }
      } catch (error) {
        this.logger.error(`Failed to get IP location for ${ip}: ${error.message}`);
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        lastLat: finalLat,
        lastLng: finalLng,
        locationType: type,
        lastLocationAt: new Date(),
      },
    });
  }

  /**
   * Get location estimate based on IP address
   */
  private async getIpLocation(ip: string): Promise<{ lat: number; lng: number } | null> {
    // Treat localhost/private IPs by using a fallback for testing or just returning null
    if (ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.')) {
      return null;
    }

    try {
      const response = await axios.get(`http://ip-api.com/json/${ip}?fields=status,message,lat,lon`);
      if (response.data.status === 'success') {
        return {
          lat: response.data.lat,
          lng: response.data.lon,
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Send location report to Admin
   */
  async sendLocationReport(familyId: string, adminId: string) {
    const admin = await this.prisma.user.findFirst({
      where: { id: adminId, familyId, role: 'ADMIN' },
    });

    if (!admin) {
      throw new ForbiddenException('Only admins can request location reports');
    }

    const members = await this.prisma.user.findMany({
      where: { familyId },
      select: {
        name: true,
        email: true,
        lastLat: true,
        lastLng: true,
        locationType: true,
        lastLocationAt: true,
      },
      orderBy: { name: 'asc' },
    });

    await this.emailService.sendLocationReport(
      admin.email,
      admin.name,
      members.map(m => ({
        name: m.name,
        email: m.email,
        lat: m.lastLat,
        lng: m.lastLng,
        type: m.locationType || 'GPS',
        lastSeen: m.lastLocationAt,
      })),
    );

    return { message: 'Location report emailed successfully' };
  }
}

