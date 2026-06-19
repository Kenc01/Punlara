import { pgTable, serial, varchar, integer, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./auth";
import { treesTable } from "./trees";

export const adoptionsTable = pgTable("adoptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => usersTable.id),
  treeId: integer("tree_id").notNull().references(() => treesTable.id),
  treeName: varchar("tree_name", { length: 100 }).notNull(), // user-given name for their tree
  stewardName: varchar("steward_name", { length: 200 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  dedicationMessage: text("dedication_message"),
  status: varchar("status", { length: 30 }).notNull().default("pending_payment"), // pending_payment, active, expired
  paymentId: varchar("payment_id", { length: 200 }),
  checkoutUrl: text("checkout_url"),
  isGift: boolean("is_gift").notNull().default(false),
  recipientName: varchar("recipient_name", { length: 200 }),
  recipientEmail: varchar("recipient_email", { length: 200 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertAdoptionSchema = createInsertSchema(adoptionsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAdoption = z.infer<typeof insertAdoptionSchema>;
export type Adoption = typeof adoptionsTable.$inferSelect;
