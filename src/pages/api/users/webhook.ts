import type { NextApiRequest, NextApiResponse } from "next";
import type { IncomingHttpHeaders } from "node:http";
import type { WebhookEvent } from "@clerk/nextjs/server";

import { createRouter } from "next-connect";
import { Webhook, type WebhookRequiredHeaders } from "svix";
import { buffer } from "micro";
import { env } from "@/env.mjs";
import { prisma } from "@/lib/prisma";
import { generateRandomString } from "@/utils/strings";

type NextApiRequestWithSvixRequiredHeaders = NextApiRequest & {
  headers: IncomingHttpHeaders & WebhookRequiredHeaders;
};

const router = createRouter<
  NextApiRequestWithSvixRequiredHeaders,
  NextApiResponse
>();

export const config = {
  api: {
    bodyParser: false,
  },
};

const secret = env.CLERK_WEBHOOK_SIGNING_SECRET;

router.post(async (req, res) => {
  const payload = (await buffer(req)).toString();
  const { headers } = req;

  const wh = new Webhook(secret);
  let msg: WebhookEvent | null = null;

  try {
    msg = wh.verify(payload, headers) as WebhookEvent;
  } catch {
    return res
      .status(400)
      .json({ error: "Invalid webhook signature", status: 400 });
  }

  try {
    switch (msg.type) {
      case "user.created": {
        const username =
          msg.data.username || `user_${generateRandomString(25)}`;
        const emails = msg.data.email_addresses;

        if (emails.length === 0) {
          return res
            .status(400)
            .json({ error: "No email address found", status: 400 });
        }

        await prisma.user.create({
          data: {
            externalId: msg.data.id,
            email: emails[0].email_address,
            username,
            image: msg.data.image_url,
          },
        });
        break;
      }
      case "user.updated": {
        const username =
          msg.data.username || `user_${generateRandomString(25)}`;
        const emails = msg.data.email_addresses;

        if (emails.length === 0) {
          return res
            .status(400)
            .json({ error: "No email address found", status: 400 });
        }

        const user = await prisma.user.findUnique({
          where: { externalId: msg.data.id },
        });
        if (user) {
          await prisma.user.update({
            where: { externalId: msg.data.id },
            data: {
              email: emails[0].email_address,
              username,
              image: msg.data.image_url,
            },
          });
          break;
        }
        await prisma.user.create({
          data: {
            externalId: msg.data.id,
            email: emails[0].email_address,
            username,
            image: msg.data.image_url,
          },
        });
        break;
      }
      case "user.deleted": {
        await prisma.user.delete({ where: { externalId: msg.data.id } });
        break;
      }
      default: {
        return res
          .status(400)
          .json({ error: "Unknown or unaccepted event", status: 400 });
      }
    }

    return res.status(200).end();
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal server error", fullError: error, status: 500 });
  }
});

router.all((req, res) => {
  res.status(405).json({ error: "Method not allowed", status: 405 });
});

export default router.handler({
  onError(err, req, res) {
    res.status(400).json({
      error: (err as Error).message,
      status: 400,
    });
  },
});
