import type { SearchResult } from "@/utils/types";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/axios";

import { PageError } from "@/components/PageError";
import { Meta } from "@/components/Meta";

export default function SearchPage() {
  const {
    query: { query },
  } = useRouter();

  const { data: searchResults, isFetching: isSearching } = useQuery<
    SearchResult[]
  >({
    queryKey: ["search", query],
    queryFn: async () => {
      const toastLoading = toast.loading("Buscando...");
      try {
        const { data } = await api.get("/search", {
          params: { search: query },
        });
        return data || [];
      } catch (error) {
        console.error(error);
        toast.dismiss(toastLoading);
        toast.error("Algo deu errado!");
        return [];
      } finally {
        toast.dismiss(toastLoading);
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  return isSearching && !searchResults ? (
    <div>Carregando...</div>
  ) : searchResults ? (
    <>
      <Meta
        path={`/search?query=${query?.toString() || ""}`}
        title={query?.toString() || ""}
      />
      <div className="mx-auto mb-10 flex max-w-5xl flex-col gap-4">
        <div className="mt-4 flex flex-col gap-4">
          {searchResults.map((result) => (
            <div key={result.id} className="relative flex items-start gap-4">
              <Link
                href={`/${
                  !result.user ? `channel/${result.id}` : `watch?v=${result.id}`
                }`}
                className="absolute z-[5] -m-1 h-[105%] w-[102%] rounded-xl outline-none duration-200 focus:bg-secondary"
              />
              <Link
                href={`/${
                  !result.user ? `channel/${result.id}` : `watch?v=${result.id}`
                }`}
                className="z-10 flex h-[180px] w-80 items-center justify-center rounded-lg outline-none ring-ring duration-200 focus:ring-2"
              >
                {result.user ? (
                  <Image
                    alt={result.label}
                    src={result.image}
                    width={320}
                    height={180}
                    className="aspect-video rounded-lg object-cover"
                  />
                ) : (
                  <Image
                    alt={result.label}
                    src={result.image}
                    width={136}
                    height={136}
                    className="aspect-square rounded-full object-cover"
                  />
                )}
              </Link>
              <div className={`${result.user ? "mt-2" : "mt-6"} flex flex-col`}>
                <Link
                  href={`/${
                    !result.user
                      ? `channel/${result.id}`
                      : `watch?v=${result.id}`
                  }`}
                  className="z-20 text-lg font-semibold text-foreground/80 outline-none ring-ring duration-200 hover:text-foreground focus:ring-2"
                >
                  {result.label}
                </Link>
                {result.user ? (
                  <div className="mt-3 flex items-center gap-2">
                    <Link
                      href={`/channel/${result.user.id}`}
                      className="z-10 rounded-full outline-none ring-ring duration-200 focus:ring-2"
                    >
                      <Image
                        alt={result.user.username}
                        src={result.user.image}
                        width={24}
                        height={24}
                        className="aspect-square rounded-full object-cover"
                      />
                    </Link>
                    <Link
                      href={`/channel/${result.user.id}`}
                      className="z-10 text-foreground/80 outline-none ring-ring duration-200 hover:text-foreground focus:ring-2"
                    >
                      {result.user.username}
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  ) : (
    <PageError title="Não foi possível encontrar resultados que você está procurando." />
  );
}
