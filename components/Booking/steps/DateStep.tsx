import { Calendar } from "@/components/ui/calendar";
import { fromISODate, toISODate } from "@/lib/dateFormat";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import TimeSlots from "./TimeStep";
import { barbersGrouped, BookingProps, ServiceGrouped } from "../types";

type DateStepProps = BookingProps & {
  services: ServiceGrouped[];
  hairdressers: barbersGrouped[];
};

const euros = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

export default function DateStep({ state, dispatch, services, hairdressers }: DateStepProps) {
  const [weekdays, setWeekdays] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!state.barber)
		return;
    setWeekdays(null);   // reset while the new barber's schedule loads
    fetch(`/api/bookings/availability?hairdresser=${state.barber}`)
      .then((res) => res.json())
      .then((data) => setWeekdays(data.weekdays))
      .catch((err) => console.error(err))
	  .finally(() => setLoading(false));
  }, [state.barber]);    // ← re-fetch whenever the barber changes

  const selected = state.date ? fromISODate(state.date) : undefined;

  function handleSelect(d: Date | undefined) {
    if (!d)
		return;
    dispatch({ type: "SELECT_DATE", date: toISODate(d) });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function isDisabled(date: Date) {
    if (date < today) return true;                 // no past dates
    if (!weekdays) return true;                    // still loading → block everything
    return !weekdays.includes(date.getDay());      // barber doesn't work this weekday
  }

  // Presentational recap — resolves the selected ids to display names.
  const service = services.flatMap((g) => g.items).find((s) => s.id === state.service);
  const barber = hairdressers.find((h) => h.id === state.barber);
  const recap = [
    { label: "Prestation", value: service?.name ?? "—" },
    { label: "Durée", value: service?.durationMinutes ? `${service.durationMinutes} min` : "—" },
    { label: "Coiffeur", value: barber?.name ?? "—" },
    { label: "Prix", value: service?.priceCents != null ? euros.format(service.priceCents / 100) : "—" },
    {
      label: "Date",
      value: state.date
        ? fromISODate(state.date).toLocaleDateString("fr-FR", {
            weekday: "long", day: "numeric", month: "long", year: "numeric",
          })
        : "—",
    },
    { label: "Heure", value: state.time ? state.time.replace(":", "h") : "—" },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)] md:items-start">
      {/* recap */}
      <div className="rounded-card border border-border-default p-6">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-eyebrow text-text-muted">Votre réservation</p>
        {recap.map((r) => (
          <div
            key={r.label}
            className="flex items-baseline justify-between gap-4 border-t border-border-subtle py-[11px]"
          >
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-label text-text-muted">{r.label}</span>
            <span className="text-right text-sm text-foreground">{r.value}</span>
          </div>
        ))}
      </div>

      {/* calendar + slots */}
      <div className="rounded-card border border-border-default px-6 py-[22px]">
        {loading ? (
          <div className="flex h-72 items-center justify-center gap-2 text-sm text-text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Chargement des disponibilités…
          </div>
        ) : (
          <>
            <Calendar
              mode="single"
              selected={selected}
              onSelect={handleSelect}
              disabled={isDisabled}
              className="w-full"
              captionLayout="dropdown"
            />

            {state.date && (
              <div className="mt-5 border-t border-border-default pt-[18px]">
                <TimeSlots state={state} dispatch={dispatch} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
