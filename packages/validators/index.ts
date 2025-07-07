import { z } from "zod";

export const SignUpSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
  password: z.string().min(8),
});

export type SignUpInput = z.infer<typeof SignUpSchema>;

// Add additional shared schemas below and export them here to keep a single entry-point.
export { TrackSchema, TrackInput, TrackIdParam, type Track } from "./audio";
export { CursorInput, CursorIdParam, type CursorInput as Cursor } from "./cursor"; 