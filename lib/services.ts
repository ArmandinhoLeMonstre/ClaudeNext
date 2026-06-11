import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { eq } from "drizzle-orm";   
import { cacheLife } from "next/cache";

const GROUP_ORDER = ["CHEVEUX", "BARBE", "COMBINÉ"]; // faire un enum apres

export async function getServices() {
	// "use cache";
  	// cacheLife("hours"); p-e a faire apres

  const rows = await db
    .select()
    .from(services)
    .where(eq(services.active, true))
    .orderBy(services.displayOrder);

  return GROUP_ORDER.map((group) => ({
    group,
    items: rows.filter((r) => r.category === group),
  }));
}