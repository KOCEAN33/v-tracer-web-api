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
    expiresIn: '30d',
    refreshIn: '7d',
    bcryptSaltOrRound: 12,
  },
};

export default (): Config => config;
