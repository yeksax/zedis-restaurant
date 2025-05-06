"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MenuType } from "@prisma/client";
import type { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCategorySchema } from "@/schemas/category-schemas";
import {
  server_createCategory,
  server_getCategories,
} from "@/actions/category-actions";
import { PlusIcon } from "lucide-react";
import { Textarea } from "../ui/textarea";

type FormData = z.infer<typeof createCategorySchema>;

export function CreateCategoryDialog() {
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: server_getCategories,
  });

  const maxDisplayOrder =
    categories?.reduce((max, category) => {
      return Math.max(max, category.displayOrder);
    }, 0) || -1;

  const form = useForm<Schema<typeof createCategorySchema>>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      displayOrder: maxDisplayOrder + 1,
      type: MenuType.ENTREES,
    },
  });

  const createCategory = useMutation({
    mutationFn: server_createCategory,
    onSuccess: () => {
      form.reset({
        displayOrder: maxDisplayOrder + 2,
      });
      toast.success("Categoria criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error("Erro ao criar categoria. Tente novamente.");
      console.error(error);
    },
  });

  async function onSubmit(data: FormData) {
    createCategory.mutate(data);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <PlusIcon className="size-4" />
          Nova categoria
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Categoria</DialogTitle>
          <DialogDescription>
            Crie uma nova categoria para o cardápio do restaurante.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Pratos Principais" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Pratos principais servidos no almoço e jantar"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Uma breve descrição da categoria (opcional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2 items-start flex-row-reverse">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={MenuType.ENTREES}>
                          Entradas
                        </SelectItem>
                        <SelectItem value={MenuType.MAIN_COURSES}>
                          Pratos Principais
                        </SelectItem>
                        <SelectItem value={MenuType.SEAFOOD}>
                          Frutos do Mar
                        </SelectItem>
                        <SelectItem value={MenuType.WINE}>
                          Carta de Vinhos
                        </SelectItem>
                        <SelectItem value={MenuType.DESSERTS}>
                          Sobremesas
                        </SelectItem>
                        <SelectItem value={MenuType.COCKTAILS}>
                          Drinks/Coquetéis
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="displayOrder"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Ordem de Exibição</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Ordem em que a categoria aparecerá no menu (0 = primeiro)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit" disabled={createCategory.isPending}>
                {createCategory.isPending ? "Criando..." : "Criar Categoria"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
