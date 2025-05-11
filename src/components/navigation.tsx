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
import { usePostHog } from "posthog-js/react";
import { AdminPermission } from "@prisma/client";
import { LucideEye, LucidePencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { readAdminDisclaimer } from "@/actions/admin-management-actions";

export function Navigation({
  adminPermission,
}: {
  adminPermission: AdminPermission;
}) {
  const posthog = usePostHog();
  const [showExplanationDialog, setShowExplanationDialog] = useState(
    !adminPermission.readExplanation
  );

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: server_getCategories,
  });

  return (
    <>
      <Dialog
        open={showExplanationDialog}
        onOpenChange={setShowExplanationDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Acesso ao Painel Administrativo</DialogTitle>
            <DialogDescription className="space-y-2 pt-3">
              <p>
                Este é um projeto de demonstração onde você tem acesso ao painel
                administrativo, mas com algumas limitações:
              </p>
              <p>
                - Emails de usuários estão ocultos por padrão para proteger
                dados sensíveis
              </p>
              <p>
                - Apenas administradores com permissão total podem visualizar
                emails reais
              </p>
              <p>
                - Você pode navegar e explorar todas as funcionalidades, mas
                algumas ações estão restritas
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-2 justify-end">
            <Button
              onClick={async () => {
                setShowExplanationDialog(false);
                await readAdminDisclaimer();
              }}
            >
              Ok, entendi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <NavigationMenu>
        <NavigationMenuList className="gap-4">
          <NavigationMenuItem>
            <NavigationMenuTrigger>Faça sua Reserva</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-3 w-[400px]">
                <div className="grid gap-1">
                  <NavigationMenuLink asChild>
                    <Link
                      href="/reservations/new"
                      className="group"
                      onClick={() => {
                        posthog.capture("reservation clicked");
                      }}
                    >
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
                    <Link
                      href="/reservations/status"
                      className="group"
                      onClick={() => {
                        posthog.capture("reservation status clicked");
                      }}
                    >
                      <div className="text-sm font-medium leading-none">
                        Status da Reserva
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Acompanhe o status da sua reserva
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
                          onClick={() => {
                            posthog.capture("menu item clicked", {
                              category: category.name,
                            });
                          }}
                        >
                          <Link
                            href={`/menu/${category.slug}`}
                            className="group"
                          >
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
                    <Link
                      href={`/menu/${categories?.at(0)?.slug}`}
                      className="group"
                      onClick={() => {
                        posthog.capture("order clicked");
                      }}
                    >
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
                    <Link
                      href="/orders"
                      className="group"
                      onClick={() => {
                        posthog.capture("order history clicked");
                      }}
                    >
                      <div className="text-sm font-medium leading-none">
                        Pedidos Anteriores
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Acompanhe o andamento dos pedidos e veja seu histórico
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild className="h-8 px-3 group">
              <Link
                href="/dashboard"
                className="bg-primary text-primary-foreground flex gap-2 flex-row items-center"
                onClick={() => {
                  posthog.capture("admin dashboard clicked");
                }}
              >
                {adminPermission.isFullAdmin ? (
                  <>
                    <LucidePencil className="text-primary-foreground group-hover:text-foreground/80 group-focus:text-foreground/80 group-active:text-foreground/80" />
                    Painel Administrativo
                  </>
                ) : (
                  <>
                    <LucideEye className="text-primary-foreground group-hover:text-foreground/80 group-focus:text-foreground/80 group-active:text-foreground/80" />
                    Painel Administrativo
                  </>
                )}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
}
