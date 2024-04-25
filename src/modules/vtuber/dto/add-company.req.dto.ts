import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCompanyReqDTO {
  @IsString()
  @ApiProperty({ example: 'vspo', description: 'name of company' })
  name: string;

  @IsString()
  @IsUrl()
  @ApiProperty({ description: 'company URL' })
  url: string;
}
