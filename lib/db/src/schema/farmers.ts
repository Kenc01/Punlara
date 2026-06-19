import { pgTable, serial, varchar, text, numeric, integer, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./auth";

export const farmersTable = pgTable("farmers", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => usersTable.id),
  farmName: varchar("farm_name", { length: 200 }).notNull(),
  farmerName: varchar("farmer_name", { length: 200 }).notNull(),
  location: varchar("location", { length: 200 }).notNull(),
  bio: text("bio"),
  imageUrl: text("image_url"),
  phone: varchar("phone", { length: 30 }),
  treeCount: integer("tree_count").notNull().default(0),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  commissionRate: numeric("commission_rate", { precision: 4, scale: 2 }).notNull().default("0.15"),
  lat: numeric("lat", { precision: 10, scale: 6 }),
  lng: numeric("lng", { precision: 10, scale: 6 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type Farmer = typeof farmersTable.$inferSelect;
export type InsertFarmer = typeof farmersTable.$inferInsert;
