import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PatchReviewDto {
  @IsString()
  @ApiProperty({
    description: 'review ID',
    example: '932052fnla9340',
  })
  reviewId: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'review Title',
    example: 'Best note application',
  })
  title: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'review Description',
    example: 'AI and database system is best...',
  })
  body: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Is ready to publish?',
    example: 'true & false',
  })
  publish: boolean;
}
