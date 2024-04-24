/* eslint-disable unicorn/prefer-top-level-await */
/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type createUserParams = {
  externalId: string;
  username: string;
  email: string;
  image?: string;
};
type createVideoParams = {
  title: string;
  thumb: string;
  youtubeId: string;
  userId: string;
};
type createPlaylistParams = {
  name: string;
  isPublic?: boolean;
  userId: string;
  videosId?: { id: string }[];
};

async function createUser(params: createUserParams) {
  const { externalId, username, email, image } = params;
  return await prisma.user.create({
    data: {
      externalId,
      username,
      email,
      image,
    },
  });
}
async function createVideo(params: createVideoParams) {
  const { title, thumb, youtubeId, userId } = params;
  return await prisma.video.create({
    data: {
      title,
      thumb,
      youtubeId,
      userId,
    },
  });
}
async function createPlaylist(params: createPlaylistParams) {
  const { name, isPublic = true, userId, videosId = [] } = params;
  return await prisma.playlist.create({
    data: {
      name,
      isPublic,
      userId,
      videos: { connect: videosId },
    },
  });
}

async function main() {
  console.log("\n🌱Starting seeding...🌱\n");

  const user1 = await createUser({
    email: "test@email.com",
    externalId: "374rgfbyhwedb8yb342",
    username: "test",
  });
  console.log(`Created user with id: ${user1.id}`);

  const video1 = await createVideo({
    title: "The Lost Soul Down (Slowed & Reverb)",
    thumb: "https://i.ytimg.com/vi/HoqSbJ03zgo/maxresdefault.jpg",
    youtubeId: "HoqSbJ03zgo",
    userId: user1.id,
  });
  console.log(`Created video with id: ${video1.id}`);

  const video2 = await createVideo({
    title: "Dreams of Polaris",
    thumb: "https://i.ytimg.com/vi/ym88wdYzbPM/maxresdefault.jpg",
    youtubeId: "ym88wdYzbPM",
    userId: user1.id,
  });
  console.log(`Created video with id: ${video2.id}`);

  const video3 = await createVideo({
    title: "Fluid Sim Hue Test",
    thumb: "https://i.ytimg.com/vi/qC0vDKVPCrw/maxresdefault.jpg",
    youtubeId: "qC0vDKVPCrw",
    userId: user1.id,
  });
  console.log(`Created video with id: ${video3.id}`);

  const playlist1 = await createPlaylist({
    name: "Musics",
    userId: user1.id,
    videosId: [{ id: video1.id }, { id: video2.id }],
  });
  console.log(`Created playlist with id: ${playlist1.id}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
