import { Check } from "lucide-react";
import type { Barbers } from "@/lib/db/schema";
import { Booking } from "./types";

type BookingConfirmationProps = {
  booking: Booking;
  hairdressers: Barbers[];
};

export default function BookingConfirmation({ booking, hairdressers }: BookingConfirmationProps) {
  const barber = hairdressers.find((h) => h.id === booking.hairdresserId);
  const start = new Date(booking.startsAt); // ISO string from JSON → Date

  const dateLabel = start.toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  const timeLabel = start.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-col items-center gap-6 py-12 text-center">
      <div className="flex size-14 items-center justify-center rounded-full border border-green-500/40 bg-green-500/10">
        <Check className="size-7 text-green-400" />
      </div>

      <div className="space-y-2">
        <h2 className="text-4xl font-bold tracking-tight">RÉSERVATION CONFIRMÉE</h2>
        <p className="text-neutral-400">
          {booking.serviceName} avec {barber?.name ?? "votre coiffeur"}
        </p>
        <p className="font-mono text-sm uppercase tracking-widest text-neutral-300">
          {dateLabel} à {timeLabel}
        </p>
      </div>
    </div>
  );
}