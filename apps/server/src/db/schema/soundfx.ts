import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const soundFx = pgTable("sound_fx", {
  id: uuid("id").defaultRandom().primaryKey(),
  /** Human-readable key e.g. "boot_sequence_audio" */
  title: text("title").notNull(),
  /** Remote URL (UploadThing) */
  src: text("src").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}); 