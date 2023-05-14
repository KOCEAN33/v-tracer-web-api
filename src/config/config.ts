import type { Config } from './config.interface';

const config: Config = {
  swagger: {
    enabled: true,
    title: 'Nestjs FTW',
    description: 'The nestjs API description',
    version: '1.5',
    path: 'api',
  },
  security: {
    expiresIn: '1m',
    refreshIn: '7d',
    bcryptSaltOrRound: 12,
  },
};

export default (): Config => config;
