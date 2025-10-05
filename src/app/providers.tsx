"use client";

import { type ReactNode, useState } from "react";
import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/Sidebar";

export function Providers({ children }: { readonly children: ReactNode }) {
  const pathname = usePathname();
  const sidebarOpenInitial = !pathname.startsWith("/watch");
  const isMobile = pathname.startsWith("/watch");

  const [sidebarOpen, setSidebarOpen] = useState(sidebarOpenInitial);

  return (
    <ThemeProvider attribute="class">
      <SidebarProvider
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        isMobileC={isMobile}
      >
        {children}
      </SidebarProvider>
    </ThemeProvider>
  );
}
