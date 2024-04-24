import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GenTokenDto {
  @IsNumber()
  @ApiProperty({ description: 'userId' })
  userId: number;

  @IsString()
  @ApiProperty({ description: 'social login provider' })
  provider: string;

  @IsString()
  @ApiProperty({ description: 'provider id' })
  externalId: string;

  @IsString()
  @ApiProperty({ description: 'token from provider' })
  accessToken: string;
}
