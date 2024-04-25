import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class RefreshTokenResDTO {
  @IsString()
  @ApiProperty({ description: 'password' })
  accessToken: string;
}
