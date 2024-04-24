import { IsEmail, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @IsNumber()
  @ApiProperty({ description: 'userId' })
  userId: number;

  @IsEmail()
  @ApiProperty({ description: 'email' })
  email: string;
}
