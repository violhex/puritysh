import {
  protectedProcedure, publicProcedure,
  router,
} from "../lib/trpc";
import { audioRouter } from "./audio";
import { uploadRouter } from "./upload";
import { cursorRouter } from "./cursor";
import { profileRouter } from "./profile";
import { soundFxRouter } from "./soundfx";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => "OK"),
  privateData: protectedProcedure.query(({ ctx }) => ({
    message: "This is private",
    user: ctx.session.user,
  })),
  audio: audioRouter,
  upload: uploadRouter,
  cursor: cursorRouter,
  profile: profileRouter,
  soundfx: soundFxRouter,
});
export type AppRouter = typeof appRouter;
