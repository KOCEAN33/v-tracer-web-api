import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GameRankingResDTO {
  @IsNumber()
  @ApiProperty({ description: 'game ID from DB' })
  gameId: number;

  @IsString()
  @ApiProperty({ description: 'Game Title' })
  gameTitle: string;

  @IsString()
  @ApiProperty({ description: 'Total played duration' })
  duration: string;
}
