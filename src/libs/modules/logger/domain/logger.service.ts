import { Inject, Injectable, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
import Logger, { LoggerBaseKey } from './logger';
import { LogData, LogLevel } from './log';
import { ConfigService } from '@nestjs/config';
import { ClsService } from 'nestjs-cls';

@Injectable({ scope: Scope.TRANSIENT })
export default class LoggerService implements Logger {
  private readonly sourceClass: string;
  private readonly organization: string;
  private readonly context: string;
  private readonly app: string;

  public constructor(
    private readonly cls: ClsService,
    @Inject(LoggerBaseKey) private logger: Logger,
    configService: ConfigService,
    @Inject(INQUIRER) parentClass: object,
    // @Inject(ContextStorageServiceKey)
    // private contextStorageService: ContextStorageService,
  ) {
    // Set the source class from the parent class
    this.sourceClass = parentClass?.constructor?.name;

    // Set the organization, context and app from the environment variables
    this.organization = configService.get<string>('ORGANIZATION');
    this.context = configService.get<string>('CONTEXT');
    this.app = configService.get<string>('APP');
  }

  public log(
    level: LogLevel,
    message: string | Error,
    data?: LogData,
    profile?: string,
  ) {
    return this.logger.log(level, message, this.getLogData(data), profile);
  }

  public debug(message: string, data?: LogData, profile?: string) {
    return this.logger.debug(message, this.getLogData(data), profile);
  }

  public info(message: string, data?: LogData, profile?: string) {
    return this.logger.info(message, this.getLogData(data), profile);
  }

  public warn(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.warn(message, this.getLogData(data), profile);
  }

  public error(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.error(message, this.getLogData(data), profile);
  }

  public fatal(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.fatal(message, this.getLogData(data), profile);
  }

  public emergency(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.emergency(message, this.getLogData(data), profile);
  }

  private getLogData(data?: LogData): LogData {
    return {
      ...data,
      organization: data?.organization || this.organization,
      context: data?.context || this.context,
      app: data?.app || this.app,
      sourceClass: data?.sourceClass || this.sourceClass,
      correlationId: data?.correlationId || this.cls.getId(),
    };
  }

  public startProfile(id: string) {
    this.logger.startProfile(id);
  }
}
