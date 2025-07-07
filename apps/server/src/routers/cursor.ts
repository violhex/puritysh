import { router, publicProcedure } from "../lib/trpc";
import { db } from "../db";
import { cursors } from "../db/schema/cursor";
import { eq, isNull } from "drizzle-orm";
import { z } from "zod";

export const cursorRouter = router({
  /**
   * List all cursor assets belonging to a profile.
   */
  list: publicProcedure
    .input(
      z.object({
        profileId: z.string().uuid().nullable(),
      }),
    )
    .query(async ({ input }) => {
      if (input.profileId === null) {
        return db.select().from(cursors).where(isNull(cursors.profileId));
      }
      return db.select().from(cursors).where(eq(cursors.profileId, input.profileId));
    }),
}); 