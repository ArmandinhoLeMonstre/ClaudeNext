import { Loader2 } from "lucide-react";
import { fromISODate } from "@/lib/dateFormat";
import type { hairdressers } from "@/lib/db/schema";
import { barbersGrouped, BookingProps, ServiceGrouped } from "../types";

type SummaryStepProps = BookingProps & {
  services: ServiceGrouped[];
  hairdressers: barbersGrouped[];
  onConfirm: () => void;
};

const euros = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

export default function SummaryStep({ state, dispatch, services, hairdressers, onConfirm }: SummaryStepProps) {
  const service = services.flatMap((g) => g.items).find((s) => s.id === state.service);
  const barber = hairdressers.find((h) => h.id === state.barber);

  const dateLabel = state.date
    ? fromISODate(state.date).toLocaleDateString("fr-FR", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      })
    : "—";
  const timeLabel = state.time ? state.time.replace(":", "h") : "—";
  const isSubmitting = state.status === "submitting";

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[10px] tracking-[0.3em] text-neutral-500">ÉTAPE 04</p>
        <h2 className="mt-2 text-4xl font-bold tracking-tight">CONFIRMEZ VOTRE RÉSERVATION</h2>
      </div>

      <dl className="divide-y divide-neutral-800 border-y border-neutral-800">
        <Row label="Prestation" value={service?.name ?? "—"} />
        <Row label="Durée" value={service?.durationMinutes ? `${service.durationMinutes} min` : "—"} />
        <Row label="Coiffeur" value={barber?.name ?? "—"} />
        <Row label="Date" value={dateLabel} />
        <Row label="Heure" value={timeLabel} />
        <Row label="Prix" value={service?.priceCents != null ? euros.format(service.priceCents / 100) : "—"} />
      </dl>

      {state.status === "error" && <p className="text-sm text-red-400">{state.error}</p>}

      <div className="flex items-center justify-between gap-4">
        <button type="button" onClick={() => dispatch({ type: "PREV" })} disabled={isSubmitting}
          className="font-mono text-xs uppercase tracking-widest text-neutral-400 hover:text-neutral-100 disabled:opacity-50">
          Précédent
        </button>
        <button type="button" onClick={onConfirm} disabled={isSubmitting}
          className="inline-flex items-center gap-2 bg-white px-6 py-3 font-mono text-xs uppercase tracking-widest text-black hover:bg-neutral-200 disabled:opacity-50">
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {isSubmitting ? "Réservation…" : "Confirmer la réservation"}
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <dt className="font-mono text-xs uppercase tracking-widest text-neutral-500">{label}</dt>
      <dd className="text-sm text-neutral-100">{value}</dd>
    </div>
  );
}