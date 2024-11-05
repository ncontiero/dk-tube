import { auth } from "@clerk/nextjs/server";
import { Film } from "lucide-react";
import Image from "next/image";

import Link from "next/link";
import { UnauthorizedPage } from "@/components/UnauthorizedPage";
import { prisma } from "@/lib/prisma";

const YouUnauthorizedPage = () => {
  return (
    <UnauthorizedPage
      title="Desfrute dos seus vídeos favoritos"
      description="Faça login para acessar os vídeos salvos ou marcados com gostei"
      icon={<Film size={96} />}
    />
  );
};

export default async function YouPage() {
  const { userId } = await auth();
  if (!userId) {
    return <YouUnauthorizedPage />;
  }

  const you = await prisma.user.findUnique({
    where: { externalId: userId },
  });
  if (!you) {
    return <YouUnauthorizedPage />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="mx-auto mt-6 flex size-full max-w-screen-xl flex-col gap-4 px-4">
        <div className="flex items-center gap-4">
          <Image
            src={you.image}
            alt={you.username}
            width={120}
            height={120}
            className="aspect-square max-h-[72px] max-w-[72px] rounded-full border object-cover xs:max-h-[120px] xs:max-w-[120px]"
          />
          <Link
            href={`/channel/${you.id}`}
            className="group flex size-fit flex-col rounded-md outline-none ring-primary duration-200 focus:ring-2"
          >
            <h1 className="text-xl font-bold uppercase xs:text-4xl">
              {you.username}
            </h1>
            <span className="mt-1 text-xs text-foreground/60 duration-200 group-hover:text-foreground group-hover:underline group-focus:text-foreground group-focus:underline xs:text-sm">
              Ver canal
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
