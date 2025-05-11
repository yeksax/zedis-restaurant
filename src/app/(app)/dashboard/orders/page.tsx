import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OrdersPage } from "./orders-page";

export async function getOrders() {
  "use server";

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

export default async function OrdersDashboardPage() {
  const { userId } = await auth();
  if (!userId) notFound();

  const orders = await getOrders();

  return <OrdersPage orders={orders} />;
}
