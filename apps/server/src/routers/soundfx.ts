import { router, publicProcedure } from "../lib/trpc";
import { db } from "../db";
import { soundFx } from "../db/schema/soundfx";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const soundFxRouter = router({
  getByTitle: publicProcedure
    .input(z.object({ title: z.string() }))
    .query(async ({ input }) => {
      const row = await db
        .select()
        .from(soundFx)
        .where(eq(soundFx.title, input.title))
        .limit(1);
      return row[0] ?? null;
    }),
}); 