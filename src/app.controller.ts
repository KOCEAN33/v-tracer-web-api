import { Controller, Get, Res } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('/favicon.ico')
  favicon(@Res() res: any) {
    res.status(204).end();
  }
}
