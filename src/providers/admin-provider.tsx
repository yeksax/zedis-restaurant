"use client";

import { AdminPermission } from "@prisma/client";
import { createContext, useContext, useEffect, useState } from "react";

interface AdminProviderProps {
  children: React.ReactNode;
  adminPermission: AdminPermission | null;
}

const AdminContext = createContext<AdminPermission | null>(null);

export function AdminProvider({
  children,
  adminPermission: initialAdminPermission,
}: AdminProviderProps) {
  const [adminPermission, setAdminPermission] =
    useState<AdminPermission | null>(initialAdminPermission);

  useEffect(() => {
    setAdminPermission(initialAdminPermission);
  }, [initialAdminPermission]);

  return (
    <AdminContext.Provider value={adminPermission}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const adminPermission = useContext(AdminContext);
  if (!adminPermission) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return adminPermission;
}
