import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddVtuberResDTO {
  @IsString()
  @ApiProperty({ description: 'Information Message' })
  message: string;

  @IsNumber()
  @ApiProperty({ description: 'Add V-Tuber ID' })
  vtuberId: number;
}
