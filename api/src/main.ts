import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://103.49.239.73:3000',
      'http://fuzenkbabaparfume.com',
      'https://fuzenkbabaparfume.com',
    ],
  });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  app.setBaseViewsDir(join(__dirname, '..', 'email-templates'));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setViewEngine('ejs');
  await app.listen(5000);
}
bootstrap();
