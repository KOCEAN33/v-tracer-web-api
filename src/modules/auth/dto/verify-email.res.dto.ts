import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailResDTO {
  @IsString()
  @ApiProperty({
    example: '',
    description: 'nanoID',
  })
  message: string;
}
