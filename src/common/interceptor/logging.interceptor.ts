import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        this.logger.log(
          JSON.stringify({
            // equestId: RequestStorage.getStorage().requestId,
            userAgent: request.header('user-agent'),
            request: {
              method: request.method,
              url: request.url,
              body: request.body,
            },
            response: {
              ...data,
              statusCode: response.statusCode,
            },
          }),
        );
        return data;
      }),
    );
  }
}
