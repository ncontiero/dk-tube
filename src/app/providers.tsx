"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/Sidebar";

export function Providers({ children }: { readonly children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(
    !pathname.startsWith("/watch"),
  );
  const [isMobile, setIsMobile] = useState(sidebarOpen ? undefined : true);
  const queryClient = useMemo(() => new QueryClient(), []);

  useEffect(() => {
    setSidebarOpen(!pathname.startsWith("/watch"));
    setIsMobile(pathname.startsWith("/watch"));
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        isMobileC={isMobile}
      >
        {children}
      </SidebarProvider>
    </QueryClientProvider>
  );
}
