"use client";

import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Clock, Users, XCircle } from "lucide-react";
import { updateReservationStatus } from "@/actions/reservation-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

type Reservation = {
  id: string;
  date: string;
  time: string;
  numberOfGuests: number;
  specialRequests?: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt: Date;
};

type ReservationListProps = {
  reservations: Reservation[];
};

const statusConfig = {
  PENDING: {
    label: "Pendente",
    variant: "secondary" as const,
  },
  CONFIRMED: {
    label: "Confirmada",
    variant: "default" as const,
  },
  CANCELLED: {
    label: "Cancelada",
    variant: "destructive" as const,
  },
};

export function ReservationList({ reservations }: ReservationListProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCancelReservation = async (id: string) => {
    try {
      setLoading(id);
      const result = await updateReservationStatus({ id, status: "CANCELLED" });
      
      if (result.error) {
        toast.error(result.error);
        return;
      }
      
      toast.success("Reserva cancelada com sucesso!");
    } catch (error) {
      toast.error("Erro ao cancelar reserva. Tente novamente.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {reservations.map((reservation) => (
        <Card key={reservation.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle>
                  Mesa para {reservation.numberOfGuests}
                </CardTitle>
                <CardDescription>
                  {format(new Date(reservation.createdAt), "PPp", { locale: ptBR })}
                </CardDescription>
              </div>
              <Badge variant={statusConfig[reservation.status].variant}>
                {statusConfig[reservation.status].label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <CalendarIcon className="mr-2 size-4 text-muted-foreground" />
                <span>
                  {format(new Date(reservation.date), "PPP", { locale: ptBR })}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="mr-2 size-4 text-muted-foreground" />
                <span>{reservation.time}</span>
              </div>
              <div className="flex items-center text-sm">
                <Users className="mr-2 size-4 text-muted-foreground" />
                <span>
                  {reservation.numberOfGuests} {reservation.numberOfGuests === 1 ? "pessoa" : "pessoas"}
                </span>
              </div>
              {reservation.specialRequests && (
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">Pedidos Especiais:</p>
                  <p>{reservation.specialRequests}</p>
                </div>
              )}
              {reservation.status === "PENDING" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={loading === reservation.id}
                    >
                      <XCircle className="mr-2 size-4" />
                      {loading === reservation.id ? "Cancelando..." : "Cancelar Reserva"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Cancelar Reserva
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Voltar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleCancelReservation(reservation.id)}
                      >
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 