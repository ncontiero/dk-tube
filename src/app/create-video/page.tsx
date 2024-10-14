import type { Metadata } from "next";
import { CreateVideoForm } from "./CreateVideoForm";

export const metadata: Metadata = {
  title: "Criar vídeo",
};

export default function CreateVideoPage() {
  return (
    <div className="mt-20 flex justify-center">
      <CreateVideoForm />
    </div>
  );
}
