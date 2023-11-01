import { PrismaClient } from '@prisma/client';
import { Kysely } from 'kysely';
import { DB } from '../src/database/types';
import { PlanetScaleDialect } from 'kysely-planetscale';
import { Simplify } from 'kysely/dist/esm';
import { AllSelection } from 'kysely/dist/esm/parser/select-parser';
import { ExtractTableAlias } from 'kysely/dist/esm/parser/table-parser';

const prisma = new PrismaClient();

const genSecret = () => {
  if (process.env.DATABASE_URL) {
    const url = process.env.DATABASE_URL.split('/')[2];
    const username = url.split(':')[0];
    const password = url.split(':')[1].split('@')[0];
    return { username, password };
  }
};

const db = new Kysely<DB>({
  dialect: new PlanetScaleDialect({
    host: 'gcp.connect.psdb.cloud',
    username: genSecret()?.username || '',
    password: genSecret()?.password || '',
  }),
});

async function insertUser() {
  return await db
    .insertInto('User')
    .values({ email: 'tagon8054@gmail.com' })
    .executeTakeFirst();
}

async function insertProfile(userId: number) {
  return await db
    .insertInto('Profile')
    .values({ name: 'takeshi', userId: userId, updatedAt: new Date() })
    .execute();
}

async function getUserById(
  userId: number,
): Promise<Simplify<AllSelection<DB, ExtractTableAlias<DB, 'Profile'>>>[]> {
  return await db
    .selectFrom('Profile')
    .selectAll()
    .where('userId', '=', userId)
    .execute();
}

async function insertPassword(userId: number) {
  return await db
    .insertInto('Password')
    .values({ password: 'passw0rd', userId: userId, updatedAt: new Date() })
    .execute();
}

async function getUserByEmailWithPassword(email: string) {
  return await db
    .selectFrom('User')
    .where('User.email', '=', email)
    .innerJoin('Password', 'Password.userId', 'User.id')
    .select(['Password.password'])
    .executeTakeFirst();
}

async function main() {
  console.log('Seeding...');
  // await prisma.user.deleteMany({});
  // const user = await insertUser();
  const password = await getUserByEmailWithPassword('tagon8054@gmail.com');
  console.log(password.password);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
