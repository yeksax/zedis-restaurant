"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { unauthorized } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function server_getAdmin() {
  const { userId } = await auth();

  if (!userId) {
    unauthorized();
  }

  const adminPermission = await prisma.adminPermission.findUnique({
    where: { clerkUserId: userId },
  });

  if (adminPermission) {
    return adminPermission;
  }

  return await prisma.adminPermission.create({
    data: {
      clerkUserId: userId,
      isFullAdmin: false,
    },
  });
}

export async function readAdminDisclaimer() {
  const { userId } = await auth();

  if (!userId) {
    unauthorized();
  }

  await prisma.adminPermission.update({
    where: { clerkUserId: userId },
    data: { readExplanation: true },
  });
}