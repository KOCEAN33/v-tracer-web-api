import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecentResDTO {
  @IsString()
  @ApiProperty({ description: 'streamId from youtube', example: 'kpGONDy0Qk0' })
  streamId: string;

  @IsString()
  @ApiProperty({ description: 'stream title' })
  streamTitle: string;

  @IsString()
  @ApiProperty({ description: 'youtube thumbnail', example: 'google url' })
  image: string;

  @IsString()
  @ApiProperty({ description: 'game title', example: 'APEX' })
  gameTitle: string;
}
