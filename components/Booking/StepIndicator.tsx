import { Check } from "lucide-react";
import { Fragment } from "react";
import { BookingProps } from "./types";
import { isStepAccessible, isStepComplete } from "./reducer";

const STEPS = ["Prestation", "Barbier", "Date & heure", "Confirmation"];

export default function StepIndicator({ state, dispatch }: BookingProps) {
  return (
    <nav aria-label="Étapes de réservation" className="mb-9 flex items-center">
      {STEPS.map((label, i) => {
        const current = i === state.step;
        const complete = isStepComplete(state, i) && !current;
        const accessible = isStepAccessible(state, i);
        const num = String(i + 1).padStart(2, "0");

        return (
          <Fragment key={label}>
            <button
              type="button"
              disabled={!accessible}
              aria-current={current ? "step" : undefined}
              onClick={() => dispatch({ type: "GOTO", step: i })}
              className={`group flex items-center gap-2.5 ${accessible ? "cursor-pointer" : "cursor-not-allowed"}`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] transition-colors ${
                  current
                    ? "border-foreground bg-foreground text-inverse"
                    : complete
                      ? "border-foreground text-foreground group-hover:bg-foreground group-hover:text-inverse"
                      : accessible
                        ? "border-border-default text-foreground group-hover:border-border-hover"
                        : "border-border-subtle text-text-muted"
                }`}
              >
                {complete ? <Check className="size-4" /> : num}
              </span>

              <span
                className={`hidden font-mono text-[10px] uppercase tracking-label transition-colors sm:inline ${
                  current
                    ? "text-foreground"
                    : accessible
                      ? "text-text-muted group-hover:text-foreground"
                      : "text-text-muted/60"
                }`}
              >
                {label}
              </span>
            </button>

            {i < STEPS.length - 1 && (
              <span className={`mx-2 h-px flex-1 ${complete ? "bg-foreground/40" : "bg-border-default"}`} />
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
