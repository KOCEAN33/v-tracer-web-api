import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class QueryParamsDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'product unique name(handle)',
    example: 'notion',
  })
  handle: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'product unique ID',
    example: '647101ecac3218877849412b',
  })
  productId: string;
}
