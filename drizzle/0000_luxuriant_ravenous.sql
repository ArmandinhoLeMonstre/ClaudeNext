CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hairdresser_id" uuid NOT NULL,
	"service_id" uuid,
	"customer_id" uuid,
	"service_name" text NOT NULL,
	"service_duration_minutes" integer NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"status" text DEFAULT 'confirmed' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hairdressers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"duration_minutes" integer,
	"price_cents" integer,
	"display_order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_hairdresser_id_hairdressers_id_fk" FOREIGN KEY ("hairdresser_id") REFERENCES "public"."hairdressers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action --> statement-breakpoint

ALTER TABLE "bookings"
  ADD CONSTRAINT "bookings_customer_id_users_id_fk"
  FOREIGN KEY ("customer_id") REFERENCES "auth"."users"("id")
  ON DELETE SET NULL;--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS btree_gist;--> statement-breakpoint
ALTER TABLE "bookings"
  ADD CONSTRAINT "no_overlapping_bookings"
  EXCLUDE USING gist (
    "hairdresser_id" WITH =,
    tstzrange("starts_at", "ends_at") WITH &&
  )
  WHERE (status <> 'cancelled');