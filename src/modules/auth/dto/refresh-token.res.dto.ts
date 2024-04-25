import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenResDTO {
  @IsString()
  @ApiProperty({ description: 'access-token', example: 'some jwt' })
  accessToken: string;
}
