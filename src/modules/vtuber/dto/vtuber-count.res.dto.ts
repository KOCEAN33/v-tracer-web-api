import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VtuberCountResDTO {
  @IsString()
  @ApiProperty({ description: 'Total V-Tuber count' })
  total: string;

  @IsString()
  @ApiProperty({ description: 'changed percentage' })
  percent: string;
}
