import { MenuType } from "@prisma/client";
import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string().optional(),
  displayOrder: z.number().min(0, "A ordem de exibição deve ser maior ou igual a 0"),
  type: z.nativeEnum(MenuType, {
    errorMap: () => ({ message: "Selecione um tipo válido" })
  }),
});
