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
      <p className="font-mono text-[11px] uppercase tracking-widest text-neutral-500">
        {state.date ? formatDateHeader(state.date) : "—"}
      </p>

      {loading ? (
        <div className="mt-4 flex items-center gap-2 text-neutral-400">
          <Loader2 className="size-4 animate-spin" />
          <span className="text-sm">Chargement…</span>
        </div>
      ) : slots.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-400">Aucun créneau disponible ce jour.</p>
      ) : (
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {slots.map((t) => {
            const active = state.time === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => dispatch({ type: "SELECT_TIME", time: t })}
                className={`rounded-md border px-3 py-2.5 text-center font-mono text-sm transition-colors ${
                  active
                    ? "border-white bg-white text-black"
                    : "border-neutral-800 bg-neutral-950 text-neutral-200 hover:border-neutral-600"
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