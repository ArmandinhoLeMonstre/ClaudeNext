export function toISODate(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is 0-indexed
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export function fromISODate(iso: string): Date {
	const [year, month, day] = iso.split("-").map(Number);
	return new Date(year, month - 1, day);
}