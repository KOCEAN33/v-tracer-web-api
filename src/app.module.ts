import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import config from './common/config/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductModule } from './modules/products/product.module';
import { PostModule } from './modules/posts/post.module';
import { EmailModule } from './modules/email/email.module';

import { ExceptionModule } from './common/exception/exception.module';

import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { KyselyModule } from 'nestjs-kysely';
import { PlanetScaleDialect } from 'kysely-planetscale';
import { ParseJSONResultsPlugin } from 'kysely';
import * as process from 'process';

const genSecret = () => {
  const databaseUrl = process.env.DATABASE_URL as string;
  if (databaseUrl) {
    const url = databaseUrl.split('/')[2];
    const host = url.split('@')[1];
    const username = url.split(':')[0];
    const password = url.split(':')[1].split('@')[0];
    return { host, username, password };
  }
};

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `${__dirname}/common/config/env/.${process.env.NODE_ENV}.env`,
      ],
      load: [config],
      cache: true,
      isGlobal: true,
    }),
    KyselyModule.forRoot({
      dialect: new PlanetScaleDialect({
        host: genSecret()?.host || '',
        username: genSecret()?.username || '',
        password: genSecret()?.password || '',
      }),
      plugins: [new ParseJSONResultsPlugin()],
    }),
    AuthModule,
    UsersModule,
    ProductModule,
    PostModule,
    EmailModule,
    ExceptionModule,
  ],
  controllers: [],
  providers: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
