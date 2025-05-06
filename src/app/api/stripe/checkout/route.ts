import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import type { CartItem } from "@/contexts/cart-context";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Decimal from "decimal.js";
import { OrderType, PaymentStatus } from "@prisma/client";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const host = url.origin;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await (await clerkClient()).users.getUser(userId);

  try {
    const { items } = (await request.json()) as { items: CartItem[] };

    const order = await prisma.order.create({
      data: {
        clerkUserId: userId,
        items: {
          create: items.map((item) => ({
            menuItemId: item.item.id,
            quantity: item.quantity,
            unitPrice: item.item.price,
            subtotal: new Decimal(item.item.price).mul(item.quantity),
          })),
        },
        total: items.reduce(
          (acc, item) =>
            acc.add(new Decimal(item.item.price).mul(item.quantity)),
          new Decimal(0)
        ),
        phoneNumber: user.phoneNumbers[0].phoneNumber,
        type: OrderType.DELIVERY,
        paymentStatus: PaymentStatus.PENDING,
      },
    });

    if (!items?.length) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      client_reference_id: userId,
      line_items: items.map((item: CartItem) => ({
        price_data: {
          currency: "brl",
          product_data: {
            name: item.item.name,
            images: item.item.image ? [item.item.image] : undefined,
            description: item.item.description || undefined,
          },
          unit_amount: Math.round(Number(item.item.price) * 100),
        },
        quantity: item.quantity,
      })),
      phone_number_collection: {
        enabled: true,
      },
      shipping_address_collection: {
        allowed_countries: ["BR"],
      },
      success_url: `${host}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${host}`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentIntent: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[STRIPE_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
