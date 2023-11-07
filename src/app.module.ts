import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import config from './common/config/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductModule } from './modules/products/product.module';
import { PostModule } from './modules/posts/post.module';
import { EmailModule } from './modules/email/email.module';
import { KyselyModule } from './database/kysely.module';
import { ExceptionModule } from './common/exception/exception.module';

import { LoggerMiddleware } from './common/middleware/logger.middleware';

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
    AuthModule,
    UsersModule,
    ProductModule,
    PostModule,
    KyselyModule,
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
