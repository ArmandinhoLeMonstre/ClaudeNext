import type { bookings, Service } from "@/lib/db/schema";
export type Booking = typeof bookings.$inferSelect;

export type BookingState = {
	step: number;
	barber: string | null;
	service: string | null;
	date: string | null;
	time: string | null;
	status: "idle" | "submitting" | "success" | "error"; // ← new
  	error: string | null;                                  // ← new
  	confirmedBooking: Booking | null;
}

export type Action = 
	| { type: "SELECT_BARBER"; barber: string }
	| { type: "SELECT_SERVICE"; service: string }
	| { type: "SELECT_DATE"; date: string }
	| { type: "SELECT_TIME"; time: string }
	| { type: "SUBMIT_START" }
	| { type: "SUBMIT_SUCCESS"; booking: Booking }
	| { type: "SUBMIT_ERROR"; error: string }
	| { type: 'NEXT'}
	| { type: 'PREV'};

export type ServiceGrouped = {
  group: string;
  items: Service[];
};

export type barbersGrouped = {
	id: string;
    name: string;
    active: boolean;
    createdAt: Date;
}

export type BookingProps = {
	state: BookingState;
	dispatch: React.Dispatch<Action>;
};