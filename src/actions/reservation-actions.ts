"use server";

import { auth, clerkClient, User } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  type CreateReservationInput,
  createReservationSchema,
  type UpdateReservationStatusInput,
  updateReservationStatusSchema,
} from "@/schemas/reservation-schemas";

export async function createReservation(data: CreateReservationInput) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const validatedFields = createReservationSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
    };
  }

  try {
    const reservation = await prisma.reservation.create({
      data: {
        ...validatedFields.data,
        clerkUserId: userId,
        status: "PENDING",
      },
    });

    revalidatePath("/reservations");
    return { data: reservation };
  } catch (error) {
    return {
      error: "Failed to create reservation",
    };
  }
}

export async function getReservations() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        clerkUserId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { data: reservations };
  } catch (error) {
    return {
      error: "Failed to fetch reservations",
    };
  }
}

export async function updateReservationStatus(
  data: UpdateReservationStatusInput
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const validatedFields = updateReservationStatusSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
    };
  }

  try {
    const reservation = await prisma.reservation.update({
      where: {
        id: data.id,
        clerkUserId: userId,
      },
      data: {
        status: data.status,
      },
    });

    revalidatePath("/reservations");
    return { data: reservation };
  } catch (error) {
    return {
      error: "Failed to update reservation status",
    };
  }
}

export async function server_getReservations() {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: {
        date: "desc",
      },
    });

    const userMap = new Map<string, User>();

    for (const reservation of reservations) {
      if (!userMap.has(reservation.clerkUserId)) {
        const user = await (
          await clerkClient()
        ).users.getUser(reservation.clerkUserId);
        userMap.set(reservation.clerkUserId, user);
      }
    }

    return reservations.map((reservation) => ({
      ...reservation,
      user: userMap.get(reservation.clerkUserId),
    }));
  } catch (error) {
    console.error("Failed to fetch reservations:", error);
    return [];
  }
}
