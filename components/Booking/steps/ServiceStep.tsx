import { BookingProps, ServiceGrouped } from "../types";

type ServiceProps = BookingProps & {
  services: ServiceGrouped[];
};

export default function ServiceStep({ state, dispatch, services }: ServiceProps) {

  return (
    <div>
      <p className="font-mono text-[10px] tracking-[0.3em] text-neutral-500">ÉTAPE 01</p>
      <h2 className="mt-2 text-4xl font-bold tracking-tight">CHOISISSEZ VOTRE PRESTATION</h2>

      <div className="mt-7 space-y-8">
        {services.map((group) => (
          <div key={group.group}>
            {/* group header + divider line */}
            <div className="mb-2 flex items-center gap-3">
              <span className="font-mono text-[10px] tracking-[0.3em] text-neutral-500">{group.group}</span>
              <span className="h-px flex-1 bg-neutral-800" />
            </div>

            {group.items.map((s) => {
              const active = state.service === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => dispatch({ type: "SELECT_SERVICE", service: s.id })}
                  className={`flex w-full items-center gap-4 rounded-lg px-2 py-3 text-left transition-colors ${
                    active ? "bg-neutral-900" : "hover:bg-neutral-950"
                  }`}
                >
                  {/* radio */}
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${active ? "border-white" : "border-neutral-600"}`}>
                    {active && <span className="h-2.5 w-2.5 rounded-full bg-white" />}
                  </span>

                  {/* name takes the slack, pushing the rest right */}
                  <span className="flex-1 text-[15px]">{s.name}</span>

                  {/* duration column */}
                  <span className="w-16 text-right font-mono text-xs text-neutral-500">
                    {s.durationMinutes ? `${s.durationMinutes} min` : "—"}
                  </span>

                  {/* price column */}
                  <span className="w-24 text-right">
                    {s.priceCents == null ? (
                      <span className="font-mono text-[10px] tracking-wider text-neutral-500">SUR DEMANDE</span>
                    ) : (
                      <span className="text-lg font-bold">€{s.priceCents / 100}</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}