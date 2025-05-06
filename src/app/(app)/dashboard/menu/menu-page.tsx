"use client";

import {
  server_deleteMenuItem,
  server_getMenuItems,
  server_updateMenuItem,
  type MenuItemWithCategory,
} from "@/actions/menu-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ChevronLeft, Loader2, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Decimal from "decimal.js";
import { CreateMenuItemDialog } from "@/components/menu/create-menu-item-dialog";
import { server_getCategories } from "@/actions/category-actions";
import type { MenuItem } from "@prisma/client";

interface Props {
  initialItems: MenuItemWithCategory[];
  initialNextCursor: string | undefined;
}

export function MenuPage({ initialItems, initialNextCursor }: Props) {
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState<MenuItemWithCategory | null>(
    null
  );
  const [editedItem, setEditedItem] =
    useState<Partial<MenuItemWithCategory> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: server_getCategories,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["menu-items"],
      queryFn: async ({ pageParam }) => {
        const result = await server_getMenuItems(pageParam as string);
        return result;
      },
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: {
        pages: [{ items: initialItems, nextCursor: initialNextCursor }],
        pageParams: [null],
      },
    });

  const updateItem = useMutation({
    mutationFn: (data: {
      id: string;
      updates: Partial<MenuItemWithCategory>;
    }) => server_updateMenuItem(data.id, data.updates as Omit<MenuItem, "price">),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      toast.success("Item atualizado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar item. Tente novamente.");
    },
  });

  const deleteItem = useMutation({
    mutationFn: server_deleteMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      setSelectedItem(null);
      setEditedItem(null);
      toast.success("Item excluído com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao excluir item. Tente novamente.");
    },
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSaveItem = () => {
    if (!selectedItem || !editedItem) return;

    updateItem.mutate({
      id: selectedItem.id,
      updates: editedItem,
    });
  };

  const router = useRouter();

  const allItems = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-serif flex gap-3 items-center">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ChevronLeft className="size-5 stroke-2" />
            </Button>
            Cardápio
          </h1>
          <CreateMenuItemDialog />
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-4">
          {allItems.map((item) => (
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <div
              key={item.id}
              className={`rounded-xl border bg-white overflow-hidden transition-colors ${
                selectedItem?.id === item.id
                  ? "border-primary"
                  : "hover:border-primary/20"
              }`}
              onClick={() => {
                setSelectedItem(item);
                setEditedItem(item);
              }}
            >
              <div className="aspect-video relative">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {item.isSpicy && <Badge variant="secondary">Picante</Badge>}
                  {item.isVegetarian && (
                    <Badge variant="secondary">Vegetariano</Badge>
                  )}
                  {item.isVegan && <Badge variant="secondary">Vegano</Badge>}
                  {item.glutenFree && (
                    <Badge variant="secondary">Sem Glúten</Badge>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <Badge variant={item.available ? "default" : "secondary"}>
                    {item.available ? "Disponível" : "Indisponível"}
                  </Badge>
                  <span className="font-medium">
                    R$ {Number(item.price).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          ref={containerRef}
          className="h-20 flex items-center justify-center"
        >
          {isFetchingNextPage && (
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          )}
        </div>
      </div>

      {selectedItem && (
        <div className="w-[400px] border rounded-xl p-6 h-fit sticky top-16 max-h-[calc(100vh-6rem)] overflow-y-auto shrink-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif">Gerenciar Item</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedItem(null);
                setEditedItem(null);
              }}
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="space-y-6">
            <div className="aspect-video relative rounded-xl overflow-hidden">
              <Image
                src={selectedItem.image}
                alt={selectedItem.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  value={editedItem?.name ?? selectedItem.name}
                  onChange={(e) =>
                    setEditedItem((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={editedItem?.description ?? selectedItem.description}
                  onChange={(e) =>
                    setEditedItem((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Preço</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={
                    editedItem?.price?.toString() ??
                    selectedItem.price.toString()
                  }
                  onChange={(e) =>
                    setEditedItem((prev) => ({
                      ...prev,
                      price: new Decimal(e.target.value).toString(),
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select
                  value={editedItem?.categoryId ?? selectedItem.categoryId}
                  onValueChange={(value) =>
                    setEditedItem((prev) => ({
                      ...prev,
                      categoryId: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={editedItem?.isSpicy ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setEditedItem((prev) => ({
                        ...prev,
                        isSpicy: !(prev?.isSpicy ?? selectedItem.isSpicy),
                      }))
                    }
                  >
                    Picante
                  </Button>
                  <Button
                    variant={editedItem?.isVegetarian ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setEditedItem((prev) => ({
                        ...prev,
                        isVegetarian: !(
                          prev?.isVegetarian ?? selectedItem.isVegetarian
                        ),
                      }))
                    }
                  >
                    Vegetariano
                  </Button>
                  <Button
                    variant={editedItem?.isVegan ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setEditedItem((prev) => ({
                        ...prev,
                        isVegan: !(prev?.isVegan ?? selectedItem.isVegan),
                      }))
                    }
                  >
                    Vegano
                  </Button>
                  <Button
                    variant={editedItem?.glutenFree ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setEditedItem((prev) => ({
                        ...prev,
                        glutenFree: !(
                          prev?.glutenFree ?? selectedItem.glutenFree
                        ),
                      }))
                    }
                  >
                    Sem Glúten
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Disponibilidade</Label>
                <Button
                  variant={editedItem?.available ? "default" : "outline"}
                  className="w-full"
                  onClick={() =>
                    setEditedItem((prev) => ({
                      ...prev,
                      available: !(prev?.available ?? selectedItem.available),
                    }))
                  }
                >
                  {editedItem?.available ?? selectedItem.available
                    ? "Disponível"
                    : "Indisponível"}
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={handleSaveItem}
                  disabled={
                    updateItem.isPending ||
                    (!updateItem.isPending && !editedItem)
                  }
                >
                  {updateItem.isPending ? "Salvando..." : "Salvar Alterações"}
                </Button>

                <Button
                  variant="destructive"
                  size="icon"
                  disabled={deleteItem.isPending}
                  onClick={() => deleteItem.mutate(selectedItem.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
