export interface Config {
  swagger: SwaggerConfig;
  security: SecurityConfig;
  email: EmailConfig;
}

export interface SecurityConfig {
  expiresIn: string;
  refreshIn: string;
  bcryptSaltOrRound: string | number;
}

export interface SwaggerConfig {
  enabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
}

export interface EmailConfig {
  domain: string;
  verifySender: string;
  expiresIn: number;
}
