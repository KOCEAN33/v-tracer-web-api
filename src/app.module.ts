import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import authConfig from './config/authConfig';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      load: [authConfig],
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
