"use client";

import { format } from "date-fns";
import type {
  MenuItem,
  Order,
  OrderItem,
  OrderStatus,
  OrderStatusLog,
  OrderType,
  PaymentStatus,
} from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { updateOrderStatus } from "@/actions/update-order-status";
import { useRouter, useSearchParams } from "next/navigation";
import { X, PlusIcon } from "lucide-react";
import { getOrders } from "./page";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Status mapping for visual representation
const ORDER_STATUS_MAP = {
  CREATED: { label: "Pedido Criado", color: "bg-gray-500" },
  PAID: { label: "Pagamento Recebido", color: "bg-emerald-500" },
  PENDING: { label: "Pedido Recebido", color: "bg-yellow-500" },
  CONFIRMED: { label: "Pedido Confirmado", color: "bg-emerald-500" },
  PREPARING: { label: "Preparando", color: "bg-purple-500" },
  READY: { label: "Pronto", color: "bg-green-500" },
  DELIVERED: { label: "Entregue", color: "bg-green-700" },
  CANCELLED: { label: "Cancelado", color: "bg-red-500" },
} as const;

// Define the order status progression
const ORDER_STATUS_PROGRESSION: { [key in OrderStatus]?: OrderStatus[] } = {
  CREATED: ["PAID", "CANCELLED"],
  PAID: ["PENDING", "CANCELLED"],
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY", "CANCELLED"],
  READY: ["DELIVERED", "CANCELLED"],
  DELIVERED: [], // Terminal state
  CANCELLED: [], // Terminal state
} as const;

// Helper function to get the next available statuses
function getNextOrderStatuses(currentStatus: OrderStatus): OrderStatus[] {
  return ORDER_STATUS_PROGRESSION[currentStatus] || [];
}

const ORDER_TYPE_MAP = {
  DELIVERY: "Entrega",
  PICKUP: "Retirada",
} as const;

const PAYMENT_STATUS_MAP = {
  PENDING: { label: "Pendente", color: "bg-yellow-500" },
  PAID: { label: "Pago", color: "bg-green-500" },
  FAILED: { label: "Falhou", color: "bg-red-500" },
  REFUNDED: { label: "Reembolsado", color: "bg-gray-500" },
} as const;

interface Props {
  orders: Action<typeof getOrders>;
}

export function OrdersPage({ orders }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedOrderId = parseInt(searchParams.get("orderId") || "0");
  const selectedOrder = orders.find((order) => order.id === selectedOrderId);

  return (
    <div className="grid grid-cols-[1.5fr_1fr] gap-6">
      <div className={cn("flex-1", orders.length === 0 && "col-span-2")}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-serif">Pedidos</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie os pedidos e atualize seus status.
            </p>
          </div>
          <Button asChild>
            <Link href="/menu">
              <PlusIcon className="size-4 mr-2" />
              Novo Pedido
            </Link>
          </Button>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <h3 className="font-semibold mb-1">Nenhum Pedido Encontrado</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Não há pedidos registrados no sistema.
            </p>
            <Button asChild variant="outline">
              <Link href="/menu">
                <PlusIcon className="size-4 mr-2" />
                Fazer Pedido
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-4">
            {orders.map((order) => (
              <Card
                key={order.id}
                className={`cursor-pointer transition-colors hover:border-primary/20 py-2 ${
                  selectedOrder?.id === order.id ? "border-primary" : ""
                }`}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set("orderId", order.id.toString());
                  router.push(`?${params.toString()}`);
                }}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        Pedido #{order.id.toString().padStart(8, "0")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(order.createdAt, "dd/MM/yyyy HH:mm")}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`${
                        ORDER_STATUS_MAP[order.status].color
                      } text-white`}
                    >
                      {ORDER_STATUS_MAP[order.status].label}
                    </Badge>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{ORDER_TYPE_MAP[order.type]}</Badge>
                    <Badge
                      variant="outline"
                      className={`${
                        PAYMENT_STATUS_MAP[order.paymentStatus].color
                      } text-white`}
                    >
                      {PAYMENT_STATUS_MAP[order.paymentStatus].label}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="w-full border rounded-xl p-6 h-fit sticky top-16 max-h-[calc(100vh-8rem)] overflow-y-auto shrink-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif">Detalhes do Pedido</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.delete("orderId");
                router.push(`?${params.toString()}`);
              }}
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">
                  Pedido #{selectedOrder.id.toString().padStart(8, "0")}
                </h3>
                <p className="text-muted-foreground">
                  {format(selectedOrder.createdAt, "dd/MM/yyyy HH:mm")}
                </p>
              </div>
              <Badge
                variant="secondary"
                className={`${
                  ORDER_STATUS_MAP[selectedOrder.status].color
                } text-white`}
              >
                {ORDER_STATUS_MAP[selectedOrder.status].label}
              </Badge>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Telefone:</span>{" "}
                    {selectedOrder.phoneNumber}
                  </p>
                  {selectedOrder.address && (
                    <p>
                      <span className="font-medium">Endereço:</span>{" "}
                      {selectedOrder.address}
                    </p>
                  )}
                  {selectedOrder.specialInstructions && (
                    <p>
                      <span className="font-medium">Instruções Especiais:</span>{" "}
                      {selectedOrder.specialInstructions}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Itens do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{item.menuItem.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantidade: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        R$ {Number(item.subtotal).toFixed(2)}
                      </p>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center">
                    <p className="font-medium">Total</p>
                    <p className="font-medium">
                      R$ {Number(selectedOrder.total).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Histórico de Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedOrder.statusLogs.map((log, index) => (
                    <div key={log.id} className="relative">
                      <div className="flex items-start gap-4">
                        <div className="min-w-3 mt-1">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              ORDER_STATUS_MAP[log.status].color
                            }`}
                          />
                          {index !== selectedOrder.statusLogs.length - 1 && (
                            <div className="w-0.5 h-full bg-border absolute left-1.5 top-4" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="font-medium">
                            {ORDER_STATUS_MAP[log.status].label}
                          </p>
                          {log.message && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {log.message}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground mt-1">
                            {format(log.createdAt, "dd/MM/yyyy HH:mm")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Atualizar Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap flex-row-reverse gap-2">
                  {getNextOrderStatuses(selectedOrder.status).map((status) => (
                    <Button
                      type="submit"
                      key={status}
                      variant="default"
                      className={ORDER_STATUS_MAP[status].color}
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, status);
                      }}
                    >
                      {ORDER_STATUS_MAP[status].label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
