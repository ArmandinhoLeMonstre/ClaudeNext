import { db } from "@/lib/db";
import { services, availabilities, bookings } from "@/lib/db/schema";
import { fromISODate, toISODate } from "@/lib/dateFormat";
import { and, eq, ne, gte, lt } from "drizzle-orm";

const SLOT_INTERVAL_MINUTES = 30; // how far apart candidate start times are

type SlotInput = { hairdresserId: string; serviceId: string; date: string };

export async function getAvailableSlots({ hairdresserId, serviceId, date }: SlotInput) {
  // 1. service duration drives how long each slot occupies
  const [service] = await db.select().from(services).where(eq(services.id, serviceId));
  if (!service || service.durationMinutes == null) return [];
  const duration = service.durationMinutes;
  // fetch simple des services pour avoir la duree

  // 2. the barber's working window(s) for this weekday (0=Sun..6=Sat, matches getDay())
  const weekday = fromISODate(date).getDay();
  const windows = await db
    .select()
    .from(availabilities)
    .where(and(eq(availabilities.hairdresserId, hairdresserId), eq(availabilities.weekday, weekday)));
  if (windows.length === 0) return []; // not working that day
  // Regarde si ce jour si (en int) le hairedresser a des horaires dans la table,
  // si oui, jour de taff donc -> dispo, sinon aucun creneau disponible

  // 3. existing bookings that day → busy ranges
  const dayStart = new Date(`${date}T00:00:00`);
  const dayEnd = new Date(`${date}T23:59:59`); // pour selectionner les 24 h de la journee du slot
  const booked = await db
    .select({ startsAt: bookings.startsAt, endsAt: bookings.endsAt })
    .from(bookings) // on reg dans la table des rdv
    .where(
      and(
        eq(bookings.hairdresserId, hairdresserId), // pour ce coiffeur
        ne(bookings.status, "cancelled"), // ne -> not equal donc si un slot est la mais il est cancel, il va quand meme apparaitre
        gte(bookings.startsAt, dayStart), // day start, minuit debut journee
        lt(bookings.startsAt, dayEnd), // day end, 23h59 fin de journee
      ),
    );
  const busy = booked.map((b) => ({
    start: b.startsAt.getHours() * 60 + b.startsAt.getMinutes(),
    end: b.endsAt.getHours() * 60 + b.endsAt.getMinutes(),
  })); // convertisseur en minute qui du coup fais de plages horaires de minutes pour pas avoir a comparer les dates.
  // cad -> booked possede les slots, on la map donc on prend 1 par 1, on covertis par exemple 10:00 en 10x 60 = 600 minutes.
  // et 10:30 c'est 10 x 60 + le get minutes de 30 donc 630 min. on a un slot de 600 a 630 => ({600, 630})

  // hide past slots if the chosen day is today
  const now = new Date();
  const isToday = toISODate(now) === date;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  // patch pour si il veut prendre slot le jour meme, apres on check l'heur actuelle ou il veut book et on propose pas les heures avant
  // ex -> il est 14h, on propose pas le slot de 10h de la journee actuelle, mais si isToday est false, on montre les slots de toute une journee

  // 4. step through each window, keep starts that fit and don't overlap a booking
  const slots: string[] = [];
  for (const w of windows) {
    const open = toMinutes(w.startTime);   // "10:00:00" → 600
    const close = toMinutes(w.endTime);    // "18:00:00" → 1080
	// tant que open et duration inferieur a close, donc open c debut du shift du coiffeur et close fin du shift.
	// pk t + duration, psk si un service est de 60 min, on peut book max jusqu'a 17h, t + duration = 18h.
	// si un service est de 30 min, on peut book jsqu'a 17h30 car t + duration = 18h
    for (let t = open; t + duration <= close; t += SLOT_INTERVAL_MINUTES) {
      if (isToday && t <= nowMinutes) 
		continue; // check si on book jour meme, cf en haut

      const overlaps = busy.some((b) => t < b.end && t + duration > b.start); // some c une fct javascript qui dit, est-ce que au moins un element passe ce test
	  // donc si a un moment donne, t qui en general est une duree qui avance de 30 min par iteration, rentre dans une intervale b.end et b.start, donc un slot en gros,
	  // overlaps sera true, et on push pas le t dans slots donc indisponible (car !overlaps)
      if (!overlaps) 
		slots.push(toHHMM(t));
    }
  }
  return slots;
}

function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
function toHHMM(min: number) {
  const h = Math.floor(min / 60), m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}