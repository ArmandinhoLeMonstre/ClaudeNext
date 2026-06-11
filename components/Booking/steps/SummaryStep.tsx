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
    <div>
      <p className="font-mono text-[10px] uppercase tracking-eyebrow text-text-muted">Étape 04</p>
      <h2 className="mt-[11px] mb-9 font-display text-[clamp(1.875rem,4.4vw,2.875rem)] uppercase leading-[0.98] tracking-[-0.01em] text-foreground">
        Confirmez votre réservation
      </h2>

      <dl className="border-b border-border-default">
        <Row label="Prestation" value={service?.name ?? "—"} />
        <Row label="Durée" value={service?.durationMinutes ? `${service.durationMinutes} min` : "—"} />
        <Row label="Coiffeur" value={barber?.name ?? "—"} />
        <Row label="Date" value={dateLabel} />
        <Row label="Heure" value={timeLabel} />
        <Row label="Prix" value={service?.priceCents != null ? euros.format(service.priceCents / 100) : "—"} />
      </dl>

      {state.status === "error" && <p className="mt-4 text-sm text-accent-danger">{state.error}</p>}

      <div className="mt-[34px] flex items-center justify-between gap-4">
        <button type="button" onClick={() => dispatch({ type: "PREV" })} disabled={isSubmitting}
          className="py-1.5 font-mono text-[11px] uppercase tracking-label text-text-muted transition-colors hover:text-foreground disabled:opacity-50">
          Précédent
        </button>
        <button type="button" onClick={onConfirm} disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-card bg-foreground px-[30px] py-[15px] font-mono text-xs uppercase tracking-[0.15em] text-inverse transition-colors disabled:opacity-50">
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {isSubmitting ? "Réservation…" : "Confirmer la réservation"}
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-border-default py-4">
      <dt className="shrink-0 font-mono text-[10px] uppercase tracking-[0.24em] text-text-muted">{label}</dt>
      <dd className="text-right text-[15px] text-foreground">{value}</dd>
    </div>
  );
}