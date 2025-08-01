import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { UploadModule } from './upload/upload.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { BannerModule } from './banner/banner.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { JwtGuard } from './auth/guards/jwt.guard';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MyLogger } from './utils/logger.service';
import { StoresModule } from './stores/stores.module';
import { RolesGuard } from './auth/guards/roles.guard';
import { ArticlesModule } from './articles/articles.module';
import { PromotionModule } from './promotion/promotion.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PromotionCronService } from './utils/schedule.service';
import { PrismaService } from './prisma.service';
import { CartModule } from './cart/cart.module';
import { FakecommentsModule } from './fakecomments/fakecomments.module';

@Module({
  imports: [
    ScheduleModule.forRoot(), //

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 5,
      },
    ]),
    AuthModule,
    UsersModule,
    ProductsModule,
    UploadModule,
    CategoriesModule,
    OrdersModule,
    BannerModule,
    StoresModule,
    ArticlesModule,
    PromotionModule,
    CartModule,
    FakecommentsModule,
  ],
  controllers: [AppController],
  providers: [
    PromotionCronService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },

    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // Global roles guard
    },
    PrismaService,
    AppService,
    MyLogger,
    JwtStrategy,
  ],
})
export class AppModule {}
