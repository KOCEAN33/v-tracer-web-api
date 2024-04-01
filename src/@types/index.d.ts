import { DB as Database } from '../@types/types';
import { Kysely } from 'kysely';

export type DB = Kysely<Database>;
