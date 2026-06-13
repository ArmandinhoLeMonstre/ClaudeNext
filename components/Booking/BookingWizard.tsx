"use client";

import { useReducer } from "react";;
import ServiceStep from "./steps/ServiceStep";
import BarberStep from "./steps/BarberStep";
import DateTimeStep from "./steps/DateStep";
import SummaryStep from "./steps/SummaryStep";
import BookingConfirmation from "./BookingConfirmation";
import WizardNav from "./WizardNav";
import { barbersGrouped, ServiceGrouped } from "./types";
import { bookingReducer, canAdvance, initialState } from "./reducer";

type Props = { services: ServiceGrouped[]; barbers: barbersGrouped[] };

export default function BookingWizard({ services, barbers }: Props) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  async function handleConfirm() {
    	dispatch({ type: "SUBMIT_START" });
		try {
			const res = await fetch("/api/bookings", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					hairdresserId: state.barber,
					serviceId: state.service,
					date: state.date,
					time: state.time,
				}),
			});

			if (res.ok) {
				dispatch({ type: "SUBMIT_SUCCESS", booking: await res.json() });
			} else if (res.status === 409) {
				dispatch({ type: "SUBMIT_ERROR", error: "Ce créneau vient d'être réservé. Choisissez-en un autre." });
			} else {
				dispatch({ type: "SUBMIT_ERROR", error: "Une erreur est survenue. Réessayez." });
			}
		} catch {
			dispatch({ type: "SUBMIT_ERROR", error: "Connexion impossible. Vérifiez votre réseau." });
		}
  }

  // success replaces the whole wizard
  if (state.status === "success" && state.confirmedBooking) {
    return <BookingConfirmation booking={state.confirmedBooking} hairdressers={barbers} />;
  }

  function renderStep() {
    switch (state.step) {
      case 0: return <ServiceStep state={state} dispatch={dispatch} services={services} />;
      case 1: return <BarberStep state={state} dispatch={dispatch} barbers={barbers} />;
      case 2: return <DateTimeStep state={state} dispatch={dispatch} services={services} hairdressers={barbers} />;
      case 3: return (
        <SummaryStep state={state} dispatch={dispatch}
          services={services} hairdressers={barbers} onConfirm={handleConfirm} />
      );
      default: return null;
    }
  }

  return (
    <div className="w-full max-w-2xl">
      {renderStep()}
      {state.step < 3 && (
        <WizardNav
          showPrev={state.step > 0}
          canNext={canAdvance(state)}
          onPrev={() => dispatch({ type: "PREV" })}
          onNext={() => dispatch({ type: "NEXT" })}
        />
      )}
    </div>
  );
}