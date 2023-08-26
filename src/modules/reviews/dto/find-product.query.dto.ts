import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindReviewByProductQueryStringDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'product unique name(handle)',
    example: 'notion',
  })
  product: string;

  @IsString()
  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    description: 'product unique ID',
    example: '647101ecac3218877849412b',
  })
  productId: string;
}
