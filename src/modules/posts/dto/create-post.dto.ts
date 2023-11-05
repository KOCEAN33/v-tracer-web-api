import { PostStatus, PostType } from '../../../database/enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @ApiProperty({ description: 'title', example: 'title' })
  title: string;

  @IsString()
  @ApiProperty({ description: 'content', example: 'content' })
  content: string;

  @IsString()
  @IsEnum(PostType)
  @ApiProperty({ description: 'post type', example: 'REVIEW' })
  type: PostType;

  @IsString()
  @IsEnum(PostStatus)
  @ApiProperty({ description: 'post status', example: 'DRAFT' })
  status: PostStatus;

  @IsString()
  @ApiProperty({ description: 'product name', example: 'notion' })
  productHandle: string;

  @IsNumber()
  @ApiProperty({ description: 'userId', example: 10 })
  userId: number;
}
