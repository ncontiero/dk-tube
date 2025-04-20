import type { NextRequest } from "next/server";
import { randomBytes } from "node:crypto";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { prisma, prismaSkip } from "@/lib/prisma";
import { errorResponse } from "@/utils/errorResponse";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    switch (evt.type) {
      case "user.created":
      case "user.updated": {
        const username =
          evt.data.username || `user_${randomBytes(15).toString("hex")}`;
        const emails = evt.data.email_addresses;

        if (emails.length === 0 || !emails[0]?.email_address) {
          throw new Error("No email address provided");
        }

        const data = {
          externalId: evt.data.id,
          email: emails[0].email_address,
          username,
          image: evt.data.image_url,
        };
        await prisma.user.upsert({
          where: { externalId: evt.data.id },
          create: data,
          update: data,
        });
        break;
      }
      case "user.deleted": {
        await prisma.user.delete({
          where: { externalId: evt.data.id || prismaSkip },
        });
        break;
      }
      default:
        throw new Error("Unknown or unaccepted event");
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return errorResponse(error, [
      "Unknown or unaccepted event",
      "No email address provided",
    ]);
  }

  return new Response("", { status: 201 });
}
