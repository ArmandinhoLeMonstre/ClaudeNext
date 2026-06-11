import Link from "next/link";

export default function TopBar() {
	return (
		<header className="flex h-16 items-center justify-center border-b border-border-subtle bg-surface">
			<Link href="/" className="opacity-80 transition-opacity hover:opacity-100">
				<img src="/tyler-logo-white.svg" alt="Tyler" className="h-6 w-auto"/>
			</Link>
		</header>
	)
}