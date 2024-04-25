import { Controller, Get, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('APP')
@Controller()
export class AppController {
  constructor() {}

  @ApiOperation({ summary: 'Prevent 404 error from favicon.ico call' })
  @Get('/favicon.ico')
  favicon(@Res() res: any) {
    return res.status(204).end();
  }
}
