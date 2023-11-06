import { PostStatus, PostType } from '../../../database/enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @ApiProperty({ description: 'title', example: 'title' })
  title: string;

  @IsString()
  @ApiProperty({ description: 'body', example: 'body' })
  body: string;

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
}
