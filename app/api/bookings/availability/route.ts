import { NextResponse } from "next/server";
import { getBarberWeekdays } from "@/lib/dateAvailability";

export async function GET(req: Request) {
  const hairdresser = new URL(req.url).searchParams.get("hairdresser");
  if (!hairdresser) {
    return NextResponse.json({ error: "hairdresser required" }, { status: 400 });
  }
  const weekdays = await getBarberWeekdays(hairdresser);
  return NextResponse.json({ weekdays });
}