import { router, publicProcedure } from "../lib/trpc";
import { db } from "../db";
import { icons } from "../db/schema/icon";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const uploadRouter = router({
  /**
   * Fetch icon URL by its title.
   * Returns null if not found so that the client can fallback to a sprite icon.
   */
  getIcon: publicProcedure
    .input(
      z.object({
        title: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const rows = await db
        .select({ src: icons.src })
        .from(icons)
        .where(eq(icons.title, input.title))
        .limit(1);
      return rows.length ? rows[0].src : null;
    }),
}); 