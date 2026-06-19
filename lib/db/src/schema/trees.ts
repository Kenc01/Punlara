import { pgTable, serial, varchar, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const treesTable = pgTable("trees", {
  id: serial("id").primaryKey(),
  treeCode: varchar("tree_code", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  species: varchar("species", { length: 100 }).notNull(),
  tier: varchar("tier", { length: 20 }).notNull(), // Seedling, Classic, Premium
  pricePerYear: integer("price_per_year").notNull(),
  location: varchar("location", { length: 200 }).notNull(),
  estimatedHarvestKg: integer("estimated_harvest_kg").notNull(),
  imageUrl: text("image_url").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("available"), // available, adopted
  description: text("description"),
  co2PerYear: integer("co2_per_year"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTreeSchema = createInsertSchema(treesTable).omit({ id: true, createdAt: true });
export type InsertTree = z.infer<typeof insertTreeSchema>;
export type Tree = typeof treesTable.$inferSelect;
