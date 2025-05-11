"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import type { Order, OrderItem, OrderStatus } from "@prisma/client";
import {
  HandPlatter,
  LucideChartLine,
  LucideCreditCard,
  LucideShoppingBag,
  LucideTable,
} from "lucide-react";
import { Area, AreaChart, XAxis } from "recharts";

const chartConfig = {
  revenue: {
    label: "Receita",
    theme: {
      light: "hsl(var(--primary))",
      dark: "hsl(var(--primary))",
    },
  },
};

interface DashboardContentProps {
  revenueData: Array<{ month: string; revenue: number }>;
  totalRevenue: number;
  revenueIncrease: number;
  totalOrders: number;
  ordersIncrease: number;
  activeTables: number;
  activeTablesChange: number;
  pendingOrders: number;
  orders: (Order & { items: OrderItem[] })[];
}

export function DashboardContent({
  revenueData,
  totalRevenue,
  revenueIncrease,
  totalOrders,
  orders,
  ordersIncrease,
  activeTables,
  activeTablesChange,
  pendingOrders,
}: DashboardContentProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Top row with summary cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LucideCreditCard />
              Receita Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {totalRevenue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {revenueIncrease >= 0 ? "+" : ""}
              {revenueIncrease}% desde o mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LucideShoppingBag />
              Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {ordersIncrease >= 0 ? "+" : ""}
              {ordersIncrease}% desde o mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <HandPlatter />
              Mesas Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTables}</div>
            <p className="text-xs text-muted-foreground">
              {activeTablesChange >= 0 ? "+" : ""}
              {activeTablesChange} da última hora
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LucideShoppingBag />
              Pedidos Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Processando agora</p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row with chart and recent orders */}
      <div className="grid grid-cols-3 gap-4">
        {/* Chart section - 2 columns */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>
              <LucideChartLine />
              Receita ao longo do tempo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]" config={chartConfig}>
              <AreaChart data={revenueData}>
                <XAxis dataKey="month" />
                <ChartTooltip
                  content={({ active, payload }) => (
                    <ChartTooltipContent
                      active={active}
                      payload={payload}
                      labelFormatter={(label) => `${label}`}
                    />
                  )}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary)/.2)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recent orders section - 1 column */}
        <Card>
          <CardHeader>
            <CardTitle className="[&_svg]:p-1.5">
              <LucideShoppingBag />
              Pedidos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">
                      #{order.id.toString().padStart(8, "0")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.items.length} itens • ${order.total.toString()}
                    </p>
                  </div>
                  <div
                    className={cn("text-xs px-2 py-1 rounded", {
                      "bg-yellow-100 text-yellow-800":
                        order.status === "PENDING",
                      "bg-blue-100 text-blue-800": order.status === "PREPARING",
                      "bg-green-100 text-green-800": order.status === "READY",
                      "bg-purple-100 text-purple-800":
                        order.status === "CONFIRMED",
                      "bg-emerald-100 text-emerald-800":
                        order.status === "DELIVERED",
                      "bg-red-100 text-red-800": order.status === "CANCELLED",
                      "bg-gray-100 text-gray-800": order.status === "CREATED",
                      "bg-indigo-100 text-indigo-800": order.status === "PAID",
                    })}
                  >
                    {(() => {
                      const statusMap: Record<OrderStatus, string> = {
                        PENDING: "Pendente",
                        PREPARING: "Preparando",
                        READY: "Pronto",
                        CONFIRMED: "Confirmado",
                        DELIVERED: "Entregue",
                        CANCELLED: "Cancelado",
                        CREATED: "Criado",
                        PAID: "Pago",
                      };
                      return statusMap[order.status] || order.status;
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
