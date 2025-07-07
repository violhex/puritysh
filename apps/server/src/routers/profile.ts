import { publicProcedure, router } from "../lib/trpc";
import { db } from "../db";
import { profiles } from "../db/schema/profile";

export const profileRouter = router({
  list: publicProcedure.query(async () => {
    return db.select().from(profiles);
  }),
}); 