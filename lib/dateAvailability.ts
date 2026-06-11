import { db } from "@/lib/db";
import { availabilities } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getBarberWeekdays(hairdresserId: string) {
  const rows = await db
    .selectDistinct({ weekday: availabilities.weekday })
    .from(availabilities)
    .where(eq(availabilities.hairdresserId, hairdresserId));
  return rows.map((r) => r.weekday);   // e.g. [0, 2, 3, 4, 5, 6]
}