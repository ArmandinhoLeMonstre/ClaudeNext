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
    <div className="mx-auto flex max-w-[560px] flex-col items-center pt-20 text-center">
      <div className="mb-8 flex size-21 items-center justify-center rounded-full border border-accent-success/35 bg-accent-success/10">
        <Check className="size-9 text-accent-success" />
      </div>

      <h2 className="mb-4 font-display text-[clamp(1.875rem,4.4vw,2.875rem)] uppercase leading-[0.98] tracking-[-0.01em] text-foreground">
        Réservation confirmée
      </h2>
      <p className="mb-3 text-[17px] text-text-dim">
        {booking.serviceName} avec {barber?.name ?? "votre coiffeur"}
      </p>
      <p className="font-mono text-[13px] tracking-[0.06em] text-text-muted">
        {dateLabel} à {timeLabel}
      </p>
    </div>
  );
}