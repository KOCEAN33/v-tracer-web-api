import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserLoginResDTO {
  @IsString()
  @ApiProperty({ description: 'message', example: 'result' })
  message: string;

  @IsString()
  @ApiProperty({ description: 'access-token', example: 'some jwt' })
  accessToken: string;
}
