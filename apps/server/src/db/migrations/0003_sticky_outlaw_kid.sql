CREATE TABLE "cursors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" text,
	"title" text NOT NULL,
	"src" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "icons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"src" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "uploads" CASCADE;--> statement-breakpoint
ALTER TABLE "cursors" ADD CONSTRAINT "cursors_profile_id_user_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;