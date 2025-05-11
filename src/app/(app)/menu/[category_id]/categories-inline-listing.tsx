"use client";

import { server_getCategories } from "@/actions/category-actions";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";

export function CategoriesInlineListing() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: server_getCategories,
  });

  const params = useParams();

  return (
    <div className="flex gap-2">
      {categories?.map((category) => (
        <Button
          variant={params.category_id === category.slug ? "secondary" : "outline"}
          asChild
          key={category.id}
        >
          <Link href={`/menu/${category.slug}`}>{category.name}</Link>
        </Button>
      ))}
    </div>
  );
}
