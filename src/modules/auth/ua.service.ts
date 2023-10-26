import { UAParser } from 'ua-parser-js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserAgentParser {
  // TODO: 유저가 User-Agent를 제공하지 않았을때의 예외처리 필요
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
