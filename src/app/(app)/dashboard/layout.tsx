"use client";

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
    <SidebarProvider open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <Sidebar variant="floating">
        <SidebarHeader className="pl-4">
          <h2 className="font-serif text-2xl">Zedis</h2>
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

      <main className={cn("flex-1 transition-all duration-300 px-8 pt-4", isSidebarOpen && "ml-8")}>{children}</main>
    </SidebarProvider>
  );
}
