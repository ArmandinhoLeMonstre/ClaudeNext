import { BookingProps, ServiceGrouped } from "../types";

type ServiceProps = BookingProps & {
  services: ServiceGrouped[];
};

export default function ServiceStep({ state, dispatch, services }: ServiceProps) {

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-eyebrow text-text-muted">Étape 01</p>
      <h2 className="mt-[11px] mb-9 font-display text-[clamp(1.875rem,4.4vw,2.875rem)] uppercase leading-[0.98] tracking-[-0.01em] text-foreground">
        Choisissez votre prestation
      </h2>

      <div className="space-y-6">
        {services.map((group) => (
          <div key={group.group}>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-eyebrow text-text-muted">{group.group}</p>

            <div className="flex flex-col gap-2.5">
              {group.items.map((s) => {
                const active = state.service === s.id;
                const meta =
                  s.durationMinutes != null && s.priceCents != null
                    ? `${s.durationMinutes} MIN — ${s.priceCents / 100} €`
                    : "SUR DEMANDE";
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => dispatch({ type: "SELECT_SERVICE", service: s.id })}
                    className={`flex w-full items-center justify-between gap-4 rounded-card border px-[22px] py-[18px] text-left transition-colors ${
                      active
                        ? "border-foreground bg-foreground text-inverse"
                        : "border-border-default text-foreground hover:border-border-hover"
                    }`}
                  >
                    <span className="text-base font-medium">{s.name}</span>

                    <span
                      className={`shrink-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-meta ${
                        active ? "text-inverse/55" : "text-text-muted"
                      }`}
                    >
                      {meta}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}