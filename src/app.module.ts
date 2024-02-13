import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KyselyModule } from 'nestjs-kysely';
import { PlanetScaleDialect } from 'kysely-planetscale';
import { ParseJSONResultsPlugin } from 'kysely';
import { v4 } from 'uuid';

import config from './config/config';
import { AuthModule } from './apps/auth/auth.module';
import { UsersModule } from './apps/users/users.module';

import { EmailModule } from './apps/email/email.module';

import { ExceptionModule } from './libs/nestjs/exception/exception.module';

import { AppController } from './app.controller';
import { VtuberModule } from './apps/vtuber/vtuber.module';
import { StreamsModule } from './apps/streams/streams.module';
import { LoggerModule } from './libs/modules/logger/logger.module';
import { ClsModule } from 'nestjs-cls';

const genSecret = () => {
  const databaseUrl = process.env.DATABASE_URL as string;
  if (databaseUrl) {
    const url = databaseUrl.split('/')[2];
    const host = url.split('@')[1];
    const username = url.split(':')[0];
    const password = url.split(':')[1].split('@')[0];
    return { host, username, password };
  }
};

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`],
      load: [config],
      cache: true,
      isGlobal: true,
    }),
    KyselyModule.forRoot({
      dialect: new PlanetScaleDialect({
        host: genSecret()?.host || '',
        username: genSecret()?.username || '',
        password: genSecret()?.password || '',
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
    StreamsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
