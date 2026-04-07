"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/shared/utils/ui";
import { NavLink } from "./nav-link";

type NavPillProps = {
	href: string;
	preservePeriod?: boolean;
	children: React.ReactNode;
};

export function NavPill({ href, preservePeriod, children }: NavPillProps) {
	const pathname = usePathname();

	const isActive =
		href === "/dashboard"
			? pathname === href
			: pathname === href || pathname.startsWith(`${href}/`);

	return (
		<NavLink
			href={href}
			preservePeriod={preservePeriod}
			className={cn(
				"relative lowercase text-sm font-medium pb-0.5 transition-colors",
				"border-b-2 border-transparent",
				isActive
					? "text-white border-white"
					: "text-white/75 hover:text-white hover:border-white/60",
			)}
		>
			{children}
		</NavLink>
	);
}
