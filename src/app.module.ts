import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createPool } from 'mysql2';
import { MysqlDialect, ParseJSONResultsPlugin } from 'kysely';
import { KyselyModule } from 'nestjs-kysely';
import { ClsModule } from 'nestjs-cls';
import { v4 } from 'uuid';

import config from './config/config';
import { AuthModule } from './apps/auth/auth.module';
import { UsersModule } from './apps/users/users.module';
import { EmailModule } from './apps/email/email.module';
import { AppController } from './app.controller';
import { VtuberModule } from './apps/vtuber/vtuber.module';
import { StreamModule } from './apps/streams/stream.module';
import { ExceptionModule } from './libs/nestjs/exception/exception.module';
import { LoggerModule } from './libs/modules/logger/logger.module';

const genSecret = () => {
  const databaseUrl = process.env.DATABASE_URL as string;
  if (databaseUrl) {
    const url = databaseUrl.split('/')[2];
    const database = databaseUrl.split('/')[3];
    const host = url.split(':')[1].split('@')[1];
    const port = Number(url.split(':')[2]);
    const username = url.split(':')[0];
    const password = url.split(':')[1].split('@')[0];
    return { host, port, username, password, database };
  }
};

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      envFilePath: [`.${process.env.NODE_ENV}.env`],
      load: [config],
      cache: true,
      isGlobal: true,
    }),
    KyselyModule.forRoot({
      dialect: new MysqlDialect({
        pool: createPool({
          host: genSecret()?.host || '',
          port: genSecret()?.port || 3306,
          user: genSecret()?.username || '',
          password: genSecret()?.password || '',
          database: genSecret()?.database || '',
          ssl: {
            ca: process.env.DATABASE_CA_CERT,
            cert: process.env.DATABASE_CLIENT_CERT,
            key: process.env.DATABASE_CLIENT_KEY,
            rejectUnauthorized: true,
            minVersion: 'TLSv1.2',
          },
        }),
      }),
      plugins: [new ParseJSONResultsPlugin()],
      // log: ['query'],
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (req: Request) => req.headers['x-correlation-id'] ?? v4(),
      },
    }),
    AuthModule,
    UsersModule,
    EmailModule,
    ExceptionModule,
    VtuberModule,
    StreamModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
