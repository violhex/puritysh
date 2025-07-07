import { createUploadthing } from "uploadthing/next";
import { db } from "@/db";
import { tracks } from "@/db/schema/audio";
import { cursors } from "@/db/schema/cursor";
import { icons } from "@/db/schema/icon";
import { auth } from "@/lib/auth";
import type { FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter: FileRouter = {
  // --- AUDIO TRACKS ---
  audio: f({ audio: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const session = await auth.api.getSession({ headers: req.headers });
      if (!session) throw new Error("UNAUTHORIZED");
      return { profileId: session.user.id } as const;
    })
    .onUploadComplete(async ({ file, metadata }) => {
      await db.insert(tracks).values({
        profileId: metadata.profileId,
        title: file.name.replace(/\.[^.]+$/, ""),
        src: file.url,
      });
    }),

  // --- CURSORS ---
  cursor: f({ image: { maxFileSize: "512KB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const session = await auth.api.getSession({ headers: req.headers });
      return { profileId: session?.user.id ?? null } as const;
    })
    .onUploadComplete(async ({ file, metadata }) => {
      await db.insert(cursors).values({
        profileId: metadata.profileId,
        title: file.name.replace(/\.[^.]+$/, ""),
        src: file.url,
      });
    }),

  // --- ICONS ---
  icon: f({ image: { maxFileSize: "512KB", maxFileCount: 1 } })
    .onUploadComplete(async ({ file }) => {
      await db.insert(icons).values({
        title: file.name.replace(/\.[^.]+$/, ""),
        src: file.url,
      });
    }),
} as const; 