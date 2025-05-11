"use server";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";

export async function server_getOrder(id: number) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
      statusLogs: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!order) {
    return null;
  }

  if (!order.paymentIntent) {
    throw new Error("Payment intent not found");
  }

  const stripeIntent = await stripe.checkout.sessions.retrieve(
    order.paymentIntent
  );

  return {
    ...order,
    address: stripeIntent.customer_details?.address,
  };
}

export async function server_getOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          menuItem: {
            select: {
              name: true,
            },
          },
        },
      },
      statusLogs: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  return orders;
}

export async function server_getPersonalOrders() {
  const user = await auth();
  const userId = user.userId;

  if (!userId) {
    throw new Error("User not found");
  }

  const orders = await prisma.order.findMany({
    where: { clerkUserId: userId },
    orderBy: { createdAt: "desc" },
  });
  return orders;
}