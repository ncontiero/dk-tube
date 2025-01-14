"use client";

import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormState } from "@/hooks/useFormState";
import { Button } from "../ui/Button";
import { DialogClose } from "../ui/Dialog";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Switch } from "../ui/Switch";
import {
  type CreatePlaylistKeys,
  createPlaylistAction,
} from "./createPlaylistAction";

interface CreatePlaylistFormProps {
  readonly videoId?: string;
  readonly createPlaylistFormOpen?: boolean;
  readonly setCreatePlaylistFormOpen?: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  readonly refetchPlaylists?: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult>;
}

export function CreatePlaylistForm({
  videoId,
  refetchPlaylists,
  createPlaylistFormOpen = true,
  setCreatePlaylistFormOpen,
}: CreatePlaylistFormProps) {
  const router = useRouter();

  const [{ errors, message, success }, handleSubmit, isPending] =
    useFormState<CreatePlaylistKeys>(createPlaylistAction, async (message) => {
      if (refetchPlaylists) {
        await refetchPlaylists?.();
      } else {
        router.refresh();
      }
      toast.success(message);
      setCreatePlaylistFormOpen?.(false);
    });

  useEffect(() => {
    if (success === false && message) {
      toast.error(message);
    }
    if (errors?.videoId) {
      toast.error(errors.videoId);
    }
  }, [errors, message, success]);

  return (
    <form
      onSubmit={handleSubmit}
      data-state={createPlaylistFormOpen ? "open" : "closed"}
      className="duration-200 data-[state=closed]:hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-left-1/3 data-[state=open]:slide-in-from-left-1/3"
      aria-hidden={!createPlaylistFormOpen}
    >
      {videoId ? (
        <input hidden type="hidden" value={videoId} name="videoId" readOnly />
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          name="name"
          type="text"
          id="name"
          placeholder="Digite o nome da playlist..."
        />

        {errors?.name ? (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.name[0]}
          </p>
        ) : null}
      </div>

      <Label
        className="mt-4 flex cursor-pointer flex-col gap-2 rounded-xl p-2 duration-200 hover:bg-input/80"
        htmlFor="isPublic"
      >
        <div className="flex w-full items-center justify-between">
          Pública
          <Switch name="isPublic" id="isPublic" />
        </div>
        {errors?.isPublic ? (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.isPublic[0]}
          </p>
        ) : null}
      </Label>

      <div className="mt-4 flex items-center gap-2">
        {!setCreatePlaylistFormOpen ? (
          <DialogClose asChild>
            <Button variant="outline" className="w-full rounded-full">
              Voltar
            </Button>
          </DialogClose>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-full"
            onClick={() => setCreatePlaylistFormOpen(false)}
          >
            Voltar
          </Button>
        )}
        <Button
          type="submit"
          className="w-full rounded-full"
          disabled={isPending}
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : "Criar"}
        </Button>
      </div>
    </form>
  );
}
