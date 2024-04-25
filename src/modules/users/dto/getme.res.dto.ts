import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetmeResDto {
  @IsNumber()
  @ApiProperty({ description: 'user id' })
  id: number;

  @IsString()
  @ApiProperty({ description: 'user name' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'user profile image cloud be undefined',
    nullable: true,
  })
  image: string;
}
