import { IsBoolean, IsMongoId, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewBodyDto {
  @IsString()
  @IsMongoId()
  productId: string;

  @IsString()
  @ApiProperty({
    description: 'review Title',
    example: 'Best note application',
  })
  title: string;

  @IsString()
  @ApiProperty({
    description: 'review Description',
    example: 'AI and database system is best...',
  })
  body: string;

  @IsBoolean()
  @ApiProperty({
    description: 'publish status',
    example: 'true & false',
  })
  publish: boolean;
}