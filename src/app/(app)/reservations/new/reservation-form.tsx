"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createReservationSchema,
  type CreateReservationInput,
} from "@/schemas/reservation-schemas";
import { createReservation } from "@/actions/reservation-actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Clock, Users } from "lucide-react";
import { usePostHog } from "posthog-js/react";

export function ReservationForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const posthog = usePostHog();

  const form = useForm<CreateReservationInput>({
    resolver: zodResolver(createReservationSchema),
    defaultValues: {
      date: "",
      time: "",
      numberOfGuests: 2,
      specialRequests: "",
    },
  });

  const onSubmit = async (data: CreateReservationInput) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await createReservation(data);

      if (result.error) {
        setError(result.error);
        return;
      }

      posthog.capture("reservation created", {
        reservationId: result.data?.id,
      });

      router.push("/reservations/status");
      router.refresh();
    } catch (error) {
      setError("Algo deu errado. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <FormControl>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="date"
                      className="pl-10"
                      {...field}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input type="time" className="pl-10" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="numberOfGuests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Convidados</FormLabel>
              <FormControl>
                <div className="relative">
                  <Users className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="number"
                    className="pl-10"
                    {...field}
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value);
                      if (value > 20) {
                        field.onChange(20);
                      } else if (value < 1) {
                        field.onChange(1);
                      } else {
                        field.onChange(value);
                      }
                    }}
                    min={1}
                    max={20}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Máximo de 20 convidados por reserva
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specialRequests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Solicitações Especiais</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Restrições alimentares, preferências de assento ou ocasiões especiais?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Opcional - Nos informe se você tem alguma necessidade especial
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="min-w-[200px]"
          >
            {isLoading ? "Fazendo Reserva..." : "Fazer Reserva"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
