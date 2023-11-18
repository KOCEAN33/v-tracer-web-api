import { Kysely } from 'kysely';
import { DB as Database } from './types';

export type DB = Kysely<Database>;
