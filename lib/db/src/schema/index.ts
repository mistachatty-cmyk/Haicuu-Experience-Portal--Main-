import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const hostingInquiriesTable = pgTable("hosting_inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  room: text("room").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});