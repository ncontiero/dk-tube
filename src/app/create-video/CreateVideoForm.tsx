"use client";

import { toast } from "react-toastify";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useFormState } from "@/hooks/useFormState";
import { type CreateVideoKeys, createVideoAction } from "./action";

export function CreateVideoForm() {
  const [{ errors, message, success }, handleSubmit, isPending] =
    useFormState<CreateVideoKeys>(createVideoAction, (message, _, form) => {
      toast.success(message);
      form.reset();
    });

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl flex-col gap-4 rounded-md border px-6 py-8"
    >
      {success === false && message ? (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Falha ao criar o vídeo</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          name="title"
          type="text"
          id="title"
          placeholder="Digite o título do vídeo..."
        />

        {errors?.title ? (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.title[0]}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="youtubeId">Youtube ID</Label>
        <Input
          name="youtubeId"
          type="text"
          id="youtubeId"
          placeholder="Digite o id do vídeo do Youtube..."
        />

        {errors?.youtubeId ? (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.youtubeId[0]}
          </p>
        ) : null}
      </div>

      <Button type="submit" className="mt-2" disabled={isPending}>
        {isPending ? <Loader2 className="size-4 animate-spin" /> : "Criar"}
      </Button>
    </form>
  );
}
