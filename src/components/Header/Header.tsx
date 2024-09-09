import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilePlus, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { z } from "zod";
import { useSafePush } from "@/hooks/useSafePush";
import { Logo } from "../Logo";
import { SearchBar } from "./SearchBar";

const submitSearchFormSchema = z.object({
  query: z.string().min(1, "Digite um termo para buscar."),
});

type SubmitSearchFormData = z.infer<typeof submitSearchFormSchema>;

export function Header() {
  const { safePush } = useSafePush();
  const pathname = usePathname();
  const [hasSearchBar, setHasSearchBar] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubmitSearchFormData>({
    resolver: zodResolver(submitSearchFormSchema),
  });

  function submitSearch(data: SubmitSearchFormData) {
    try {
      safePush(`/search?query=${data.query}`);
    } catch (error) {
      console.error(error);
    } finally {
      setHasSearchBar(false);
    }
  }

  useEffect(() => {
    if (errors.query) {
      toast.error(errors.query.message);
    }
  }, [errors.query]);

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
        {!hasSearchBar && (
          <form
            className="flex size-full max-w-lg items-center md:flex-1"
            onSubmit={handleSubmit(submitSearch)}
          >
            <div className="hidden w-full rounded-3xl md:flex">
              <input
                type="text"
                placeholder="Buscar videos..."
                className="w-full rounded-l-3xl border border-foreground/20 bg-transparent px-3 py-2 outline-none duration-200 focus:border-ring"
                {...register("query")}
              />
              <button
                type="submit"
                className="rounded-r-3xl border-y border-r border-foreground/20 bg-foreground/10 px-2 outline-ring duration-200 hover:bg-foreground/20 sm:px-4 sm:py-2"
                title="Buscar"
                aria-label="Buscar"
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
            handleSubmit={handleSubmit}
            register={register}
            submitSearch={(data: SubmitSearchFormData) => submitSearch(data)}
          />
          <SignedOut>
            <Link
              href="/sign-in"
              className={`flex size-full items-center justify-center gap-2 rounded-full p-2 font-bold uppercase sm:w-auto sm:rounded-3xl sm:px-4 sm:py-2 ${
                pathname === "/sign-in" ? "text-primary/80" : "text-inherit"
              } ring-ring duration-200 hover:text-primary focus:text-primary focus:outline-none focus:ring-2 active:opacity-70`}
            >
              Login
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              href="/create-video"
              className="mr-5 rounded-full p-2 outline-none ring-ring duration-200 hover:bg-foreground/20 focus-visible:ring-2 active:bg-foreground/30"
            >
              <FilePlus />
            </Link>
            <UserButton userProfileMode="modal" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
