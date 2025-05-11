import { prisma } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { type User } from "@clerk/nextjs/server";

export async function getCustomers() {
  try {
    // Fetch all users directly from Clerk
    const clerkUsers = await (await clerkClient()).users.getUserList();

    // Create a map for quick lookup
    const userMap = new Map<string, User>();
    clerkUsers.data.forEach((user) => userMap.set(user.id, user));

    // Get customer data from our database
    const customersData = await Promise.all(
      clerkUsers.data.map(async (clerkUser) => {
        const clerk_user_id = clerkUser.id;
        const [
          { total_spent, total_orders } = { total_spent: "0", total_orders: 0 },
          { upcoming_reservations = 0 } = {},
          lastOrder,
          lastReservation,
        ] = await Promise.all([
          // Get total spent and order count
          prisma.$queryRaw<{ total_spent: string; total_orders: number }[]>`
            SELECT 
              COALESCE(SUM(total), 0) as total_spent,
              COUNT(*) as total_orders
            FROM "Order"
            WHERE "clerkUserId" = ${clerk_user_id}
            AND "status" != 'CANCELLED'
          `.then((r) => r[0]),

          // Get upcoming reservations count
          prisma.$queryRaw<{ upcoming_reservations: number }[]>`
            SELECT COUNT(*) as upcoming_reservations
            FROM "Reservation"
            WHERE "clerkUserId" = ${clerk_user_id}
            AND "status" = 'CONFIRMED'
            AND (date || ' ' || time)::timestamp > NOW()
          `.then((r) => r[0]),

          // Get last order date
          prisma.order.findFirst({
            where: { clerkUserId: clerk_user_id },
            orderBy: { createdAt: "desc" },
            select: { createdAt: true },
          }),

          // Get last reservation date
          prisma.reservation.findFirst({
            where: { clerkUserId: clerk_user_id },
            orderBy: { createdAt: "desc" },
            select: { createdAt: true },
          }),
        ]);

        return {
          id: clerk_user_id,
          email: clerkUser.emailAddresses[0]?.emailAddress ?? "N/A",
          fullName: clerkUser.firstName
            ? `${clerkUser.firstName} ${clerkUser.lastName ?? ""}`
            : null,
          totalSpent: parseFloat(total_spent),
          totalOrders: total_orders,
          upcomingReservations: upcoming_reservations,
          lastOrderDate: lastOrder?.createdAt ?? null,
          lastReservationDate: lastReservation?.createdAt ?? null,
        };
      })
    );

    return { data: customersData };
  } catch (error) {
    console.error("Error fetching customers:", error);
    return { error: "Falha ao carregar dados dos clientes." };
  }
}
