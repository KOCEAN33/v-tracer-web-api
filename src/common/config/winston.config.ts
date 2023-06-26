import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import * as winston from 'winston';

const env = process.env.NODE_ENV;
const logDir = __dirname + '../../../../../logs';

const dailyOptions = (level: string) => {
  return {
    level,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + `/${level}`,
    filename: `%DATE%.${level}.log`,
    maxFiles: 30,
    zippedArchive: false,
  };
};

// error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: env === 'production' ? 'http' : 'silly',
      format:
        env === 'production'
          ? winston.format.simple()
          : winston.format.combine(
              winston.format.cli(),
              winston.format.splat(),
              winston.format.colorize({ all: true }),
              winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
              nestWinstonModuleUtilities.format.nestLike('saas-api', {
                prettyPrint: true,
              }),
            ),
    }),

    // info, warn, error logs to file
    new winstonDaily(dailyOptions('info')),
    new winstonDaily(dailyOptions('warn')),
    new winstonDaily(dailyOptions('error')),
  ],
});
