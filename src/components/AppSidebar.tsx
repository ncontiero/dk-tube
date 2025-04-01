import { auth } from "@clerk/nextjs/server";
import {
  ChevronRight,
  CircleUser,
  Clock,
  Github,
  History,
  Home,
  ListVideo,
  LogIn,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { env } from "@/env";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "./ui/Sidebar";

// Menu items.
const items = [
  {
    label: "Você",
    icon: CircleUser,
    href: "/feed/you",
  },
  {
    label: "Histórico",
    icon: History,
    href: "/feed/history",
  },
];
const authItems = [
  { ...items[1]! },
  {
    label: "Playlists",
    icon: ListVideo,
    href: "/feed/playlists",
  },
  {
    label: "Assistir mais tarde",
    icon: Clock,
    href: "/playlist/WL",
  },
  {
    label: "Vídeos curtidos",
    icon: ThumbsUp,
    href: "/playlist/LL",
  },
];

export async function AppSidebar() {
  const { userId } = await auth();

  return (
    <Sidebar collapsible="icon" className="z-[99999]">
      <SidebarHeader>
        <SidebarRail />
        <SidebarMenu className="group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="group-data-[collapsible=icon]:mt-2.5"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                <div className="mt-1 group-data-[collapsible=icon]:size-full group-data-[collapsible=icon]:pl-1.5">
                  <SidebarTrigger />
                </div>
                <div className="grid flex-1 truncate text-left text-sm leading-tight">
                  <span className="rounded-md p-2 ring-ring duration-200 focus:outline-none focus:ring-2">
                    <Logo />
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Início" className="gap-4">
                  <Link href="/" className="flex items-center">
                    <Home />
                    <span className="mt-0.5">Início</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        {userId ? (
          <SidebarGroup>
            <SidebarGroupLabel
              className="h-9 duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground"
              asChild
            >
              <Link
                href="/feed/you"
                className="group-data-[collapsible=icon]:hidden"
              >
                <span>Você</span>
                <ChevronRight />
              </Link>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {authItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.label}
                      className="gap-4"
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          <>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {items.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.label}
                        className="gap-4"
                      >
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  <SidebarMenuItem className="px-2 group-data-[collapsible=icon]:hidden">
                    Faça login para curtir vídeos, comentar e se inscrever.
                  </SidebarMenuItem>
                  <SidebarMenuItem className="mt-1">
                    <SidebarMenuButton
                      asChild
                      tooltip="Fazer login"
                      className="gap-4"
                    >
                      <Link href="/sign-in">
                        <LogIn />
                        <span>Fazer login</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
        <SidebarSeparator />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="gap-4">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Github do projeto"
              className="gap-4"
            >
              <a
                href="https://github.com/ncontiero/dk-tube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github />
                Github do projeto
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="px-3.5 text-sm text-foreground/70 group-data-[collapsible=icon]:hidden">
            <span className="text-sm text-foreground/70">
              © {new Date().getFullYear()} {env.SITE_NAME}
            </span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
