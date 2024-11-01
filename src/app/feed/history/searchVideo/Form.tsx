"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { Loader, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormState } from "@/hooks/useFormState";
import { type SearchVideoDataKeys, searchAction } from "./action";

export function SearchVideoForm() {
  const router = useRouter();
  const searchQuery = useSearchParams().get("query");

  const [{ errors, message, success }, handleSubmit, isPending] =
    useFormState<SearchVideoDataKeys>(searchAction, (_, data) => {
      if (!data) return;
      router.push(`/feed/history?query=${data.search}`);
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
    <form onSubmit={handleSubmit} className="hidden lg:flex">
      <div className="flex items-center border-b-2 border-foreground/40 duration-200 focus-within:border-foreground">
        <button
          type="submit"
          title="Buscar"
          aria-label="Buscar"
          className="rounded-full p-2 duration-200 hover:bg-foreground/40"
        >
          {isPending ? <Loader className="animate-spin" /> : <Search />}
        </button>
        <input
          type="text"
          placeholder="Buscar videos..."
          className="bg-background outline-none"
          name="search"
          defaultValue={searchQuery || ""}
        />
      </div>
    </form>
  );
}
