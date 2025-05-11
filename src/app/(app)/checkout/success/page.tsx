import { updateOrderStatus } from "@/actions/update-order-status";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { Bike, CheckCircle2, ChevronLeft, Eye } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }>;
}) {
  const { userId } = await auth();
  const { session_id } = await searchParams;

  if (!session_id || !userId) {
    console.error("Session ID or user ID not found");
    redirect("/");
  }

  const session = await stripe.checkout.sessions.retrieve(session_id);
  const updatedOrder = await prisma.order.updateMany({
    where: {
      paymentIntent: session.id as string,
      clerkUserId: userId,
      paymentStatus: PaymentStatus.PENDING,
    },
    data: {
      paymentStatus: PaymentStatus.PAID,
    },
  });

  const order = await prisma.order.findFirst({
    where: {
      paymentIntent: session.id as string,
    },
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
    },
  });

  if (updatedOrder.count > 0) {
    await updateOrderStatus(order?.id as number, OrderStatus.PAID);
  }

  return (
    <div className="container mx-auto max-w-2xl py-16">
      <Card className="p-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Pedido Confirmado!</h1>
            <p className="text-muted-foreground">
              Seu pedido{" "}
              <span className="font-medium text-foreground/80">
                {order?.id}
              </span>{" "}
              foi confirmado e está sendo preparado.
            </p>
          </div>

          <div className="w-full">
            <div className="flex flex-col gap-4 rounded-lg bg-muted p-4">
              <div className="flex items-center justify-between border-b pb-4">
                <span className="font-medium">Itens do Pedido</span>
                <span className="font-medium">Total</span>
              </div>

              {order?.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <span>
                    {item.quantity}x {item.menuItem.name}
                  </span>
                  <span>R$ {item.subtotal.toFixed(2)}</span>
                </div>
              ))}

              <div className="flex items-center justify-between border-t pt-4 font-medium">
                <span>Total</span>
                <span>R$ {order?.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between w-full">
            <Button asChild className="gap-2" variant="outline">
              <Link href="/">
                <ChevronLeft className="h-4 w-4" />
                Voltar ao Cardápio
              </Link>
            </Button>

            <Button asChild className="gap-2">
              <Link href={`/orders/tracking/${order?.id}`}>
                <Bike className="h-4 w-4" />
                Rastrear Pedido
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
