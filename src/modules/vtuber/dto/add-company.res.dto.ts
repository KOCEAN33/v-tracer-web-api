import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCompanyResDTO {
  @IsString()
  @ApiProperty({ example: 'vspo', description: 'name of company' })
  message: string;

  @IsString()
  @IsUrl()
  @ApiProperty({ description: 'company URL' })
  companyId: number;
}
