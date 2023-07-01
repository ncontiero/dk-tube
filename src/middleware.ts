import type { NextFetchEvent, NextRequest } from "next/server";

import { authMiddleware } from "@clerk/nextjs";
import { createEdgeRouter } from "next-connect";

const router = createEdgeRouter<NextRequest, NextFetchEvent>();

export function middleware(request: NextRequest, event: NextFetchEvent) {
  return router.run(request, event);
}

export default authMiddleware({
  publicRoutes: ["/", "/api(.*)"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
