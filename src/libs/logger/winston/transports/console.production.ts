import * as winston from 'winston';

export default class ConsoleTransportProduction {
  public static create() {
    return new winston.transports.Console({});
  }
}
