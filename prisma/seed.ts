import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');
  const today = new Date();
  const todayAddHour = new Date(today.setHours(today.getHours() + 1));

  // const userData = await prisma.user.create({
  //   data: {
  //     name: 'John Doe',
  //     email: 'upchh@example.com',
  //     status: 'Activated',
  //   },
  // });
  // console.log({ userData });

  const seedVerifyToken = await prisma.verifyToken.createMany({
    data: [
      // {
      //   type: 'NewAccount',
      //   userId: '6501ef25efdbf55df72f7e24',
      //   email: 'dev@example.com',
      //   token: 'ecb5f58c-22eb-4aae-bbeb-0a371c2cc89d',
      //   isVerifiable: true,
      //   expiresIn: todayAddHour,
      // },
      // {
      //   type: 'ChangePassword',
      //   userId: '6501ef25efdbf55df72f7e24',
      //   email: 'dev123@example.com',
      //   token: 'ecb5f58c-22eb-4aae-bbeb-0a371sc21c89d',
      //   isVerifiable: true,
      //   expiresIn: new Date(),
      // },
      // {
      //   type: 'NewAccount',
      //   userId: '6501ef25efdbf55df72f7e24',
      //   email: 'iam@example.com',
      //   token: 'ecb5f58c-22eb-4aae-bbeb-0a3731c2cc69d',
      //   isVerifiable: true,
      //   expiresIn: todayAddHour,
      // },
    ],
  });
  console.log({ seedVerifyToken });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
