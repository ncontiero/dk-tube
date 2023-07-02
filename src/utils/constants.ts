export const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
export const SITE_BASEURL = process.env.SITE_BASEURL;
export const SITE_NAME = process.env.SITE_NAME;

if (!NEXT_PUBLIC_API_URL) throw new Error("Missing env.NEXT_PUBLIC_API_URL");
if (!SITE_BASEURL) throw new Error("Missing env.SITE_BASEURL");
if (!SITE_NAME) throw new Error("Missing env.SITE_NAME");
