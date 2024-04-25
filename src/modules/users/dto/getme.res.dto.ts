import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetmeResDto {
  @IsNumber()
  @ApiProperty({ description: 'game ID from DB' })
  id: number;

  @IsString()
  @ApiProperty({ description: 'Game Title' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Total played duration', nullable: true })
  image: string;
}
