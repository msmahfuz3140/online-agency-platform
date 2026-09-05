"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface AdminLayoutContextType {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggleMobile: () => void;
  closeMobile: () => void;
}

const AdminLayoutContext = createContext<AdminLayoutContextType>({
  mobileOpen: false,
  setMobileOpen: () => {},
  toggleMobile: () => {},
  closeMobile: () => {},
});

export function AdminLayoutProvider({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return (
    <AdminLayoutContext.Provider
      value={{
        mobileOpen,
        setMobileOpen,
        toggleMobile,
        closeMobile,
      }}
    >
      {children}
    </AdminLayoutContext.Provider>
  );
}

export function useAdminLayout() {
  return useContext(AdminLayoutContext);
}
