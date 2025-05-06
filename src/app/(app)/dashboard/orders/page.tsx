import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OrdersPage } from "./orders-page";
import type { Decimal } from "@prisma/client/runtime/library";

export default async function OrdersDashboardPage() {
  const { userId } = await auth();
  if (!userId) notFound();

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

  // Convert Decimal to string for serialization
  const serializedOrders = orders.map((order) => ({
    id: order.id,
    createdAt: order.createdAt,
    status: order.status,
    type: order.type,
    paymentStatus: order.paymentStatus,
    phoneNumber: order.phoneNumber,
    address: order.address,
    specialInstructions: order.specialInstructions,
    total: order.total.toString(),
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      subtotal: item.subtotal.toString(),
      menuItem: {
        name: item.menuItem.name,
      },
    })),
    statusLogs: order.statusLogs,
  }));

  return <OrdersPage orders={serializedOrders} />;
}
