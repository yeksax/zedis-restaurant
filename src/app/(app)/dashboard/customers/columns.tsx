"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";

export type Customer = {
  id: string;
  email: string;
  fullName: string | null;
  totalSpent: number;
  totalOrders: number;
  upcomingReservations: number;
  lastOrderDate: Date | null;
  lastReservationDate: Date | null;
};

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => {
      const fullName = row.getValue("fullName") as string | null;
      return fullName || "N/A";
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      );
    },
  },
  {
    accessorKey: "totalSpent",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm" 
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Gasto
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalSpent"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount);

      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "totalOrders",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Pedidos
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("totalOrders")}</div>;
    },
  },
  {
    accessorKey: "upcomingReservations",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Reservas Futuras
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const count = row.getValue("upcomingReservations") as number;
      return count > 0 ? (
        <Badge className="mx-auto" variant="secondary">
          {count}
        </Badge>
      ) : (
        <div className="text-center text-muted-foreground">-</div>
      );
    },
  },
  {
    accessorKey: "lastOrderDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Último Pedido
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("lastOrderDate") as Date | null;
      return date ? (
        <div className="text-center">{format(date, "dd/MM/yyyy")}</div>
      ) : (
        <div className="text-center">-</div>
      );
    },
  },
  {
    accessorKey: "lastReservationDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Última Reserva
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("lastReservationDate") as Date | null;
      return date ? (
        <div className="text-center">{format(date, "dd/MM/yyyy")}</div>
      ) : (
        <div className="text-center">-</div>
      );
    },
  },
];