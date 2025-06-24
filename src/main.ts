import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exceptions/all-exceptions.filter';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // ✅ Hỗ trợ x-www-form-urlencoded
  app.enableCors({
    origin: '*',
  });
  // app.use(bodyParser.urlencoded({ extended: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(bodyParser.urlencoded({ extended: true })); // 👈 Bắt buộc nếu không gửi dạng JSON

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
