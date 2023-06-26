import { IsMongoId, IsString } from 'class-validator';

export class DeleteReviewQueryStringDTO {
  @IsString()
  @IsMongoId()
  reviewId: string;
}
