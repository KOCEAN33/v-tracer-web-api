import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetReviewsDto {
  @IsString()
  @ApiProperty({ description: 'product name', example: 'notion' })
  productHandle: string;
}
