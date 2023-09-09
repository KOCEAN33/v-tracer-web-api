import { IsMongoId, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailQueryDTO {
  @IsString()
  @IsMongoId()
  @ApiProperty({ example: '6494ed4bcdebc4eb4c615c25', description: 'userId' })
  userId: string;

  @IsString()
  @IsUUID()
  @ApiProperty({
    example: 'ebcacb8d-89b0-4a4b-a713-ca6393365eeb',
    description: 'uuid',
  })
  confirmationCode: string;
}
