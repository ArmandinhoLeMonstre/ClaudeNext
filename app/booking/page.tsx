import BookingWizard from '@/components/Booking/BookingWizard';
import { getBarbers } from '@/lib/barbers';
import { getServices } from '@/lib/services';

export default async function BookingPage() {
	const services = await getServices()
	const hairsdressers = await getBarbers()

	return (
	<div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#0a0a0a] to-black px-8 pt-11 pb-24 text-foreground">
		<div className="mb-10 w-full max-w-2xl">
			<h1 className="font-display text-[clamp(2.5rem,6vw,3.5rem)] leading-none tracking-[0.01em] text-foreground">Booking</h1>
		</div>

		<BookingWizard services={services} barbers={hairsdressers}/>
	</div>
	)
}