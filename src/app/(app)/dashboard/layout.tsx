"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  CalendarRange,
  ChevronRight,
  LayoutGrid,
  ListOrdered,
  type LucideIcon,
  Tags,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type SidebarItem = {
  label: string;
  link: string;
  icon: LucideIcon;
};

type TSidebarGroup = {
  label: string;
  items: SidebarItem[];
};

const sidebarSchema: TSidebarGroup[] = [
  {
    label: "Gerenciamento",
    items: [
      {
        label: "Overview",
        link: "/dashboard",
        icon: LayoutGrid,
      },
      {
        label: "Categorias",
        link: "/dashboard/categories",
        icon: Tags,
      },
      {
        label: "Cardápio",
        link: "/dashboard/menu",
        icon: BookOpen,
      },
      {
        label: "Clientes",
        link: "/dashboard/customers",
        icon: Users,
      },
    ],
  },
  {
    label: "Operacional",
    items: [
      {
        label: "Pedidos",
        link: "/dashboard/orders",
        icon: ListOrdered,
      },
      {
        label: "Reservas",
        link: "/dashboard/reservations",
        icon: CalendarRange,
      },
    ],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentPath = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <SidebarProvider
      open
      defaultOpen
      className="flex gap-0"
      onOpenChange={setIsSidebarOpen}
    >
      <div
        className={cn(
          "fixed top-1/2 transition-all duration-150 -translate-y-1/2 left-4",
          isSidebarOpen ? "left-64" : "left-0"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <ChevronRight
            className={cn(
              "transition-all duration-150",
              isSidebarOpen ? "rotate-180" : "rotate-0"
            )}
          />
        </Button>
      </div>
      <Sidebar variant="floating" className="backdrop-brightness-200">
        <SidebarHeader className="pl-4">
          <Link href="/" className="font-serif text-2xl">
            Zedis
          </Link>
        </SidebarHeader>
        <SidebarContent>
          {sidebarSchema.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.link}>
                      <SidebarMenuButton
                        isActive={currentPath === item.link}
                        asChild
                      >
                        <Link href={item.link}>
                          <item.icon />
                          {item.label}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </Sidebar>

      <main
        className={cn(
          "flex-1 transition-all duration-300 px-8",
          isSidebarOpen && "ml-8"
        )}
      >
        {children}
      </main>
    </SidebarProvider>
  );
}
