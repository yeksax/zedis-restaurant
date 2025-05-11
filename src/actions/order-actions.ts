"use server";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

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
