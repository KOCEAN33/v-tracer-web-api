import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { SwaggerConfig } from './common/config/config.interface';

import { winstonLogger } from './common/config/winston.config';
import * as cookieParser from 'cookie-parser';

import { useContainer } from 'class-validator';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
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

  await app.listen(parseInt(process.env.PORT) || 8000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

// TODO: 전역 문자열 트림 파이프 추가
// https://stackoverflow.com/questions/63766390/using-nest-js-i-would-like-to-trim-all-body-input-values
