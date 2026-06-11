import BookingWizard from '@/components/Booking/bookingWizard';
import { getBarbers } from '@/lib/barbers';
import { getServices } from '@/lib/services';

export default async function BookingPage() {
	const services = await getServices()
	const hairsdressers = await getBarbers()

	return (
	<div className="min-h-screen from-neutral-950 to-black text-neutral-100 flex flex-col items-center px-6 py-16 sm:py-24">
		<div className="w-full max-w-2xl mb-10">
			<h1 className="text-5xl font-bold tracking-tight">Booking</h1>
		</div>

		<BookingWizard services={services} hairdressers={hairsdressers}/>
	</div>
	)
}