import { PageError } from "@/components/PageError";

const title = "Página não encontrada!";

export default function PageNotFound() {
  return <PageError title={title} />;
}
