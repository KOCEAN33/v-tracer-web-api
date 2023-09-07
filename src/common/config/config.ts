import type { Config } from './config.interface';

const config: Config = {
  swagger: {
    enabled: true,
    title: 'SaaS Community Backend API',
    description: 'Backend API for SaaS Community',
    version: '1.0',
    path: 'api-docs',
  },
  security: {
    expiresIn: '10m',
    refreshIn: '14d',
    bcryptSaltOrRound: 12,
  },
  email: {
    domain: 'tries.io',
    verifySender: 'tries.io <no-reply@tries.io>',
    expiresIn: 60,
  },
};

export default (): Config => config;
