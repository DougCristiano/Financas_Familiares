import Link from "next/link";
import { Logo } from "@/shared/components/logo";

type NavbarShellProps = {
	logoHref?: string;
	fixed?: boolean;
	children: React.ReactNode;
};

export function NavbarShell({
	logoHref,
	fixed = false,
	children,
}: NavbarShellProps) {
	const positionClass = fixed ? "fixed top-0 left-0 right-0" : "sticky top-0";

	return (
		<header
			className={`${positionClass} z-[60] flex h-14 shrink-0 items-center bg-linear-to-r from-[oklch(40%_0.24_264)] via-primary to-[oklch(63%_0.16_82)] dark:from-[oklch(8%_0.01_0)] dark:via-[oklch(16%_0.05_255)] dark:to-[oklch(28%_0.10_255)] border-b border-white/45`}
		>
			<div className="relative z-10 mx-auto flex h-full w-full max-w-8xl 2xl:max-w-9xl 3xl:max-w-10xl items-center gap-3 px-4 2xl:px-8 3xl:px-12">
				{logoHref ? (
					<Link href={logoHref} className="shrink-0">
						<Logo variant="compact" white />
					</Link>
				) : (
					<Logo variant="compact" white />
				)}
				{children}
			</div>
		</header>
	);
}
