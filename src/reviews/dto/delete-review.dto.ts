import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteReviewDto {
  @IsString()
  reviewId: string;
}
