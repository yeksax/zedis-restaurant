import { z } from "zod";

export const createReservationSchema = z.object({
  date: z.string(),
  time: z.string(),
  numberOfGuests: z.number().min(1).max(20),
  specialRequests: z.string().optional(),
});

export const updateReservationStatusSchema = z.object({
  id: z.string(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
export type UpdateReservationStatusInput = z.infer<typeof updateReservationStatusSchema>;
