import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
  @IsEmail()
  @ApiProperty({ description: 'email' })
  email: string;

  @IsString()
  @ApiProperty({ description: 'password' })
  password: string;
}
