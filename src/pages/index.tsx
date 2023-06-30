import { Meta } from "@/components/Meta";

export default function HomePage() {
  return (
    <>
      <Meta
        path="/"
        description="Aproveite vídeos e músicas que você ama, envie e compartilhe conteúdo original com amigos, parentes e o mundo no DkTube."
        image={{ src: "/logo.png", alt: "Logo do DkTube" }}
      />
      <h1>Hello World</h1>
    </>
  );
}
