"use client";

import { toast } from "react-toastify";
import { Loader, Trash } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { deleteHistoryAction } from "@/actions/history";
import { Button } from "@/components/ui/Button";

export function DeleteHistoryBtn() {
  const deleteHistory = useAction(deleteHistoryAction, {
    onError: ({ error }) => {
      toast.error(error.serverError);
    },
    onSuccess: () => {
      toast.success("Histórico excluído com sucesso");
    },
  });

  return (
    <Button
      type="submit"
      variant="transparent"
      className="w-fit gap-2 rounded-full"
      aria-label="Limpar histórico"
      onClick={() => deleteHistory.execute()}
      disabled={deleteHistory.status === "executing"}
    >
      {deleteHistory.status === "executing" ? (
        <Loader className="animate-spin" />
      ) : (
        <Trash />
      )}
      <span className="hidden lg:flex">Limpar histórico</span>
    </Button>
  );
}
