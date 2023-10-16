import { IsMongoId, IsNumber, IsString, IsUUID, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @IsString()
  @Length(10, 10, { message: 'Code muse be 10 letters' })
  @ApiProperty({
    example: '',
    description: 'random 10 string',
  })
  verifyCode: string;
}
