import { db } from "@/lib/db";
import { bookings, services } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { fromZonedTime } from "date-fns-tz";

type BookingInput = {
	hairdresserId: string;
	serviceId: string;
	date: string;
	time: string
}

export async function createBooking(input : BookingInput) {
	const [service] = await db
    .select()
    .from(services)
    .where(eq(services.id, input.serviceId));

	if (!service) 
		throw new Error("SERVICE_NOT_FOUND");
	if (service.durationMinutes == null) 
		throw new Error("SERVICE_NO_DURATION");

	const startsAt = fromZonedTime(`${input.date}T${input.time}:00`, "Europe/Brussels");   // ⚠ timezone note below
  	const endsAt = new Date(startsAt.getTime() + service.durationMinutes * 60_000);

	  const [booking] = await db
		.insert(bookings)
		.values({
		hairdresserId: input.hairdresserId,
		serviceId: input.serviceId,
		serviceName: service.name,                         // snapshot
		serviceDurationMinutes: service.durationMinutes,   // snapshot
		startsAt,
		endsAt,
		// status defaults to 'confirmed'; customerId stays null (guest) for now
		})
		.returning();

	return booking;
}