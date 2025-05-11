import { server_getCategory } from "@/actions/category-actions";
import { server_getMenuItemsByCategory } from "@/actions/menu-actions";
import { AddToCartButton } from "@/components/menu/add-to-cart-button";
import { MenuFilters } from "@/components/menu/menu-filters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CategoriesInlineListing } from "./categories-inline-listing";

interface Props {
  params: Promise<{ category_id: string }>;
  searchParams: Promise<{ q?: string; sort?: string }>;
}

export default async function MenuCategoryPage({
  params,
  searchParams,
}: Props) {
  const { category_id } = await params;
  const { q, sort } = await searchParams;

  const category = await server_getCategory(category_id);
  let items = await server_getMenuItemsByCategory(category_id);

  if (q) {
    const searchTerm = q.toLowerCase();
    items = items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm)
    );
  }

  if (sort) {
    items = [...items].sort((a, b) => {
      switch (sort) {
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "price_asc":
          return Number(a.price) - Number(b.price);
        case "price_desc":
          return Number(b.price) - Number(a.price);
        default:
          return 0;
      }
    });
  }

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h1 className="text-2xl font-serif">Categoria não encontrada</h1>
        <Button asChild>
          <Link href="/menu">Voltar ao Menu</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-8 pb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif flex gap-3 items-center">
          <Button asChild variant="outline" size="icon">
            <Link href="/menu">
              <ChevronLeft className="size-5 stroke-2" />
            </Link>
          </Button>
          {category.name}
        </h1>

        <MenuFilters />
      </div>

      <CategoriesInlineListing />

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <p className="text-muted-foreground">
            {q
              ? "Nenhum item encontrado para esta pesquisa."
              : "Nenhum item disponível nesta categoria no momento."}
          </p>
          <Button asChild variant="outline">
            <Link href="/menu">Ver outras categorias</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border bg-white overflow-hidden hover:border-primary/20 transition-colors"
            >
              <div className="aspect-video relative bg-muted">
                <Image
                  src={item.image ?? "/placeholder.png"}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                  <AddToCartButton item={item} />
                  <span className="font-medium">
                    R$ {Number(item.price).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
