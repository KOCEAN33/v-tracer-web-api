import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from '../../nestjs/middleware/logger.middleware';
import Logger, { LoggerBaseKey, LoggerKey } from './domain/logger';
import WinstonLogger, {
  WinstonLoggerTransportsKey,
} from './winston/winston-logger';
import LoggerService from './domain/logger.service';
import LoggerServiceAdapter from './logger.service.adapter';
import ConsoleTransport from './winston/transports/console';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: LoggerBaseKey,
      useClass: WinstonLogger,
    },
    {
      provide: LoggerKey,
      useClass: LoggerService,
    },
    {
      provide: LoggerServiceAdapter,
      useFactory: (logger: Logger) => new LoggerServiceAdapter(logger),
      inject: [LoggerKey],
    },
    {
      provide: WinstonLoggerTransportsKey,
      useFactory: () => {
        const transports = [];

        transports.push(ConsoleTransport.createColorize());

        return transports;
      },
    },
  ],
  exports: [LoggerKey, LoggerServiceAdapter],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
