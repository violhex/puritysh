import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const icons = pgTable("icons", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  src: text("src").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}); 