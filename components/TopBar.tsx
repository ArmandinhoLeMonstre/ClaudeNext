import Link from "next/link";

export default function TopBar() {
	return (
		<header className="flex h-16 items-center justify-center border-b border-neutral-900 bg-black">
			<Link href="/">
				<img src="/tyler-logo-white.svg" alt="/tyler" className="w-30"/>
			</Link>
		</header>
	)
}