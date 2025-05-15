// test
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReservationForm } from "./reservation-form";
import Image from "next/image";

export default async function NewReservationPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="px-8 flex gap-12 w-full justify-between">
      <div className="flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl font-serif">Fazer Reserva</h1>
          <p className="text-muted-foreground mt-2">
            Preencha o formulário abaixo para solicitar uma reserva em nosso
            restaurante.
          </p>
        </div>
        <div className="max-w-2xl">
          <ReservationForm />
        </div>
      </div>

      <Image
        src={
          "https://plus.unsplash.com/premium_photo-1675230239585-870fecf98db6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzZXJ2YXRpb258ZW58MHx8MHx8fDA%3D"
        }
        alt="Reserva"
        className="rounded-xl h-[calc(100vh-6rem)] brightness-75"
        width={500}
        height={500}
      />
    </div>
  );
}
