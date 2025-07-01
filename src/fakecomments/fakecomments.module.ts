import { Module } from '@nestjs/common';
import { FakecommentsService } from './fakecomments.service';
import { FakecommentsController } from './fakecomments.controller';
import { ProductsService } from 'src/products/products.service';
import { PrismaService } from 'src/prisma.service';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [FakecommentsController],
  providers: [FakecommentsService, PrismaService],
})
export class FakecommentsModule {}
