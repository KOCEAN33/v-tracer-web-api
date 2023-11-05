import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @IsString()
  @ApiProperty({ description: 'name', example: 'notion' })
  name: string;

  @IsString()
  @ApiProperty({ description: 'unique name for query', example: 'notion' })
  handle: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  @ApiProperty({ description: 'url', example: 'notion.so' })
  url: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'companyId', example: 1 })
  companyId: number;
}
