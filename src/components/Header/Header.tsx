import { usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "../Logo";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-[9999] flex h-14 items-center justify-between border-b border-zinc-300/10 bg-black/50 pl-4 pr-6 backdrop-blur-md">
      <Link
        href="/"
        title="Ir para o inicio"
        className="rounded-md px-3 py-4 ring-purple-400 duration-200 focus:outline-none focus:ring-2"
      >
        <Logo />
      </Link>
      <form className="w-1/4">
        <div className="flex rounded-3xl">
          <input
            type="text"
            placeholder="Buscar videos..."
            className="w-full rounded-l-3xl border border-zinc-500/50 bg-transparent px-3 py-2 outline-none duration-200 focus:border-purple-400"
          />
          <button
            type="button"
            className="rounded-r-3xl border-y border-r border-zinc-500/50 bg-white/10 p-2 px-4 outline-purple-400 duration-200 hover:bg-white/20"
          >
            🔎
          </button>
        </div>
      </form>
      <div className="flex items-end">
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
          <UserButton
            userProfileMode="modal"
            appearance={{
              elements: { card: "bg-zinc-900/70 backdrop-blur-xl" },
              userProfile: {
                elements: {
                  modalBackdrop: "bg-black/50 backdrop-blur-2xl max-h-screen",
                  modalContent: "m-0",
                  card: "bg-zinc-900/40 backdrop-blur-xl border border-zinc-700",
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
    </header>
  );
}
