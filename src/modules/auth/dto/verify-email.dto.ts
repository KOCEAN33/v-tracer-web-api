import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @IsString()
  @Length(12, 12, { message: 'Code muse be 10 letters' })
  @ApiProperty({
    example: '',
    description: 'nanoID',
  })
  verifyCode: string;
}
