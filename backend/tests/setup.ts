import { prisma } from '../src/models';

beforeAll(async () => {});

afterAll(async () => {
  await prisma.$disconnect();
});
