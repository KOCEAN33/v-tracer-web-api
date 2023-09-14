import { UAParser } from 'ua-parser-js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserAgentParser {
  parser(userAgent: string, ip: string, fingerprint: string) {
    const parser = new UAParser(userAgent);
    const os = parser.getOS().name;
    const browser = parser.getBrowser().name;
    return {
      IP: ip,
      OS: os,
      browser: browser,
      fingerprint: fingerprint,
    };
  }
}
