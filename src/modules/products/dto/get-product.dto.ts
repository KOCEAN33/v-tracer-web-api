import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetProductDto {
  @IsString()
  @ApiProperty({ description: 'product handle', example: 'notion' })
  productHandle: string;
}
