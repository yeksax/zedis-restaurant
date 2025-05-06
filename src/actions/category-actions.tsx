"use server";

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import type { MenuType } from "@prisma/client";
import type { createCategorySchema } from "@/schemas/category-schemas";

export async function server_getCategories() {
  const categories = await prisma.category.findMany();
  return categories;
}

export async function server_createCategory(
  data: Schema<typeof createCategorySchema>
) {
  const category = await prisma.category.create({
    data: {
      ...data,
      slug: slugify(data.name),
    },
  });
}

export async function server_updateCategoryOrder(
  updates: { id: string; displayOrder: number }[]
) {
  const transaction = updates.map((update) =>
    prisma.category.update({
      where: { id: update.id },
      data: { displayOrder: update.displayOrder },
    })
  );

  await prisma.$transaction(transaction);
  return true;
}

export async function server_updateCategory(
  id: string,
  data: { name?: string; description?: string; type?: MenuType }
) {
  const category = await prisma.category.update({
    where: { id },
    data: {
      ...data,
      slug: data.name ? slugify(data.name) : undefined,
    },
  });
  return category;
}

export async function server_deleteCategory(id: string) {
  await prisma.category.delete({
    where: { id },
  });
  return true;
}

export async function server_getCategory(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
  });
  return category;
}
