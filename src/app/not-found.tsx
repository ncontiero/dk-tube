import type { Metadata } from "next";
import { PageError } from "@/components/PageError";

export const metadata: Metadata = {
  title: "Página não encontrada",
};

export default function PageNotFound() {
  const title = "Página não encontrada";
  const description =
    "Infelizmente a página que você está procurando não existe ou foi removida.";

  return <PageError title={title} description={description} />;
}
