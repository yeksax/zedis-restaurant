"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/contexts/cart-context";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import Image from "next/image";

export function CartButton() {
  const { items, itemCount, updateQuantity, removeItem, clearCart } = useCart();

  const total = items.reduce(
    (acc, item) => acc + Number(item.item.price) * item.quantity,
    0
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <ShoppingCart className="size-5" />
          {itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Carrinho</SheetTitle>
        </SheetHeader>

        {itemCount === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <p className="text-muted-foreground">Seu carrinho está vazio</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-6 my-4 px-4">
              {items.map(({ item, quantity }) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative aspect-square h-16 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={item.image ?? "/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col flex-1 gap-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      R$ {Number(item.price).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-auto">
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => updateQuantity(item.id, quantity - 1)}
                      >
                        <Minus className="size-4" />
                      </Button>
                      <span className="w-4 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => updateQuantity(item.id, quantity + 1)}
                      >
                        <Plus className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 ml-auto"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <SheetFooter className="mt-auto">
              <div className="w-full space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-medium">
                    R$ {total.toFixed(2)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={clearCart}>
                    Limpar
                  </Button>
                  <Button>Finalizar Pedido</Button>
                </div>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
} 