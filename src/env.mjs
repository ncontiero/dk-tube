import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    // Node
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    // Database (Prisma)
    DATABASE_URL_NON_POOLING: z.string().url(),
    DATABASE_URL: z.string().url(),

    // Clerk
    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_WEBHOOK_SIGNING_SECRET: z.string().min(1),
  },
  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // these variables are used for the site's SEO
    NEXT_PUBLIC_SITE_NAME: z.string().default("DkTube"),
    NEXT_PUBLIC_SITE_LOCALE: z.string().default("en_US"),
    // URLs
    NEXT_PUBLIC_SITE_BASEURL: z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_IMG_DOMAINS: z.string().transform((val) => val.split(",")),
    // API
    NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:3000/api"),
    // Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    // Clerk URLs
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default("/sign-in"),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().default("/sign-up"),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().default("/"),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().default("/"),
  },
  runtimeEnv: {
    // Node
    NODE_ENV: process.env.NODE_ENV,
    // Database (Prisma)
    DATABASE_URL_NON_POOLING: process.env.DATABASE_URL_NON_POOLING,
    DATABASE_URL: process.env.DATABASE_URL,
    // Clerk
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_SIGNING_SECRET: process.env.CLERK_WEBHOOK_SIGNING_SECRET,

    // Client
    // ----------------------------
    // SEO
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
    NEXT_PUBLIC_SITE_LOCALE: process.env.NEXT_PUBLIC_SITE_LOCALE,
    NEXT_PUBLIC_SITE_BASEURL: process.env.NEXT_PUBLIC_SITE_BASEURL,
    // Img
    NEXT_PUBLIC_IMG_DOMAINS: process.env.NEXT_PUBLIC_IMG_DOMAINS,
    // API
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    // Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    // Clerk URLs
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL:
      process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL:
      process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
