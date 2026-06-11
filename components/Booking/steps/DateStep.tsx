import { Calendar } from "@/components/ui/calendar";
import { fromISODate, toISODate } from "@/lib/dateFormat";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import TimeSlots from "./TimeStep";
import { BookingProps } from "../types";

export default function DateStep({ state, dispatch }: BookingProps) {
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
console.log("render → state.date =", state.date);
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
if (loading) {
    return (
      <div className="flex h-72 w-fit items-center justify-center gap-2 rounded-lg border px-12 text-sm text-neutral-400">
        <Loader2 className="h-4 w-4 animate-spin" />
        Chargement des disponibilités…
      </div>
    );
  }

return (
	<div className="w-full rounded-lg border border-neutral-800 p-6">
		<Calendar
		mode="single"
		selected={selected}
		onSelect={handleSelect}
		disabled={isDisabled}
		className="w-full"          // ← no border, no rounded — the card owns that now
		captionLayout="dropdown"
		/>

		{state.date && (
		<div className="mt-4 border-t border-neutral-800 pt-4">
			<TimeSlots state={state} dispatch={dispatch} />
		</div>
		)}
	</div>
	);
}