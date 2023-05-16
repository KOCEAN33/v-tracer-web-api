import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { NotIn } from '../../common/decorators/not-in';
import { ApiProperty } from '@nestjs/swagger';

export class UserSignupDto {
  @Transform((params) => params.value.trim())
  @NotIn('password', { message: 'password는 name과 달라야 합니다' })
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
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  @ApiProperty({ example: 'password123', description: 'password' })
  password: string;
}
