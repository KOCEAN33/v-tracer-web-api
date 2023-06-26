import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import config from './common/config/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductModule } from './products/product.module';
import { ReviewModule } from './reviews/review.module';

import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ExceptionModule } from './common/exception/exception.module';
import { winstonLoggerAsync } from './common/config/winston.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `${__dirname}/common/config/env/.${process.env.NODE_ENV}.env`,
      ],
      load: [config],
      isGlobal: true,
    }),
    winstonLoggerAsync,
    AuthModule,
    UsersModule,
    ProductModule,
    ReviewModule,
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
