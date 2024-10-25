import type { Metadata } from "next";
import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CardRoot, CardTitle } from "@/components/Card";
import { Separator } from "@/components/ui/Separator";
import { prisma } from "@/lib/prisma";

type SearchPageProps = {
  readonly searchParams: Promise<{ q: string | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const query = (await searchParams).q;
  if (!query) return notFound();

  return {
    title: query || "Nenhuma consulta de pesquisa",
  };
}

const getSearchResults = async (query: string) => {
  const dbChannels = await prisma.user.findMany({
    where: {
      username: {
        contains: query,
        mode: "insensitive",
      },
    },
  });
  const channels = dbChannels.map((channel) => ({
    id: channel.id,
    label: channel.username,
    image: channel.image,
    user: null,
  }));

  const dbVideos = await prisma.video.findMany({
    where: {
      title: {
        contains: query,
        mode: "insensitive",
      },
    },
    include: { user: true },
  });
  const videos = dbVideos.map((video) => ({
    id: video.id,
    label: video.title,
    image: video.thumb,
    user: video.user,
  }));

  const searchedItems = [...videos, ...channels];

  let maxLettersAppear = 0;
  const searchReturn = [];
  for (const item of searchedItems) {
    let lettersQuantity = 0;
    for (const letter of item.label.toLowerCase()) {
      for (const searchLetter of query.toLowerCase()) {
        if (letter === searchLetter) {
          lettersQuantity++;
        }
      }
    }
    if (lettersQuantity >= maxLettersAppear) {
      maxLettersAppear = lettersQuantity;
      searchReturn.unshift(item);
    } else {
      searchReturn.push(item);
    }
  }

  return searchReturn;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = (await searchParams).q;
  if (!query) return notFound();

  const searchResults = await getSearchResults(query);
  const createURL = (id: string, type: "channel" | "video") => {
    return type === "channel" ? `/channel/${id}` : `/watch?v=${id}`;
  };

  return (
    <div className="mx-auto mb-10 flex max-w-5xl flex-col gap-4 xs:my-10 xs:px-2">
      <div className="flex flex-col gap-4">
        {searchResults.map((result, i) => (
          <Fragment key={result.id}>
            {!result.user && i !== 0 && searchResults[i - 1]?.user ? (
              <Separator />
            ) : null}
            <CardRoot
              href={createURL(result.id, result.user ? "video" : "channel")}
              className={`gap-3 ${result.user ? "pb-4 xs:flex-row xs:pb-0" : "flex-row px-4 xs:px-0"}`}
            >
              <Link
                href={`/watch?v=${result.id}`}
                className={`relative z-10 w-full outline-none ring-ring duration-200 hover:opacity-90 focus-visible:ring-2 xs:max-w-[360px] ${result.user ? "xs:max-h-[230px]" : "flex w-[136px] justify-center rounded-full xs:max-h-[136px] xs:w-full"} xs:rounded-xl`}
              >
                <Image
                  src={result.image}
                  alt={result.label}
                  width={result.user ? 360 : 136}
                  height={result.user ? 230 : 136}
                  className={`object-cover ${result.user ? "aspect-video w-full xs:rounded-xl" : "aspect-square rounded-full"}`}
                />
              </Link>
              <div className="flex w-full flex-col px-2.5 xs:mt-0.5 xs:px-0.5">
                <Link
                  href={`/watch?v=${result.id}`}
                  title={result.label}
                  className="z-10 size-fit rounded-md ring-ring duration-200 hover:opacity-90 focus:outline-none focus-visible:ring-2"
                >
                  <CardTitle
                    className="max-h-max overflow-auto text-base xs:text-lg"
                    titleMaxChars={64}
                  >
                    {result.label}
                  </CardTitle>
                </Link>
                {result.user ? (
                  <Link
                    className="group z-10 mt-1 flex size-fit items-center gap-2 rounded-md outline-none ring-ring duration-200 focus:ring-2 xs:mt-3"
                    href={`/channel/${result.user.id}`}
                    title={result.user.username}
                  >
                    <Image
                      src={result.user.image}
                      alt={result.user.username}
                      width={28}
                      height={28}
                      className="aspect-square rounded-full object-cover"
                    />
                    <span className="text-sm opacity-60 duration-200 group-hover:opacity-100">
                      {result.user.username}
                    </span>
                  </Link>
                ) : null}
              </div>
            </CardRoot>
            {!result.user ? (
              <Separator
                className={`${!searchResults[i + 1]?.user ? "flex xs:hidden" : ""}`}
              />
            ) : null}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
