"use server";

import { prisma } from "@/lib/prisma";
import type { createMenuItemSchema } from "@/schemas/menu-item-schemas";
import type { MenuItem } from "@prisma/client";

export type MenuItemWithCategory = Omit<MenuItem, "price"> & {
  price: string;
  category: {
    name: string;
    type: string;
  };
};

const ITEMS_PER_PAGE = 30;

export async function server_getMenuItems(cursor?: string) {
  try {
    const items = await prisma.menuItem.findMany({
      take: ITEMS_PER_PAGE,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: {
          select: {
            name: true,
            type: true,
          },
        },
      },
    });

    const nextCursor = items[ITEMS_PER_PAGE - 1]?.id;

    return {
      items: items.map((i) => ({ ...i, price: i.price.toString() })),
      nextCursor,
    };
  } catch (error) {
    console.error("Error fetching menu items:", error);
    throw new Error("Failed to fetch menu items");
  }
}

export async function server_updateMenuItem(
  id: string,
  data: Partial<MenuItem>
) {
  try {
    const item = await prisma.menuItem.update({
      where: { id },
      data,
      include: {
        category: {
          select: {
            name: true,
            type: true,
          },
        },
      },
    });
    return item;
  } catch (error) {
    console.error("Error updating menu item:", error);
    throw new Error("Failed to update menu item");
  }
}

export async function server_deleteMenuItem(id: string) {
  try {
    await prisma.menuItem.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    throw new Error("Failed to delete menu item");
  }
}

export async function server_createMenuItem(
  data: Schema<typeof createMenuItemSchema>
) {
  try {
    const item = await prisma.menuItem.create({
      data,
      include: {
        category: {
          select: {
            name: true,
            type: true,
          },
        },
      },
    });
    return item;
  } catch (error) {
    console.error("Error creating menu item:", error);
    throw new Error("Failed to create menu item");
  }
}

export async function server_getMenuItemsByCategory(slug: string) {
  const items = await prisma.menuItem.findMany({
    where: { category: { slug }, available: true },
  });
  return items;
}
