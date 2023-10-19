import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';

export class LogoutDto {
  @ApiProperty({ description: 'userId' })
  @IsMongoId()
  @IsOptional()
  userId: string;
}
