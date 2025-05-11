import { prisma } from "@/lib/prisma";
import { OrdersPage } from "./orders-page";
import { server_getOrders } from "@/actions/order-actions";



export default async function OrdersDashboardPage() {
  const orders = await server_getOrders();

  return <OrdersPage orders={orders} />;
}
