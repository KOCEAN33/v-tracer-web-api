import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddVtuberResDTO {
  @IsString()
  @ApiProperty({ description: 'Status message' })
  message: string;

  @IsNumber()
  @ApiProperty({ description: 'Added V-Tuber ID' })
  vtuberId: number;
}
