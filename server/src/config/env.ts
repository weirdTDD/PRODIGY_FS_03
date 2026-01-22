import { config } from "dotenv";

const env = typeof process !== "undefined" && process.env ? process.env : {};
config({ path: `.env.${env.NODE_ENV || "development"}.local` });

export const { PORT, NODE_ENV, MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN } =
  process.env;
