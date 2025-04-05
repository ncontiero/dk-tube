"use client";

import { type ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/Sidebar";

export function Providers({ children }: { readonly children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(
    !pathname.startsWith("/watch"),
  );
  const [isMobile, setIsMobile] = useState(sidebarOpen ? undefined : true);

  useEffect(() => {
    setSidebarOpen(!pathname.startsWith("/watch"));
    setIsMobile(pathname.startsWith("/watch"));
  }, [pathname]);

  return (
    <SidebarProvider
      open={sidebarOpen}
      onOpenChange={setSidebarOpen}
      isMobileC={isMobile}
    >
      {children}
    </SidebarProvider>
  );
}
