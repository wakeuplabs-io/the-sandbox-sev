import prisma from "@/lib/prisma";

export const getUsers = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.user.count()
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  };
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
