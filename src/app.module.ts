import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import config from './common/config/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductModule } from './modules/products/product.module';
import { ReviewModule } from './modules/reviews/review.module';

import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ExceptionModule } from './common/exception/exception.module';
import { EmailModule } from './modules/email/email.module';
import { KyselyModule } from './database/kysely.module';

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
    ExceptionModule,
    AuthModule,
    UsersModule,
    ProductModule,
    ReviewModule,
    EmailModule,
    KyselyModule,
  ],
  controllers: [],
  providers: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
