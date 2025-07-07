import { z } from "zod";

export const TrackSchema = z.object({
  id: z.string().uuid(),
  profileId: z.string().uuid(),
  title: z.string().min(1).max(256),
  src: z.string().url(),
});

export type Track = z.infer<typeof TrackSchema>;

// Input when creating a new track – id is auto-generated
export const TrackInput = TrackSchema.omit({ id: true });

// Param when deleting a track by id
export const TrackIdParam = z.object({ id: z.string().uuid() }); 