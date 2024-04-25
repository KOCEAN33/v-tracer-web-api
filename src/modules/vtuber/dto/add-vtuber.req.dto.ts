import { IsNumber, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddVtuberReqDTO {
  @IsString()
  @ApiProperty({ example: 'Nekota', description: 'name of vtuber' })
  name: string;

  @IsNumber()
  @ApiProperty({ description: 'company Id from DB' })
  companyId: number;

  @IsString()
  @IsUrl()
  @ApiProperty({ description: 'youtube URL' })
  youtubeUrl: string;
}
