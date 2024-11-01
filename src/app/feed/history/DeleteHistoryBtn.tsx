"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { Loader2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useFormState } from "@/hooks/useFormState";
import { deleteHistoryAction } from "./action";

export function DeleteHistoryBtn() {
  const router = useRouter();

  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    deleteHistoryAction,
    (message) => {
      toast.success(message);
      router.refresh();
    },
  );

  useEffect(() => {
    if (success === false && message) {
      toast.error(message);
    }
  }, [errors, message, success]);

  return (
    <form onSubmit={handleSubmit}>
      <Button
        type="submit"
        variant="transparent"
        className="gap-2 rounded-full"
        aria-label="Limpar histórico"
        disabled={isPending}
      >
        {isPending ? <Loader2 className="animate-spin" /> : <Trash />}
        <span className="hidden lg:flex">Limpar histórico</span>
      </Button>
    </form>
  );
}
