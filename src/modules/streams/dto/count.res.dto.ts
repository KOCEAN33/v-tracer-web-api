import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CountResDTO {
  @IsString()
  @ApiProperty({ description: 'total number' })
  total: string;

  @IsEmail()
  @ApiProperty({ description: 'changed percentage' })
  percent: string;
}
