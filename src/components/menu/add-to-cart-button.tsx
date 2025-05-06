"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import type { MenuItem } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  item: MenuItem;
}

export function AddToCartButton({ item }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { addItem, items, removeItem } = useCart();

  const isItemInCart = items.some((cartItem) => cartItem.item.id === item.id);

  const handleAddToCart = async () => {
    setIsLoading(true);
    addItem(item);
    toast.success(`${item.name} adicionado ao carrinho!`);
    setIsLoading(false);
  };

  return (
    <Button
      size="sm"
      variant={isItemInCart ? "outline" : "default"}
      onClick={isItemInCart ? () => removeItem(item.id) : handleAddToCart}
      disabled={isLoading}
    >
      {isLoading ? "Adicionando..." : isItemInCart ? "Remover" : "Adicionar"}
    </Button>
  );
}
