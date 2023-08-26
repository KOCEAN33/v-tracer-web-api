import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { SwaggerConfig } from './common/config/config.interface';
import { PrismaService } from './database/prisma.service';
import { winstonLogger } from './common/config/winston.config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
    cors: {
      credentials: true,
      origin: process.env.CLIENT_URL,
    },
  });

  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  // Interceptor
  // app.useGlobalInterceptors(new ResponseInterceptor());

  // Prisma service
  const prismaService: PrismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // Swagger Api
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');
  if (swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title)
      .setDescription(swaggerConfig.description)
      .setVersion(swaggerConfig.version)
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup(swaggerConfig.path, app, document);
  }

  await app.listen(8000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
