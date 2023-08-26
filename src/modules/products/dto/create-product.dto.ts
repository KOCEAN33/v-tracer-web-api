import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @IsString()
  @ApiProperty({ description: 'name', example: 'notion' })
  name: string;

  @IsString()
  @IsUrl()
  @ApiProperty({ description: 'url', example: 'notion.so' })
  url?: string;
}
