import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class LogoutDto {
  @IsMongoId()
  @ApiProperty({ description: 'userId' })
  userId: string;
}
