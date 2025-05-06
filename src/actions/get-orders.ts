"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getOrders() {
  const user = await auth();
  const userId = user.userId;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const orders = await prisma.order.findMany({
    where: {
      clerkUserId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      createdAt: true,
      status: true,
      type: true,
      paymentStatus: true,
      total: true,
    },
  });

  return orders;
}
