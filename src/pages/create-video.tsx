import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { z } from "zod";
import { Meta } from "@/components/Meta";
import { api } from "@/lib/axios";

const createVideoFormSchema = z.object({
  title: z.string().min(1, "O titulo é obrigatório"),
  youtubeId: z.string().min(1, "O id do vídeo do Youtube é obrigatório"),
});

type CreateVideoFormData = z.infer<typeof createVideoFormSchema>;

export default function CreateVideoPage() {
  const [creatingVideo, setCreatingVideo] = useState(false);
  const {
    register,
    handleSubmit,
    reset: resetForm,
    watch,
    formState: { errors },
  } = useForm<CreateVideoFormData>({
    resolver: zodResolver(createVideoFormSchema),
  });

  async function createVideo(data: CreateVideoFormData) {
    setCreatingVideo(true);

    try {
      const videoData = { ...data };
      await api.post("/videos", videoData);
      resetForm();
      toast.success("Vídeo criado com sucesso!");
    } catch (error) {
      toast.error("Erro ao criar o vídeo, tente novamente mais tarde.");
      console.error(error);
    } finally {
      setCreatingVideo(false);
    }
  }

  return (
    <>
      <Meta title="Criar vídeo" path="/create-video" />
      <div className="mt-20 flex justify-center">
        <form
          onSubmit={handleSubmit(createVideo)}
          className="flex w-full max-w-2xl flex-col gap-4"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="title">Titulo</label>
            <input
              type="text"
              id="title"
              className="rounded bg-input px-4 py-2 outline-none ring-ring duration-200 focus:ring-2"
              placeholder="Digite o titulo do vídeo..."
              required
              {...register("title")}
            />
            {errors.title ? (
              <span className="text-sm text-red-500">
                {errors.title.message}
              </span>
            ) : null}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="youtubeId">Youtube ID</label>
            <input
              type="text"
              id="youtubeId"
              className="rounded bg-input px-4 py-2 outline-none ring-ring duration-200 focus:ring-2"
              placeholder="Digite o id do vídeo do Youtube..."
              required
              {...register("youtubeId")}
            />
            {errors.youtubeId ? (
              <span className="text-sm text-red-500">
                {errors.youtubeId.message}
              </span>
            ) : null}
          </div>

          <button
            type="submit"
            className="mt-4 flex justify-center rounded-lg bg-primary p-2.5 outline-none ring-ring ring-offset-2 ring-offset-background duration-200 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-70 hover:[:not(:disabled)&]:bg-primary/80"
            disabled={
              creatingVideo ||
              !!errors.title ||
              !!errors.youtubeId ||
              !watch("title") ||
              !watch("youtubeId")
            }
          >
            {creatingVideo ? <Loader className="animate-spin" /> : "Criar"}
          </button>
        </form>
      </div>
    </>
  );
}
