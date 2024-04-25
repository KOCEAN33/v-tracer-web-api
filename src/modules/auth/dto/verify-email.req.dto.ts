import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailReqDTO {
  @IsString()
  @Length(12, 12, { message: 'Code muse be 10 letters' })
  @ApiProperty({
    example: 'some 10 codes',
    description: 'nanoID',
  })
  verifyCode: string;
}
