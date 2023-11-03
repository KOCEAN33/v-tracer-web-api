import { PrismaClient } from '@prisma/client';
import { Kysely } from 'kysely';
import { DB } from '../src/database/types';
import { PlanetScaleDialect } from 'kysely-planetscale';

const prisma = new PrismaClient();

const genSecret = () => {
  if (process.env.DATABASE_URL) {
    const url = process.env.DATABASE_URL.split('/')[2];
    const host = url.split('@')[1];
    const username = url.split(':')[0];
    const password = url.split(':')[1].split('@')[0];
    return { host, username, password };
  }
};

const db = new Kysely<DB>({
  dialect: new PlanetScaleDialect({
    host: genSecret()?.host || '',
    username: genSecret()?.username || '',
    password: genSecret()?.password || '',
  }),
  log: ['query'],
});

async function insertUser() {
  return await db
    .insertInto('User')
    .values({ email: 'iaaaaaam@xanny.us' })
    .executeTakeFirst();
}

async function insertProfile(userId: number) {
  return await db
    .insertInto('Profile')
    .values({ name: 'takeshi', userId: userId, updatedAt: new Date() })
    .execute();
}

async function getProfileById(userId: number) {
  return await db
    .selectFrom('Profile')
    .selectAll()
    .where('userId', '=', userId)
    .executeTakeFirst();
}

async function getUserById(userId: number) {
  return await db
    .selectFrom('User')
    .selectAll()
    .where('id', '=', userId)
    .executeTakeFirst();
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

async function createUserByEmail(
  name: string,
  email: string,
  password: string,
) {
  return await db.transaction().execute(async (trx) => {
    const signUser = await trx
      .insertInto('User')
      .values({ email: email })
      .executeTakeFirstOrThrow();

    await trx
      .insertInto('Password')
      .values({
        password: password,
        userId: Number(signUser.insertId),
        updatedAt: new Date(),
      })
      .executeTakeFirstOrThrow();

    await trx
      .insertInto('Profile')
      .values({
        name: name,
        userId: Number(signUser.insertId),
        updatedAt: new Date(),
      })
      .executeTakeFirst();

    return Number(signUser.insertId);
  });
}

async function main() {
  console.log('Seeding...');
  // await prisma.user.deleteMany({});
  const user = await createUserByEmail(
    'hajime',
    'hasjsisime@example.com',
    'passwooord',
  );
  console.log(user);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
