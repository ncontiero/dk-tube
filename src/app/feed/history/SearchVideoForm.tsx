"use client";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Search } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useSearchParams } from "next/navigation";
import { searchVideoOnHistoryAction } from "@/actions/history";
import {
  type SearchVideoOnHistorySchema,
  searchVideoOnHistorySchema,
} from "@/actions/history/schema";

export function SearchVideoForm() {
  const searchQuery = useSearchParams().get("query");
  const form = useForm({
    resolver: zodResolver(searchVideoOnHistorySchema),
    defaultValues: { search: searchQuery || "" },
  });

  const searchVideoOnHistory = useAction(searchVideoOnHistoryAction, {
    onError: () => {
      toast.error("Erro ao buscar vídeos");
    },
  });

  function onSubmit(data: SearchVideoOnHistorySchema) {
    searchVideoOnHistory.execute(data);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="hidden lg:flex">
      <div className="border-foreground/40 flex items-center border-b-2 duration-200 focus-within:border-foreground">
        <button
          type="submit"
          title="Buscar"
          aria-label="Buscar"
          className="hover:bg-foreground/40 rounded-full p-2 duration-200"
          disabled={searchVideoOnHistory.status === "executing"}
        >
          {searchVideoOnHistory.status === "executing" ? (
            <Loader className="animate-spin" />
          ) : (
            <Search />
          )}
        </button>
        <input
          type="text"
          placeholder="Buscar videos..."
          className="bg-background outline-hidden"
          {...form.register("search")}
        />
      </div>
    </form>
  );
}
