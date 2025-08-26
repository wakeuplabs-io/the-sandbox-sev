import prisma from "@/lib/prisma";

export const getUsers = async () => {
  return prisma.user.findMany();
};

export const getOrCreateUser = async (address: string, email?: string) => {
  console.log("getUser", address);
  let user = await prisma.user.findFirst({ where: { address } });

  if (!user) {
    user = await prisma.user.create({ data: { address, email } });

  }

  if (!user) user = await prisma.user.create({ data: { address, email } });
  return user;
};

export const getUserByEmail = async (email: string) => {
  return prisma.user.findFirst({ where: { email } });
};

export const createUser = async ({ address, email }: { address: string; email: string }) => {
  // Verifica si el email ya existe
  const existing = await prisma.user.findFirst({ where: { address } });
  if (existing) {
    throw new Error("User already exists");
  }

  const user = await prisma.user.create({ data: { address, email } });

  return user;
};
