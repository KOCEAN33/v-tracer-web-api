import type { Config } from './config.interface';

const config: Config = {
  swagger: {
    enabled: true,
    title: 'V-Tracer Backend API',
    description: 'Backend API for V-Tuber Tracker Community',
    version: '1.0',
    path: 'api-docs',
  },
  security: {
    expiresIn: '1h',
    refreshIn: '14d',
    bcryptSaltOrRound: 12,
  },
  email: {
    domain: 'v-tracer.com',
    verifySender: 'v-tracer <no-reply@v-tracer.com>',
    expiresIn: 60,
  },
};

export default (): Config => config;
