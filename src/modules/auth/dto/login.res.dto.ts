import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UserLoginResDTO {
  @IsString()
  @ApiProperty({ description: 'email' })
  message: string;

  @IsString()
  @ApiProperty({ description: 'password' })
  accessToken: string;
}
