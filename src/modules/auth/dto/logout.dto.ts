import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsOptional } from 'class-validator';

export class LogoutDto {
  @ApiProperty({ description: 'userId' })
  @IsNumber()
  @IsOptional()
  userId: number;
}
