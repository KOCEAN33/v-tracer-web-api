import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GameRankingResDto {
  @IsNumber()
  @ApiProperty({ description: 'game ID from DB' })
  gameId: number;

  @IsString()
  @ApiProperty({ description: 'Game Title' })
  gameTitle: string;

  @IsString()
  @ApiProperty({ description: 'Total played duration' })
  duration: string;

  constructor(ranking) {
    this.gameId = ranking.gameId;
    this.gameTitle = ranking.gameTitle;
    this.gameTitle = ranking.gameTitle;
  }
}
