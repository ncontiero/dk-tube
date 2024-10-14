import { SignedIn, SignedOut } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { FilePlus } from "lucide-react";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Logo } from "../Logo";
import { SearchForm } from "./SearchForm";
import { UserButton } from "./UserButton";

const getChannel = unstable_cache(
  async (externalId: string) => {
    return await prisma.user.findUnique({
      where: { externalId },
    });
  },
  ["my-channel"],
  { tags: ["my-channel"] },
);

export async function Header() {
  const user = await currentUser();
  const channel = user?.id ? await getChannel(user.id) : null;

  return (
    <header className="fixed top-0 z-[9999] flex h-14 w-full items-center border-b bg-secondary/60 pl-2 pr-3 backdrop-blur-md sm:h-16 sm:pl-4 sm:pr-6">
      <div className="flex size-full items-center justify-between gap-2">
        <Link
          href="/"
          title="Ir para o inicio"
          className="rounded-md py-2 pl-1 ring-ring duration-200 focus:outline-none focus:ring-2 sm:px-3 sm:py-4"
        >
          <Logo />
        </Link>
        <SearchForm />
        <div className="flex items-center gap-2 md:gap-4">
          <SignedOut>
            <Link
              href="/sign-in"
              className="flex size-full items-center justify-center gap-2 rounded-full p-2 font-bold uppercase ring-ring duration-200 hover:text-primary focus:text-primary focus:outline-none focus:ring-2 active:opacity-70 sm:w-auto sm:rounded-3xl sm:px-4 sm:py-2"
            >
              Login
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              href="/create-video"
              title="Criar vídeo"
              className="rounded-full p-2 outline-none ring-ring duration-200 hover:bg-foreground/20 focus-visible:ring-2 active:bg-foreground/30"
            >
              <FilePlus />
            </Link>
            <UserButton channelId={channel?.id || null} />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
