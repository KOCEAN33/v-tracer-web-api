import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class LogoutReqDTO {
  @ApiProperty({ description: 'userId' })
  @IsNumber()
  @IsOptional()
  userId: number;
}
