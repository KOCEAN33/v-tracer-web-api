import { SetMetadata } from '@nestjs/common';
import { Role } from '../../@types/enums';

export const HasRole = (...role: Role[]) => SetMetadata('role', role);
