import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UserSignUpDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  @ApiProperty({ example: 'asashi', description: 'name' })
  name: string;

  @IsEmail()
  @MaxLength(60)
  @ApiProperty({ example: 'asahi@test.com', description: 'email' })
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @ApiProperty({ example: 'password123', description: 'password' })
  password: string;
}
