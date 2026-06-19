import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@workspace/db";

export const db = drizzle(process.env.DATABASE_URL!, { schema });
