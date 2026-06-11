import { db } from "@/lib/db";
import { hairdressers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";   

export async function getBarbers() {
	const rows = await db
		.select()
		.from(hairdressers)
		.where(eq(hairdressers.active, true))

	return rows;
}