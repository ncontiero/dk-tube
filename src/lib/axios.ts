import axios from "axios";
import { env } from "@/env.js";

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
});
