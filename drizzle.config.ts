import type { Config } from "drizzle-kit";
import { env } from "@/lib/env.mjs";

export default {
  schema: "./src/lib/db/schema",
  out: "./src/lib/db/migrations",
  driver: "better-sqlite",
  dbCredentials: {
    url: env.DATABASE_URL,
  }
} satisfies Config;