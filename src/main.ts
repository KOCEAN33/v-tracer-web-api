import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';

import { AppModule } from './app.module';
import { SwaggerConfig } from './config/config.interface';

import { winstonLogger } from './config/winston.config';
import * as cookieParser from 'cookie-parser';

import { ResponseInterceptor } from './libs/nestjs/interceptor/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: winstonLogger,
  });
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.use(cookieParser(`${process.env.APP_SECRET}`));

  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: 'GET,POST,PUT,PATCH,DELETE',
    exposedHeaders: ['authorization'],
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

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
