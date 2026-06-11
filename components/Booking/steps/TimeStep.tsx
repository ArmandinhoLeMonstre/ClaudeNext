import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { fromISODate } from "@/lib/dateFormat";
import { BookingProps } from "../types";

function formatDateHeader(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  }).format(fromISODate(iso));
}

export default function TimeSlots({ state, dispatch }: BookingProps) {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state.date || !state.barber || !state.service) return;
    let ignore = false;
    setLoading(true);
    const params = new URLSearchParams({
      hairdresser: state.barber,
      service: state.service,
      date: state.date,
    });
    fetch(`/api/bookings/slots?${params}`)
      .then((res) => res.json())
      .then((data) => { if (!ignore) setSlots(data.slots ?? []); })
      .catch((err) => console.error(err))
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [state.date, state.barber, state.service]);

  return (
    <div>
      <p className="mb-[14px] font-mono text-[10px] uppercase tracking-eyebrow text-text-muted">
        {state.date ? formatDateHeader(state.date) : "—"}
      </p>

      {loading ? (
        <div className="flex items-center gap-2 text-text-muted">
          <Loader2 className="size-4 animate-spin" />
          <span className="text-sm">Chargement…</span>
        </div>
      ) : slots.length === 0 ? (
        <p className="text-sm text-text-muted">Aucun créneau disponible ce jour.</p>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {slots.map((t) => {
            const active = state.time === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => dispatch({ type: "SELECT_TIME", time: t })}
                className={`rounded-card border py-3 text-center font-mono text-[13px] tracking-[0.04em] transition-colors ${
                  active
                    ? "border-foreground bg-foreground text-inverse"
                    : "border-border-default text-foreground hover:border-border-hover"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}