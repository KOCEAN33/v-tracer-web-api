import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class FindReviewsByUserQueryStringDTO {
  @IsString()
  @IsMongoId()
  @IsOptional()
  productId: string;
}
