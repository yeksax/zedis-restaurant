"use client";

import { useQuery } from "@tanstack/react-query";
import { server_getCategories } from "@/actions/category-actions";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { CategoryIcon } from "./category-icon";
import { Skeleton } from "./ui/skeleton";

export function Navigation({ isAdmin }: { isAdmin: boolean }) {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: server_getCategories,
  });

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Faça sua Reserva</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 w-[400px]">
              <div className="grid gap-1">
                <NavigationMenuLink asChild>
                  <Link href="/reservations/new" className="group">
                    <div className="text-sm font-medium leading-none">
                      Nova Reserva
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Reserve uma mesa para sua ocasião especial
                    </p>
                  </Link>
                </NavigationMenuLink>
              </div>
              <div className="grid gap-1">
                <NavigationMenuLink asChild>
                  <Link href="/reservations/status" className="group">
                    <div className="text-sm font-medium leading-none">
                      Status da Reserva
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Acompanhe o status da sua reserva
                    </p>
                  </Link>
                </NavigationMenuLink>
              </div>
              <div className="grid gap-1">
                <NavigationMenuLink asChild>
                  <Link href="/reservations/events" className="group">
                    <div className="text-sm font-medium leading-none">
                      Eventos Especiais
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Conheça nossos eventos e jantares temáticos
                    </p>
                  </Link>
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Cardápio</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 w-[400px] md:w-[500px] lg:w-[700px]">
              {isLoading ? (
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-8 w-8" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-3 w-[150px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {categories?.map((category) => (
                    <div className="grid gap-1" key={category.id}>
                      <NavigationMenuLink
                        asChild
                        className="flex flex-row gap-3"
                      >
                        <Link href={`/menu/${category.slug}`} className="group">
                          <div className="p-1.5 box-content bg-muted rounded-md size-fit">
                            <CategoryIcon category={category} />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <div className="text-sm font-medium leading-none">
                              {category.name}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {category.description}
                            </p>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Delivery</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 w-[400px]">
              <div className="grid gap-1">
                <NavigationMenuLink asChild>
                  <Link href="/delivery/new-order" className="group">
                    <div className="text-sm font-medium leading-none">
                      Fazer Pedido
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Peça agora para delivery ou retirada
                    </p>
                  </Link>
                </NavigationMenuLink>
              </div>
              <div className="grid gap-1">
                <NavigationMenuLink asChild>
                  <Link href="/delivery/track-order" className="group">
                    <div className="text-sm font-medium leading-none">
                      Acompanhar Pedido
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Rastreie seu pedido em tempo real
                    </p>
                  </Link>
                </NavigationMenuLink>
              </div>
              <div className="grid gap-1">
                <NavigationMenuLink asChild>
                  <Link href="/delivery/previous-orders" className="group">
                    <div className="text-sm font-medium leading-none">
                      Pedidos Anteriores
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Veja seu histórico de pedidos
                    </p>
                  </Link>
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {isAdmin && (
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                href="/dashboard"
                className="bg-primary text-primary-foreground px-4"
              >
                Painel Administrativo
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
