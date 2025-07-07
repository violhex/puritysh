import { z } from "zod";

export const CursorInput = z.object({
  profileId: z.string().uuid().nullable(),
  title: z.string().min(1).max(64),
  src: z.string().url(),
});

export const CursorIdParam = z.object({ id: z.string().uuid() });

export type CursorInput = z.infer<typeof CursorInput>; 