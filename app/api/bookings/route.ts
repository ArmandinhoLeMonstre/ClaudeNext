import { createBooking } from "@/lib/createBooking";
import { NextResponse } from "next/server";
import { z } from "zod";

const bookingSchema = z.object({
  hairdresserId: z.uuid(),
  serviceId: z.uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
});


export async function POST(req: Request) {
  try {
    const body = await req.json();
    // validate body here (zod) before trusting it
    const booking = await createBooking(body);
	const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
    }
    return NextResponse.json(booking, { status: 201 });
  } catch (err) {
    const code = (err as { code?: string })?.code;
    if (code === "23P01") {   // exclusion_violation → slot already taken, code postgress expres pour le cas de double slot 
      return NextResponse.json(
        { error: "Ce créneau vient d'être réservé." },
        { status: 409 }
      );
    }
    console.error("Booking failed:", err);
    return NextResponse.json({ error: "Échec de la réservation." }, { status: 500 });
  }
}