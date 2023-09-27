import { IsMongoId, IsString } from 'class-validator';

export class UserEntity {
  @IsString()
  @IsMongoId()
  userId: string;
}
