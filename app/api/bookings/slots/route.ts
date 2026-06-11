import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/slots";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const hairdresser = searchParams.get("hairdresser");
  const service = searchParams.get("service");
  const date = searchParams.get("date");

  if (!hairdresser || !service || !date) {
    return NextResponse.json({ error: "Paramètres manquants." }, { status: 400 });
  }

  const slots = await getAvailableSlots({ hairdresserId: hairdresser, serviceId: service, date });
  return NextResponse.json({ slots });
}