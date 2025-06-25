import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';
import { PrismaService } from './prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}
  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('/health')
  async check() {
    console.log('CHECK');
    try {
      await this.prisma.$queryRaw`SELECT 1`; // hoặc this.prisma.$queryRawUnsafe('SELECT 1')
      return { status: 'ok' };
    } catch (err) {
      throw new ServiceUnavailableException('Database not ready');
    }
  }
}
