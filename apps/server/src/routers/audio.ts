import { router, publicProcedure, protectedProcedure } from "../lib/trpc";
import { db } from "../db";
import { tracks } from "../db/schema/audio";
import { sql, eq } from "drizzle-orm";
import { z } from "zod";
import { TrackInput, TrackIdParam } from "@packages/validators";

export const audioRouter = router({
  // Guest playlist – latest track per public user (Bleed, Luna, etc.)
  guest: publicProcedure.query(async () => {
    // DISTINCT ON is PG-specific – OK for NeonDB
    const result = await db.execute<{ id: string; profile_id: string; title: string; src: string }>(sql`
      SELECT DISTINCT ON (profile_id) id, profile_id, title, src
      FROM tracks
      ORDER BY profile_id, created_at DESC;
    `);
    // db.execute returns a QueryResult object, we only want the rows array
    return result.rows;
  }),

  // Full playlist for authenticated profile/user
  tracks: protectedProcedure
    .input(z.object({ profileId: z.string().uuid() }))
    .query(async ({ input }) => {
      return db.select().from(tracks).where(eq(tracks.profileId, input.profileId));
    }),

  // Admin add track
  add: protectedProcedure
    .input(TrackInput)
    .mutation(async ({ input }) => {
      await db.insert(tracks).values(input);
      return { success: true };
    }),

  // Admin remove track
  remove: protectedProcedure
    .input(TrackIdParam)
    .mutation(async ({ input }) => {
      await db.delete(tracks).where(eq(tracks.id, input.id));
      return { success: true };
    }),

  // Public: list all tracks (for full catalogue)
  list: publicProcedure.query(async () => {
    return db.select().from(tracks);
  }),
}); 