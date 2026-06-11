import { barbersGrouped, BookingProps } from "../types";


type HairdressersProps = BookingProps & {barbers: barbersGrouped[]}

export default function BarberStep({ state, dispatch, barbers }: HairdressersProps) {
  const selectedBarber = barbers.find((b) => b.id === state.barber);

  return (
    <div>
      <p className="font-mono text-[10px] tracking-[0.3em] text-neutral-500">ÉTAPE 02</p>
      <h2 className="mt-2 text-4xl font-bold tracking-tight">CHOISISSEZ VOTRE BARBIER</h2>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        {barbers.map((b) => {
          const isSelected = state.barber === b.id;
          return (
            <button
              key={b.id}
              onClick={() => dispatch({ type: "SELECT_BARBER", barber: b.id })}
              className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-colors ${
                isSelected
                  ? "border-white bg-neutral-950"
                  : "border-neutral-800 bg-neutral-950/40 hover:border-neutral-700 hover:bg-neutral-900/40"
              }`}
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-black font-mono text-[8px] tracking-widest text-neutral-600">
                PORTRAIT
              </span>

              <span className="flex-1">
                <span className="block text-2xl font-bold leading-none">{b.name}</span>
              </span>

              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  isSelected ? "border-white" : "border-neutral-600"
                }`}
              >
                {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-white" />}
              </span>
            </button>
          );
        })}
      </div>

      {selectedBarber && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white">
            <span className="text-xs font-bold text-black">✓</span>
          </span>
          <span>
            <span className="block font-mono text-[10px] tracking-[0.3em] text-neutral-500">
              BARBIER SÉLECTIONNÉ
            </span>
            <span className="block text-lg font-bold leading-tight">{selectedBarber.name}</span>
          </span>
        </div>
      )}
    </div>
  );
}