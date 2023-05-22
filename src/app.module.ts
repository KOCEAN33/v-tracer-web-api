import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { loggingMiddleware, PrismaModule } from 'nestjs-prisma';
import { LoggerModule } from 'nestjs-pino';

import config from './common/config/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ReviewsController } from './reviews/reviews.controller';
import { ProductsController } from './products/products.controller';

// TODO 1. import prisma module for root and logger
// TODO 2. connect logger by pino

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          // TODO config prisma middleware
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'log',
          }),
        ],
      },
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: (req, res) => ({
          context: 'HTTP',
        }),
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { singleLine: true } }
            : undefined,
      },
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [ReviewsController, ProductsController],
  providers: [],
})
export class AppModule {}
