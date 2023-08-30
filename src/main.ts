import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { SwaggerConfig } from './common/config/config.interface';

import { winstonLogger } from './common/config/winston.config';
import * as cookieParser from 'cookie-parser';
// import * as session from 'express-session';
// import RedisStore from 'connect-redis';
// import Redis from 'ioredis';

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

  // const redis = new Redis();
  // app.use(
  //   session({
  //     // For this store to work, you need to connect service Redis to the OS, default port is: 6379, for ubuntu 20 sudo systemctl restart redis-server
  //     store: new RedisStore({
  //       client: redis,
  //     }),
  //     secret: process.env.SESSION_ID_SECRET,
  //     name: 'sid', // defaults to 'connect.sid'.
  //     resave: false, // we will not save to the database if the session data has not changed
  //     saveUninitialized: false, // otherwise, all sessions will be recorded in a row, regardless of whether the user is logged in
  //     cookie: {
  //       // true is the restriction of access in the browser from the js document
  //       httpOnly: true,
  //       /*
  //         SameSite attribute in Set-Cookie header. Controls how cookies are sent
  //         with cross-site requests. Used to mitigate CSRF. Possible values are
  //         'strict' (or true), 'lax', and false (to NOT set SameSite attribute).
  //         It only works in newer browsers, so CSRF prevention is still a concern.
  //       */
  //       sameSite: true,
  //       // true is https
  //       secure: process.env.NODE_ENV === 'production',
  //       // due date
  //       // expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
  //       /*
  //         Specifies the number (in milliseconds) to use when calculating the `Expires Set-Cookie` attribute.
  //         * This is done by taking the current server time and adding `maxAge` milliseconds to the value
  //         to calculate an `Expires` datetime. By default, no maximum age is set.
  //       */
  //       maxAge: 1000 * 60 * 60 * 24 * 365, // lifespan year unix-time in seconds
  //     },
  //   }),
  // );

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
