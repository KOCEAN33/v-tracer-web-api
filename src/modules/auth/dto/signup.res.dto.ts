import { IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class SignupResDTO {
  @IsString()
  @ApiProperty({ example: 'asashi', description: 'name' })
  message: string;
}
