import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const cursors = pgTable("cursors", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: text("profile_id")
    .references(() => user.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  src: text("src").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}); 