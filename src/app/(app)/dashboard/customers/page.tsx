import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCustomers } from "@/actions/customer-actions";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

export default async function CustomersPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const result = await getCustomers();

  return (
    <div className="px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-serif tracking-tight">Clientes</h1>
        <p className="text-muted-foreground mt-2">
          Visualize informações sobre os clientes do restaurante.
        </p>
      </div>

      {result.error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          {result.error}
        </div>
      ) : result.data?.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="font-semibold mb-1">Nenhum Cliente Encontrado</h3>
          <p className="text-muted-foreground text-sm">
            Não há clientes registrados no sistema ainda.
          </p>
        </div>
      ) : (
        <DataTable columns={columns} data={result.data ?? []} />
      )}
    </div>
  );
}
