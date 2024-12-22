import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | null = null;

export const validatePrismaClient = (): void => {
  if (!prisma) {
    throw new Error('Prisma is not initialized.');
  }
};

prisma = new PrismaClient();

export const disconnectPrisma = async (): Promise<void> => {
  if (prisma) {
    await prisma.$disconnect();
  }
};

export default prisma;
