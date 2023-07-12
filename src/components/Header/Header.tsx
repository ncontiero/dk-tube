import { useState } from "react";
import { usePathname } from "next/navigation";

import Link from "next/link";
import { Logo } from "../Logo";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { SearchBar } from "./SearchBar";

import { FilePlus, Search } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [hasSearchBar, setHasSearchBar] = useState(false);

  return (
    <header className="fixed top-0 z-[9999] flex h-14 w-full items-center border-b border-zinc-300/10 bg-zinc-700/20 pl-2 pr-3 backdrop-blur-md sm:h-16 sm:pl-4 sm:pr-6">
      <div className="flex h-full w-full items-center justify-between gap-2">
        <Link
          href="/"
          title="Ir para o inicio"
          className="rounded-md py-2 pl-1 ring-purple-400 duration-200 focus:outline-none focus:ring-2 sm:px-3 sm:py-4"
        >
          <Logo />
        </Link>
        {!hasSearchBar && (
          <form className="flex h-full w-full max-w-lg items-center md:flex-1">
            <div className="hidden w-full rounded-3xl md:flex">
              <input
                type="text"
                placeholder="Buscar videos..."
                className="w-full rounded-l-3xl border border-zinc-500/50 bg-transparent px-3 py-2 outline-none duration-200 focus:border-purple-400"
              />
              <button
                type="button"
                className="rounded-r-3xl border-y border-r border-zinc-500/50 bg-white/10 px-2 outline-purple-400 duration-200 hover:bg-white/20 sm:px-4 sm:py-2"
              >
                <Search className="mr-1" />
              </button>
            </div>
          </form>
        )}
        <div className="flex items-center gap-4 md:gap-0">
          <SearchBar
            hasSearchBar={hasSearchBar}
            setHasSearchBar={setHasSearchBar}
          />
          <SignedOut>
            <Link
              href="/sign-in"
              className={`flex h-full w-full items-center justify-center gap-2 rounded-full p-2 font-bold uppercase sm:w-auto sm:rounded-3xl sm:px-4 sm:py-2 ${
                pathname === "/sign-in" ? "text-purple-600" : "text-inherit"
              } ring-purple-400 duration-200 hover:text-purple-400 focus:text-purple-400 focus:outline-none focus:ring-2 active:opacity-70`}
            >
              Login
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              href="/create-video"
              className="mr-5 rounded-full p-2 outline-none ring-purple-400 duration-200 hover:bg-zinc-800 focus:bg-zinc-600 focus:ring-2"
            >
              <FilePlus />
            </Link>
            <UserButton
              afterSignOutUrl="/"
              userProfileMode="modal"
              appearance={{
                elements: { card: "bg-zinc-900/70 backdrop-blur-xl" },
                userProfile: {
                  elements: {
                    modalBackdrop:
                      "bg-black/50 backdrop-blur-2xl w-[101vw] h-[101vh] inset-0 overflow-hidden",
                    modalContent: "h-[101vh] w-[101vw] inset-0",
                    rootBox: "w-[101vw] h-[101vh] inset-0",
                    card: "bg-zinc-900/40 inset-0 w-full max-w-none backdrop-blur-xl rounded-none border border-zinc-700 xl:max-w-[60%] xl:m-auto xl:inset-auto",
                    scrollBox: "inset-0 rounded-none",
                    pageScrollBox: "inset-0",
                    profileSectionPrimaryButton:
                      "hover:bg-violet-600/10 duration-300",
                    accordionTriggerButton: "hover:bg-gray-600/10 duration-300",
                    formButtonReset: "hover:bg-violet-600/20 duration-300",
                    fileDropAreaButtonPrimary:
                      "hover:bg-violet-600/20 duration-300",
                  },
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
