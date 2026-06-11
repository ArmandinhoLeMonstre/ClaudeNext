import { barbersGrouped, BookingProps } from "../types";


type HairdressersProps = BookingProps & {barbers: barbersGrouped[]}

const cardClass = (active: boolean) =>
  `flex w-full items-center gap-4 rounded-card border text-left transition-colors ${
    active
      ? "border-foreground bg-foreground text-inverse"
      : "border-border-default text-foreground hover:border-border-hover"
  }`;

const radio = (active: boolean) => (
  <span
    className={`ml-auto h-[18px] w-[18px] shrink-0 rounded-full border ${
      active ? "border-inverse bg-inverse shadow-[inset_0_0_0_3px_#f2efe9]" : "border-border-hover"
    }`}
  />
);

export default function BarberStep({ state, dispatch, barbers }: HairdressersProps) {
  // The design surfaces a full-width "Sans préférence" option below the grid.
  // We only render it if such a barber actually exists in the data, so the POST
  // always receives a real hairdresser id.
  const noPref = barbers.find((b) => /sans pr[ée]f/i.test(b.name));
  const gridBarbers = barbers.filter((b) => b !== noPref);

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-eyebrow text-text-muted">Étape 02</p>
      <h2 className="mt-[11px] mb-9 font-display text-[clamp(1.875rem,4.4vw,2.875rem)] uppercase leading-[0.98] tracking-[-0.01em] text-foreground">
        Choisissez votre barbier
      </h2>

      <div className="grid grid-cols-2 gap-3.5">
        {gridBarbers.map((b) => {
          const active = state.barber === b.id;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => dispatch({ type: "SELECT_BARBER", barber: b.id })}
              className={`${cardClass(active)} px-[18px] py-4`}
            >
              <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full border border-[#2a2a2a] bg-elevated font-mono text-[8px] tracking-[0.18em] text-text-muted">
                PORTRAIT
              </span>
              <span className="text-[17px] font-semibold">{b.name}</span>
              {radio(active)}
            </button>
          );
        })}
      </div>

      {noPref && (
        <button
          type="button"
          onClick={() => dispatch({ type: "SELECT_BARBER", barber: noPref.id })}
          className={`${cardClass(state.barber === noPref.id)} mt-3.5 px-5 py-[18px]`}
        >
          <span className="text-[17px] font-semibold">{noPref.name}</span>
          {radio(state.barber === noPref.id)}
        </button>
      )}
    </div>
  );
}