import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { SwaggerConfig } from './common/config/config.interface';
import { AppModule } from './app.module';
import { PrismaService } from './database/prisma.service';
import { winstonLogger } from './common/logger/winston.util';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: winstonLogger,
  });

  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const configService = app.get(ConfigService);

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
