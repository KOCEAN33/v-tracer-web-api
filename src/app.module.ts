import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import config from './common/config/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductModule } from './products/product.module';
import { ReviewModule } from './reviews/review.module';
import { utilities, WinstonModule } from 'nest-winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import * as winston from 'winston';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `${__dirname}/common/config/env/.${process.env.NODE_ENV}.env`,
      ],
      load: [config],
      isGlobal: true,
    }),
    // LoggerModule.forRoot({
    //   pinoHttp: {
    //     customProps: (req, res) => ({
    //       context: 'HTTP',
    //     }),
    //     level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
    //     transport:
    //       process.env.NODE_ENV !== 'production'
    //         ? { target: 'pino-pretty', options: { singleLine: true } }
    //         : undefined,
    //   },
    // }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV !== 'production' ? 'silly' : 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            utilities.format.nestLike('saas-api', { prettyPrint: true }),
          ),
        }),
      ],
    }),
    AuthModule,
    UsersModule,
    ProductModule,
    ReviewModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
