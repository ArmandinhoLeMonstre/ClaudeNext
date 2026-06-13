import { Action, BookingState } from "./types";

export const initialState: BookingState = {
  step: 0, service: null, barber: null, date: null, time: null,
  status: "idle", error: null, confirmedBooking: null,
};

export function bookingReducer(state: BookingState, action: Action): BookingState {
  switch (action.type) {
    case "SELECT_SERVICE":
      // service duration drives slot length → invalidate any chosen date/time on change
      if (action.service === state.service) return state;
      return { ...state, service: action.service, date: null, time: null };
    case "SELECT_BARBER":
      // a different barber has a different schedule → invalidate chosen date/time on change
      if (action.barber === state.barber) return state;
      return { ...state, barber: action.barber, date: null, time: null };
    case "SELECT_DATE":    return { ...state, date: action.date, time: null }; // clear time
    case "SELECT_TIME":    return { ...state, time: action.time };
    case "NEXT":           return { ...state, step: state.step + 1 };
    case "PREV":           return { ...state, step: state.step - 1 };
    case "GOTO":           return { ...state, step: action.step };
    case "SUBMIT_START":   return { ...state, status: "submitting", error: null };
    case "SUBMIT_SUCCESS": return { ...state, status: "success", confirmedBooking: action.booking };
    case "SUBMIT_ERROR":   return { ...state, status: "error", error: action.error };
    default:               return state;
  }
}

// derived gating — pure and testable, lives next to the reducer
export function canAdvance(state: BookingState): boolean {
  switch (state.step) {
    case 0: return state.service !== null;
    case 1: return state.barber !== null;
    case 2: return state.date !== null && state.time !== null;
    default: return true;
  }
}

// has the user already made the choice that belongs to this step?
export function isStepComplete(state: BookingState, step: number): boolean {
  switch (step) {
    case 0: return state.service !== null;
    case 1: return state.barber !== null;
    case 2: return state.date !== null && state.time !== null;
    default: return false; // confirmation has nothing to "choose"
  }
}

// you can jump to a step if it's the current one, or everything before it is chosen
export function isStepAccessible(state: BookingState, step: number): boolean {
  if (step === state.step) return true;
  for (let i = 0; i < step; i++) {
    if (!isStepComplete(state, i)) return false;
  }
  return true;
}