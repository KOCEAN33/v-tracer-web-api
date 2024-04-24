import {
  Logger,
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { LoggerKey } from '../../libs/logger/domain/logger';

interface ErrorResponse {
  statusCode: number;
  message: string;
  data: null;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(@Inject(LoggerKey) private logger: Logger) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';
    const stack = exception.stack;

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
    }

    const response = (exception as HttpException).getResponse();

    // const devErrorLog: any = {
    //   status: statusCode,
    //   timestamp: new Date().toISOString(),
    //   method: req.method,
    //   message: exception?.message,
    //   response: response,
    //   stack: stack,
    // };

    const errorResponse: ErrorResponse = {
      statusCode,
      message,
      data: null,
    };

    // const log = {
    //   timestamp: new Date(),
    //   url: req.url,
    //   response,
    //   stack,
    // };
    if (process.env.NODE_ENV === 'development') {
      this.logger.error(`${exception?.message}`, {
        props: {
          response: response,
          stack: stack,
        },
      });
    }
    res.status((exception as HttpException).getStatus()).json(errorResponse);
  }
}
