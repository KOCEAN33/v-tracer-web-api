import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import authConfig from '../config/authConfig';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>,
  ) {}

  login(user) {
    const payload = { ...user };

    return jwt.sign(payload, this.config.jwtSecret, {
      expiresIn: '1d',
      audience: 'example.com',
      issuer: 'example.com',
    });
  }
}
