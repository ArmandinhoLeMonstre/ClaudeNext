import { pgTable, uuid, text, integer, boolean, timestamp, time } from 'drizzle-orm/pg-core';

export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  category: text('category').notNull(),            // "CHEVEUX" | "BARBE" | "COMBINÉ"
  durationMinutes: integer('duration_minutes'),    // nullable — Décoloration is "sur demande"
  priceCents: integer('price_cents'),              // nullable too
  displayOrder: integer('display_order').notNull().default(0),
  active: boolean('active').notNull().default(true),
});

export const hairdressers = pgTable('hairdressers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  hairdresserId: uuid('hairdresser_id').notNull()
    .references(() => hairdressers.id, { onDelete: 'restrict' }),
  serviceId: uuid('service_id').references(() => services.id, { onDelete: 'set null' }),
  customerId: uuid('customer_id'),                 // FK to auth.users — added by hand (step 7)
  serviceName: text('service_name').notNull(),                  // snapshot
  serviceDurationMinutes: integer('service_duration_minutes').notNull(), // snapshot
  startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
  endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
  status: text('status').notNull().default('confirmed'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const availabilities = pgTable('availabilities', {
  id: uuid('id').primaryKey().defaultRandom(),
  hairdresserId: uuid('hairdresser_id').notNull()
    .references(() => hairdressers.id, { onDelete: 'cascade' }),
  weekday: integer('weekday').notNull(),     // 0=Sun … 6=Sat
  startTime: time('start_time').notNull(),   // "10:00"
  endTime:   time('end_time').notNull(),     // "18:30"
});

export type Service = typeof services.$inferSelect;