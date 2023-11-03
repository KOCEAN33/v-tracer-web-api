import { UAParser } from 'ua-parser-js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserAgentParser {
  parser(userAgent: string) {
    const parser = new UAParser(userAgent);
    const os = parser.getOS().name;
    const browser = parser.getBrowser().name;
    return {
      os: os,
      browser: browser,
    };
  }
}
