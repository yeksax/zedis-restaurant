import type { MenuType, Category } from "@prisma/client";
import { Dessert, Fish, HandPlatter, Martini, Salad, Wine } from "lucide-react";

const iconMap: Record<
  MenuType,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  COCKTAILS: Martini,
  DESSERTS: Dessert,
  ENTREES: Salad,
  MAIN_COURSES: HandPlatter,
  SEAFOOD: Fish,
  WINE: Wine,
};

interface Props extends React.HTMLAttributes<SVGElement> {
  category?: Category;
  categoryType?: MenuType;
}

export function CategoryIcon({ category, categoryType, ...props }: Props) {
  const type = category?.type || categoryType;

  if (!type) throw new Error("Tipo de categoria não fornecido");

  const Icon = iconMap[type];
  return <Icon {...props} />;
}
