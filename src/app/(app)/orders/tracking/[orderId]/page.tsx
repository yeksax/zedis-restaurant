import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Clock, DollarSign, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prisma";

// Map status to human readable text and colors
const ORDER_STATUS_MAP = {
  CREATED: { label: "Pedido Criado", color: "bg-gray-500" },
  PAID: { label: "Pagamento Recebido", color: "bg-emerald-500" },
  PENDING: { label: "Pedido Recebido", color: "bg-yellow-500" },
  CONFIRMED: { label: "Pedido Confirmado", color: "bg-blue-500" },
  PREPARING: { label: "Preparando seu Pedido", color: "bg-purple-500" },
  READY: { label: "Pronto para Retirada/Entrega", color: "bg-green-500" },
  DELIVERED: { label: "Pedido Entregue", color: "bg-green-700" },
  CANCELLED: { label: "Pedido Cancelado", color: "bg-red-500" },
} as const;

const PAYMENT_STATUS_MAP = {
  PENDING: { label: "Pagamento Pendente", color: "bg-yellow-500" },
  PAID: { label: "Pago", color: "bg-green-500" },
  FAILED: { label: "Pagamento Falhou", color: "bg-red-500" },
  REFUNDED: { label: "Reembolsado", color: "bg-gray-500" },
} as const;

const ORDER_TYPE_MAP = {
  DELIVERY: "Entrega",
  PICKUP: "Retirada",
} as const;

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderTrackingPage({ params }: PageProps) {
  const { orderId } = await params;
  console.log(orderId);
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
      statusLogs: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  // Calculate estimated completion time (example: 30 mins for preparation)
  const estimatedCompletion = order.createdAt.getTime() + 30 * 60 * 1000;
  const isOverdue = Date.now() > estimatedCompletion;

  return (
    <div className="w-full px-8">
      {/* Order Summary Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Pedido #{order.id.slice(-8)}</span>
            <Badge 
              variant="secondary"
              className={`${ORDER_STATUS_MAP[order.status as keyof typeof ORDER_STATUS_MAP].color} text-white`}
            >
              {ORDER_STATUS_MAP[order.status as keyof typeof ORDER_STATUS_MAP].label}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Tipo do Pedido</span>
                <span className="font-medium">{ORDER_TYPE_MAP[order.type]}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Status do Pagamento</span>
                <Badge 
                  variant="secondary"
                  className={`${PAYMENT_STATUS_MAP[order.paymentStatus].color} text-white`}
                >
                  {PAYMENT_STATUS_MAP[order.paymentStatus].label}
                </Badge>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Valor Total</span>
                <span className="font-medium flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {order.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Estimated Time Section */}
            <div className="flex items-center gap-2 mt-4">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  {isOverdue ? (
                    <span className="text-red-500">Pedido está demorando mais que o esperado</span>
                  ) : (
                    <span>
                      Previsão de conclusão:{" "}
                      {format(estimatedCompletion, "H:mm")}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Order Items Summary */}
            <div className="mt-4">
              <h3 className="font-medium mb-2">Itens do Pedido</h3>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span>
                      {item.quantity}x {item.menuItem.name}
                    </span>
                    <span className="text-muted-foreground">
                      R$ {item.subtotal.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Linha do Tempo do Pedido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.statusLogs.map((log, index) => (
              <div key={log.id} className="relative">
                <div className="flex items-start gap-4">
                  <div className="min-w-3 mt-1">
                    <div className={`w-3 h-3 rounded-full ${ORDER_STATUS_MAP[log.status as keyof typeof ORDER_STATUS_MAP].color}`} />
                    {index !== order.statusLogs.length - 1 && (
                      <div className="w-0.5 h-full bg-border absolute left-1.5 top-4" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-medium">
                      {ORDER_STATUS_MAP[log.status as keyof typeof ORDER_STATUS_MAP].label}
                    </p>
                    {log.message && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {log.message}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(log.createdAt, "d 'de' MMM 'de' yyyy 'às' HH:mm")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 