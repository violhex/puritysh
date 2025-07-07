ALTER TABLE "profiles" ADD COLUMN "uid" smallint NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_uid_unique" UNIQUE("uid");