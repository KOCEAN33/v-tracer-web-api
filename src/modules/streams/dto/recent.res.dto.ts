import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecentResDTO {
  @IsString()
  @ApiProperty({ description: 'total number' })
  streamId: string;

  @IsString()
  @ApiProperty({ description: 'changed percentage' })
  streamTitle: string;

  @IsString()
  @ApiProperty({ description: 'changed percentage' })
  image: string;

  @IsString()
  @ApiProperty({ description: 'changed percentage' })
  gameTitle: string;
}
