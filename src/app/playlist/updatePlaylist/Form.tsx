"use client";

import type { Playlist } from "@prisma/client";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import { useFormState } from "@/hooks/useFormState";
import { type UpdatePlaylistKeys, updatePlaylistAction } from "./action";

export function UpdatePlaylistForm({
  playlist,
}: {
  readonly playlist: Playlist;
}) {
  const router = useRouter();

  const [{ errors, message, success }, handleSubmit, isPending] =
    useFormState<UpdatePlaylistKeys>(updatePlaylistAction, (message) => {
      toast.success(message);
      router.refresh();
    });

  useEffect(() => {
    if (success === false && message) {
      toast.error(message);
    }
    if (errors?.playlistId) {
      toast.error(errors.playlistId);
    }
  }, [errors, message, success]);

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <input
        hidden
        type="hidden"
        value={playlist.id}
        name="playlistId"
        readOnly
      />
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          name="name"
          type="text"
          id="name"
          placeholder="Digite o nome da playlist..."
          defaultValue={playlist.name}
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
          <Switch
            name="isPublic"
            id="isPublic"
            defaultChecked={playlist.isPublic}
          />
        </div>
        {errors?.isPublic ? (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.isPublic[0]}
          </p>
        ) : null}
      </Label>

      <Button
        type="submit"
        className="mt-4 w-full rounded-full"
        disabled={isPending}
      >
        {isPending ? <Loader2 className="size-4 animate-spin" /> : "Salvar"}
      </Button>
    </form>
  );
}
