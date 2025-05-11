"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@prisma/client";

export async function updateOrderStatus(
  orderId: number,
  newStatus: OrderStatus,
  message?: string
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Get the current order to check if status is actually changing
    const currentOrder = await prisma.order.findUnique({
      where: { id: orderId },
      select: { status: true },
    });

    if (!currentOrder) {
      throw new Error("Order not found");
    }

    // Only create a new status log if the status is actually changing
    // Use a transaction to ensure both operations succeed or fail together
    const updatedOrder = await prisma.$transaction([
      // Update the order status
      prisma.order.update({
        where: { id: orderId },
        data: {
          status: newStatus,
          // Update estimatedDeliveryTime based on status
          ...(newStatus === "PREPARING" && {
            estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
          }),
        },
      }),
      // Create a new status log entry
      prisma.orderStatusLog.create({
        data: {
          orderId,
          status: newStatus,
          message: message || getDefaultStatusMessage(newStatus),
          createdBy: userId,
        },
      }),
    ]);

    // Revalidate the order tracking page
    if (newStatus !== "PAID") revalidatePath(`/orders/tracking/${orderId}`);

    return { success: true, order: updatedOrder[0] };
  } catch (error) {
    console.error("[UPDATE_ORDER_STATUS]", error);
    return {
      success: false,
      error: "Failed to update order status",
    };
  }
}

// Helper function to get default status messages
function getDefaultStatusMessage(status: OrderStatus): string {
  const messages = {
    CREATED: "Pedido criado",
    PAID: "Pagamento recebido",
    PENDING: "Pedido recebido e aguardando confirmação",
    CONFIRMED: "Pedido confirmado pelo restaurante",
    PREPARING: "Sua deliciosa refeição está sendo preparada pelos nossos chefs",
    READY: "Sua ordem está pronta para retirada/entrega",
    DELIVERED: "Pedido entregue com sucesso",
    CANCELLED: "Pedido cancelado",
  };

  return messages[status as keyof typeof messages];
}
