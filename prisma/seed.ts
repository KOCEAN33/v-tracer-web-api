import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();

  console.log('Seeding...');

  // const userData = await prisma.user.create({
  //   data: {
  //     name: 'John Doe',
  //     email: 'upchh@example.com',
  //     password: '12345678',
  //   },
  // });
  //
  // console.log({ userData });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
