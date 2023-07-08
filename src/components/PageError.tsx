import { SITE_NAME } from "@/utils/constants";

import Head from "next/head";
import Link from "next/link";

interface PageErrorProps {
  title?: string;
}

export function PageError({
  title = "Houve um erro ao carregar a página.",
}: PageErrorProps) {
  return (
    <div className="flex flex-col justify-center text-center md:min-h-[280px] md:flex-row md:justify-start md:text-start">
      <Head>
        <title>{title}</title>
      </Head>
      <section className="flex w-full flex-col text-center">
        <h1 className="mb-2 pt-10 text-2xl">{title}</h1>
        <p className="mt-2 text-lg">
          Por favor, volte para a{" "}
          <Link
            href="/"
            className="text-blue-300 underline-offset-2 hover:text-blue-200 hover:underline active:opacity-70"
          >
            página inicial do {SITE_NAME}
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
