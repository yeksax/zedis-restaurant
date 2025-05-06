import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getReservations } from "@/actions/reservation-actions";
import { ReservationList } from "./reservation-list";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function ReservationStatusPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const result = await getReservations();

  return (
    <div className="px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif tracking-tight">
            Minhas Reservas
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie suas reservas e acompanhe o status.
          </p>
        </div>
        <Button asChild>
          <Link href="/reservations/new">
            <PlusIcon className="size-4 mr-2" />
            Nova Reserva
          </Link>
        </Button>
      </div>

      {result.error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          {result.error}
        </div>
      ) : result.data?.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="font-semibold mb-1">Nenhuma Reserva Encontrada</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Você ainda não fez nenhuma reserva. Que tal reservar uma mesa agora?
          </p>
          <Button asChild variant="outline">
            <Link href="/reservations/new">
              <PlusIcon className="size-4 mr-2" />
              Fazer Reserva
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <ReservationList
            reservations={
              result.data?.map((reservation) => ({
                ...reservation,
                specialRequests: reservation.specialRequests ?? undefined,
              })) ?? []
            }
          />
        </div>
      )}
    </div>
  );
}
