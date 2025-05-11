import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { clerkClient, User } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { CalendarIcon, Clock, Users } from "lucide-react";

// Status mapping for visual representation
const RESERVATION_STATUS_MAP = {
  PENDING: { label: "Pendente", color: "bg-yellow-500" },
  CONFIRMED: { label: "Confirmada", color: "bg-green-500" },
  CANCELLED: { label: "Cancelada", color: "bg-red-500" },
} as const;

export async function getReservations() {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: {
        date: "desc",
      },
    });

    const userMap = new Map<string, User>();

    for (const reservation of reservations) {
      if (!userMap.has(reservation.clerkUserId)) {
        const user = await (
          await clerkClient()
        ).users.getUser(reservation.clerkUserId);
        userMap.set(reservation.clerkUserId, user);
      }
    }

    return reservations.map((reservation) => ({
      ...reservation,
      user: userMap.get(reservation.clerkUserId),
    }));
  } catch (error) {
    console.error("Failed to fetch reservations:", error);
    return [];
  }
}

export default async function ReservationsPage() {
  const reservations = await getReservations();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-serif">Reservas</h1>
          <p className="text-muted-foreground mt-2">
            Visualize todas as reservas do restaurante.
          </p>
        </div>
      </div>

      {reservations.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="font-semibold mb-1">Nenhuma Reserva Encontrada</h3>
          <p className="text-muted-foreground text-sm">
            Não há reservas registradas no sistema.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-4">
          {reservations.map((reservation) => (
            <Card key={reservation.id} className="py-2">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      Reserva #{reservation.id.substring(0, 8)}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <CalendarIcon className="size-4" />
                      {format(new Date(reservation.date), "dd/MM/yyyy")}
                      <Clock className="size-4 ml-2" />
                      {reservation.time}
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`${
                      RESERVATION_STATUS_MAP[reservation.status].color
                    } text-white`}
                  >
                    {RESERVATION_STATUS_MAP[reservation.status].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="size-4" />
                    <span>{reservation.numberOfGuests} pessoas</span>
                  </div>
                  {reservation.specialRequests && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Pedidos Especiais:</span>{" "}
                      {reservation.specialRequests}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <span className="font-medium">Cliente:</span>{" "}
                    {reservation.user?.fullName}
                    <Badge variant="secondary" className="ml-2">
                      {reservation.user?.emailAddresses[0].emailAddress}
                    </Badge>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Criada em:</span>{" "}
                    {format(reservation.createdAt, "dd/MM/yyyy HH:mm")}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
