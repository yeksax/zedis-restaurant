"use server";

import { prisma } from "@/lib/prisma";
import {
  type Order,
  type OrderItem,
  PaymentStatus,
  OrderStatus,
  OrderType,
} from "@prisma/client";
import { subMonths } from "date-fns";
import Decimal from "decimal.js";

export async function getDashboardData() {
  // Get current date and time references
  const now = new Date();
  const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const sixMonthsAgo = subMonths(now, 6);
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  // Fetch all relevant orders in one query
  const orders = await prisma.order.findMany({
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Process orders for different metrics
  const thisMonthOrders = orders.filter(
    (order) => order.createdAt >= firstDayThisMonth
  );
  const lastMonthOrders = orders.filter(
    (order) =>
      order.createdAt >= firstDayLastMonth &&
      order.createdAt < firstDayThisMonth
  );

  // Calculate revenue metrics
  const thisMonthRevenue = thisMonthOrders
    .filter((order) => order.paymentStatus === PaymentStatus.PAID)
    .reduce((sum, order) => {
      const orderTotal =
        order.total instanceof Decimal
          ? order.total.toNumber()
          : Number(order.total);
      return sum + orderTotal;
    }, 0);

  const lastMonthRevenue = lastMonthOrders
    .filter((order) => order.paymentStatus === PaymentStatus.PAID)
    .reduce((sum, order) => {
      const orderTotal =
        order.total instanceof Decimal
          ? order.total.toNumber()
          : Number(order.total);
      return sum + orderTotal;
    }, 0);

  // Calculate revenue increase percentage
  const revenueIncrease =
    lastMonthRevenue === 0
      ? 100
      : ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

  // Calculate orders increase percentage
  const ordersIncrease =
    lastMonthOrders.length === 0
      ? 100
      : ((thisMonthOrders.length - lastMonthOrders.length) /
          lastMonthOrders.length) *
        100;

  // Calculate active tables
  const activeTables = orders.filter(
    (order) =>
      order.status === OrderStatus.PREPARING && order.type === OrderType.PICKUP
  ).length;

  const activeTablesHourAgo = orders.filter(
    (order) =>
      order.status === OrderStatus.PREPARING &&
      order.type === OrderType.PICKUP &&
      order.createdAt < oneHourAgo
  ).length;

  const activeTablesChange = activeTables - activeTablesHourAgo;

  // Calculate pending orders
  const pendingStatuses: OrderStatus[] = [
    OrderStatus.PENDING,
    OrderStatus.PREPARING,
    OrderStatus.READY,
  ];
  const pendingOrders = orders.filter((order) =>
    pendingStatuses.includes(order.status)
  ).length;

  // Get recent pending orders
  const recentOrders = orders
    .filter((order) => pendingStatuses.includes(order.status))
    .slice(0, 3)
    .map(formatOrderForDisplay);

  // Calculate revenue data for chart
  const revenueByMonth = new Map<string, number>();
  const paidOrders = orders.filter(
    (order) => order.paymentStatus === PaymentStatus.PAID
  );
  for (const order of paidOrders) {
    const monthKey = new Date(order.createdAt).toLocaleString("default", {
      month: "short",
    });
    const revenue =
      order.total instanceof Decimal
        ? order.total.toNumber()
        : Number(order.total);
    revenueByMonth.set(monthKey, (revenueByMonth.get(monthKey) || 0) + revenue);
  }

  const formattedRevenueData = Array.from(revenueByMonth.entries())
    .map(([month, revenue]) => ({
      month,
      revenue,
    }))
    .sort((a, b) => {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return months.indexOf(a.month) - months.indexOf(b.month);
    });

  return {
    revenueData: formattedRevenueData,
    totalRevenue: thisMonthRevenue,
    revenueIncrease,
    totalOrders: thisMonthOrders.length,
    ordersIncrease,
    activeTables,
    activeTablesChange,
    pendingOrders,
    recentOrders,
    orders: orders.slice(0, 20),
  };
}

function formatOrderForDisplay(order: Order & { items: OrderItem[] }) {
  const total =
    order.total instanceof Decimal ? order.total.toNumber() : order.total;
  const itemCount = order.items.length;

  return {
    id: order.id,
    displayName:
      order.type === OrderType.PICKUP
        ? `Retirada #${order.id}`
        : `Entrega #${order.id}`,
    itemSummary: `${itemCount} ${
      itemCount === 1 ? "item" : "items"
    } • $${total.toFixed(2)}`,
    status: order.status,
  };
}
