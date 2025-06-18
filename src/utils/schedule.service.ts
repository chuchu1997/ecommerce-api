// src/promotion/promotion-cron.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PromotionCronService {
  private readonly logger = new Logger(PromotionCronService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Chạy mỗi 1 giờ
  @Cron(CronExpression.EVERY_HOUR)
  async handlePromotionExpiration() {
    const now = new Date();

    const result = await this.prisma.promotion.updateMany({
      where: {
        endDate: {
          lt: now,
        },
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    if (result.count > 0) {
      this.logger.log(
        `Đã tắt ${result.count} chương trình khuyến mãi hết hạn.`,
      );
    }
  }
}
