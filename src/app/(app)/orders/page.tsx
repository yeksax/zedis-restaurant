import { format } from "date-fns";
import type { OrderStatus, OrderType, PaymentStatus } from "@prisma/client";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getOrders } from "@/actions/get-orders";
import type Decimal from "decimal.js";

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

const IN_PROGRESS_STATUSES = ["PENDING", "CONFIRMED", "PREPARING", "READY", "CREATED", "PAID"];

export default async function OrdersPage() {
  const orders = await getOrders();

  // Sort orders by creation date (newest first)
  const sortedOrders = [...orders].sort((a, b) => 
    b.createdAt.getTime() - a.createdAt.getTime()
  );

  // Separate in-progress and past orders
  const inProgressOrders = sortedOrders.filter(order => 
    IN_PROGRESS_STATUSES.includes(order.status)
  );
  const pastOrders = sortedOrders.filter(order => 
    !IN_PROGRESS_STATUSES.includes(order.status)
  );

  return (
    <div className="w-full px-8 pb-8 space-y-8">
      {inProgressOrders.length > 0 && (
        <div>
          <h2 className="text-2xl font-serif mb-6">Pedidos em Andamento</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-4">
            {inProgressOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-serif mb-6">Histórico de Pedidos</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-4">
          {pastOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order }: { 
  order: {
    id: string;
    createdAt: Date;
    status: OrderStatus;
    type: OrderType;
    paymentStatus: PaymentStatus;
    total: Decimal;
  }
}) {
  return (
    <Card className="py-2">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">Pedido #{order.id.slice(-8)}</p>
            <p className="text-sm text-muted-foreground">
              {format(order.createdAt, "dd/MM/yyyy HH:mm")}
            </p>
            <p className="font-medium mt-2">
              Total: R$ {Number(order.total).toFixed(2)}
            </p>
          </div>
          <Badge
            variant="secondary"
            className={`${ORDER_STATUS_MAP[order.status].color} text-white`}
          >
            {ORDER_STATUS_MAP[order.status].label}
          </Badge>
        </div>
        <div className="flex gap-2 mt-2">
          <Badge variant="outline">{ORDER_TYPE_MAP[order.type]}</Badge>
          <Badge
            variant="outline"
            className={`${PAYMENT_STATUS_MAP[order.paymentStatus].color} text-white`}
          >
            {PAYMENT_STATUS_MAP[order.paymentStatus].label}
          </Badge>
        </div>
      </CardHeader>
    </Card>
  );
}

