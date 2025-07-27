import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
export const db = drizzle(process.env.DATABASE_URL as string, { schema });
