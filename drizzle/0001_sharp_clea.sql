CREATE TABLE "availabilities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hairdresser_id" uuid NOT NULL,
	"weekday" integer NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL
);
--> statement-breakpoint
ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_hairdresser_id_hairdressers_id_fk" FOREIGN KEY ("hairdresser_id") REFERENCES "public"."hairdressers"("id") ON DELETE cascade ON UPDATE no action;