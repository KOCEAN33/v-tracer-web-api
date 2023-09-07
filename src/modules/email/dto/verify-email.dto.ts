import { IsEmail, IsMongoId, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @IsString()
  @IsMongoId()
  @ApiProperty({ description: 'userId' })
  userId: string;

  @IsEmail()
  @ApiProperty({ description: 'email' })
  email: string;
}
