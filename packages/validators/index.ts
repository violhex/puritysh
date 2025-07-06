import { z } from "zod";

export const SignUpSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
  password: z.string().min(8),
});

export type SignUpInput = z.infer<typeof SignUpSchema>;

// Add additional shared schemas below and export them here to keep a single entry-point. 