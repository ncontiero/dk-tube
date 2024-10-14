"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { Loader, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormState } from "@/hooks/useFormState";
import { type SearchDataKeys, searchAction } from "./searchAction";

export function SearchForm() {
  const router = useRouter();
  const searchQuery = useSearchParams().get("q");

  const [{ errors, message, success }, handleSubmit, isPending] =
    useFormState<SearchDataKeys>(searchAction, (_, data) => {
      if (!data) return;
      router.push(`/search?q=${data.search}`);
    });

  useEffect(() => {
    if (!success && message) {
      toast.error(message);
    }
    if (errors?.search) {
      errors.search.map((error) => toast.error(error));
    }
  }, [errors?.search, message, success]);

  return (
    <form
      className="flex size-full max-w-lg items-center md:flex-1"
      onSubmit={handleSubmit}
    >
      <div className="hidden w-full rounded-3xl md:flex">
        <input
          type="text"
          placeholder="Buscar videos..."
          name="search"
          className="w-full rounded-l-3xl border border-foreground/20 bg-transparent px-3 py-2 outline-none duration-200 focus:border-ring"
          defaultValue={searchQuery || ""}
        />
        <button
          type="submit"
          className="rounded-r-3xl border-y border-r border-foreground/20 bg-foreground/10 px-2 outline-ring duration-200 disabled:cursor-not-allowed disabled:opacity-70 sm:px-4 sm:py-2 [&:not(:disabled):hover]:bg-foreground/20"
          title="Buscar"
          aria-label="Buscar"
        >
          {isPending ? (
            <Loader className="mr-1 animate-spin" />
          ) : (
            <Search className="mr-1" />
          )}
        </button>
      </div>
    </form>
  );
}
