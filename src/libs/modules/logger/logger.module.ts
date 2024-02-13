import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from '../../nestjs/middleware/logger.middleware';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
