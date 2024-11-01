import { auth } from "@clerk/nextjs/server";
import { Clock } from "lucide-react";
import { UnauthorizedPage } from "@/components/UnauthorizedPage";
import {
  VideoCardChannel,
  VideoCardChannelName,
  VideoCardInfo,
  VideoCardRoot,
  VideoCardThumb,
  VideoCardTitle,
} from "@/components/VideoCard";
import { prisma } from "@/lib/prisma";

export default async function HistoryPage() {
  const { userId } = await auth();
  if (!userId) {
    return (
      <UnauthorizedPage
        title="Controle o que você assiste"
        description="O histórico de exibição não é visível quando você está desconectado."
        icon={<Clock size={96} />}
      />
    );
  }

  const historyVideos = await prisma.historyVideo.findMany({
    where: { user: { externalId: userId } },
    include: { video: { include: { user: true } } },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="mx-auto mt-4 flex size-full max-w-screen-xl flex-col gap-4 px-4">
        <h1 className="text-4xl font-bold">Histórico</h1>
        <div className="mt-4 flex w-full flex-col gap-4 xs:max-w-3xl">
          {historyVideos.map((history) => (
            <VideoCardRoot
              key={history.id}
              video={history.video}
              className="gap-1 pb-4 xs:flex-row xs:pb-0"
            >
              <VideoCardThumb linkClassName="xs:max-h-[150px] xs:max-w-[250px]" />
              <VideoCardInfo className="mt-0 px-0">
                <div className="flex w-full flex-col px-2 xs:mt-0.5 xs:px-0.5">
                  <VideoCardTitle
                    titleMaxChars={50}
                    className="text-base xs:max-h-14 md:text-lg"
                  />
                  <VideoCardChannel className="mt-1 flex size-fit rounded-md px-0.5 md:mt-0.5">
                    <VideoCardChannelName className="md:text-sm" />
                  </VideoCardChannel>
                </div>
              </VideoCardInfo>
            </VideoCardRoot>
          ))}
        </div>
      </div>
    </div>
  );
}
