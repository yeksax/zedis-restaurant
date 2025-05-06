import { z } from "zod";

export const createMenuItemSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
  price: z.coerce.number().min(0.01, "O preço deve ser maior que zero"),
  image: z.string().url("A URL da imagem é inválida"),
  available: z.boolean(),
  featured: z.boolean(),
  isSpicy: z.boolean(),
  isVegetarian: z.boolean(),
  isVegan: z.boolean(),
  glutenFree: z.boolean(),
  preparationTime: z.number().min(1, "O tempo de preparo deve ser maior que zero").optional(),
  ingredients: z.string().optional(),
  allergens: z.string().optional(),
  categoryId: z.string().min(1, "A categoria é obrigatória"),
  // Wine specific fields
  wineRegion: z.string().optional(),
  wineVintage: z.number().min(1900, "O ano deve ser maior que 1900").optional(),
  wineGrapes: z.string().optional(),
  // Cocktail specific fields
  baseSpirit: z.string().optional(),
  glassType: z.string().optional(),
}); 