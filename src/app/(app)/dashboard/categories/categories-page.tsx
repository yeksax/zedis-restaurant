"use client";

import {
  server_deleteCategory,
  server_getCategories,
  server_updateCategory,
  server_updateCategoryOrder,
} from "@/actions/category-actions";
import { CreateCategoryDialog } from "@/components/categories/create-category-dialog";
import { CategoryIcon } from "@/components/category-icon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import type { Category, MenuType } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, GripVertical, Trash2, Utensils, X } from "lucide-react";
import { Reorder } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  categories: Category[];
}

export function CategoriesPage({ categories: initialCategories }: Props) {
  const queryClient = useQueryClient();
  const [items, setItems] = useState(initialCategories);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const [editedCategory, setEditedCategory] = useState<{
    name: string;
    description: string | null;
    type: MenuType;
  } | null>(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: server_getCategories,
    initialData: initialCategories,
  });

  useEffect(() => {
    setItems(categories || []);
  }, [categories]);

  const updateCategory = useMutation({
    mutationFn: (data: {
      id: string;
      name: string;
      description: string | null;
      type: MenuType;
    }) =>
      server_updateCategory(data.id, {
        name: data.name,
        description: data.description || undefined,
        type: data.type,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoria atualizada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar categoria. Tente novamente.");
    },
  });

  const updateOrder = useMutation({
    mutationFn: server_updateCategoryOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setHasChanges(false);
      toast.success("Ordem atualizada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar ordem. Tente novamente.");
    },
  });

  const deleteCategory = useMutation({
    mutationFn: server_deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setSelectedCategory(null);
      setEditedCategory(null);
      toast.success("Categoria excluída com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao excluir categoria. Tente novamente.");
    },
  });

  const handleReorder = (newOrder: Category[]) => {
    setItems(newOrder);
    setHasChanges(true);
  };

  const handleSave = () => {
    const updates = items.map((item, index) => ({
      id: item.id,
      displayOrder: index,
    }));
    updateOrder.mutate(updates);
  };

  const handleDiscard = () => {
    setItems(categories || []);
    setHasChanges(false);
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setEditedCategory({
      name: category.name,
      description: category.description,
      type: category.type,
    });
  };

  const handleSaveCategory = () => {
    if (!selectedCategory || !editedCategory) return;

    updateCategory.mutate({
      id: selectedCategory.id,
      name: editedCategory.name,
      description: editedCategory.description,
      type: editedCategory.type,
    });
  };

  const router = useRouter();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-serif flex gap-3 items-center">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ChevronLeft className="size-5 stroke-2" />
            </Button>
            Categorias
          </h1>
          <CreateCategoryDialog />
        </div>

        <Reorder.Group
          axis="y"
          values={items}
          onReorder={handleReorder}
          className="grid gap-4"
        >
          {items.map((category) => (
            <Reorder.Item
              key={category.id}
              value={category}
              className={`p-3 border rounded-xl bg-white flex gap-4 items-center transition-colors ${
                selectedCategory?.id === category.id
                  ? "border-primary"
                  : "hover:border-primary/20"
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              <div className="p-2.5 rounded-lg box-content bg-muted">
                <CategoryIcon
                  className="text-foreground/60"
                  category={category}
                />
              </div>
              <div className="flex flex-col gap-0.5 flex-1 self-start">
                <h3 className="font-medium">{category.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {category.description || "Sem descrição"}
                </p>
              </div>
              <GripVertical className="size-5 text-muted-foreground" />
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {hasChanges && (
          <div className="fixed bottom-4 right-4 flex gap-2">
            <Button
              variant="outline"
              onClick={handleDiscard}
              disabled={updateOrder.isPending}
            >
              Descartar
            </Button>
            <Button disabled={updateOrder.isPending} onClick={handleSave}>
              {updateOrder.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        )}
      </div>

      {selectedCategory ? (
        <div className="border rounded-xl p-6 h-fit sticky top-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif">Gerenciar Categoria</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedCategory(null);
                setEditedCategory(null);
              }}
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="flex flex-col gap-6">
            <div className="mx-auto p-4 rounded-xl bg-muted">
              <CategoryIcon
                className="text-foreground/60 size-12"
                categoryType={editedCategory?.type ?? selectedCategory.type}
              />
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="space-y-2 flex-1">
                  <Label className="text-sm font-medium">Nome</Label>
                  <Input
                    value={editedCategory?.name ?? selectedCategory.name}
                    onChange={(e) =>
                      setEditedCategory(
                        (prev) =>
                          prev && {
                            ...prev,
                            name: e.target.value,
                          }
                      )
                    }
                    placeholder="Nome da categoria"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tipo</Label>
                  <Select
                    value={editedCategory?.type ?? selectedCategory.type}
                    onValueChange={(value: MenuType) =>
                      setEditedCategory(
                        (prev) =>
                          prev && {
                            ...prev,
                            type: value,
                          }
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ENTREES">Entradas</SelectItem>
                      <SelectItem value="MAIN_COURSES">
                        Pratos Principais
                      </SelectItem>
                      <SelectItem value="SEAFOOD">Frutos do Mar</SelectItem>
                      <SelectItem value="WINE">Carta de Vinhos</SelectItem>
                      <SelectItem value="DESSERTS">Sobremesas</SelectItem>
                      <SelectItem value="COCKTAILS">
                        Drinks/Coquetéis
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Descrição</Label>
                <Textarea
                  value={
                    editedCategory?.description ??
                    selectedCategory.description ??
                    ""
                  }
                  onChange={(e) =>
                    setEditedCategory(
                      (prev) =>
                        prev && {
                          ...prev,
                          description: e.target.value || null,
                        }
                    )
                  }
                  placeholder="Descrição da categoria"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  size="sm"
                  onClick={handleSaveCategory}
                  disabled={
                    updateCategory.isPending ||
                    (!updateCategory.isPending &&
                      Object.keys(editedCategory ?? {}).every(
                        (key) =>
                          editedCategory?.[
                            key as keyof typeof editedCategory
                          ] ===
                          selectedCategory[key as keyof typeof selectedCategory]
                      ))
                  }
                >
                  {updateCategory.isPending
                    ? "Salvando..."
                    : "Salvar Alterações"}
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={deleteCategory.isPending}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir Categoria</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir a categoria "
                        {selectedCategory.name}"? Esta ação não pode ser
                        desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          deleteCategory.mutate(selectedCategory.id)
                        }
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {deleteCategory.isPending ? "Excluindo..." : "Excluir"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-xl p-6 h-fit sticky top-4">
          <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
            <div className="p-4 rounded-full bg-muted">
              <Utensils className="size-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-serif">Gerenciar Categorias</h2>
              <p className="text-sm text-muted-foreground">
                Selecione uma categoria ao lado para gerenciar seus detalhes
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
