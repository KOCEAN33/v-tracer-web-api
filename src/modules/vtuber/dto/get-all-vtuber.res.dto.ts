import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetAllVtuberResDTO {
  @IsNumber()
  @ApiProperty({ description: 'V-Tuber ID' })
  id: number;

  @IsString()
  @ApiProperty({ description: 'V-Tuber Name' })
  name: string;

  @IsString()
  @ApiProperty({ description: 'V-Tuber Youtube URL' })
  url: string;

  @IsString()
  @ApiProperty({ description: 'V-Tuber Status' })
  status: string;
}
