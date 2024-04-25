import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCompanyResDTO {
  @IsString()
  @ApiProperty({ example: 'vspo', description: 'name of company' })
  message: string;

  @IsNumber()
  @ApiProperty({ description: 'company ID' })
  companyId: number;
}
