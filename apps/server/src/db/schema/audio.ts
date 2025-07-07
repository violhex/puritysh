import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const tracks = pgTable("tracks", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: text("profile_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 256 }).notNull(),
  src: text("src").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}); 