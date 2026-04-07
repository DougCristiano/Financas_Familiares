"use client";

import { usePathname } from "next/navigation";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/utils/ui";
import { NavLink } from "./nav-link";

type MobileLinkProps = {
	href: string;
	icon: React.ReactNode;
	children: React.ReactNode;
	onClick?: () => void;
	badge?: number;
	preservePeriod?: boolean;
	description?: string;
};

export function MobileLink({
	href,
	icon,
	children,
	onClick,
	badge,
	preservePeriod,
	description,
}: MobileLinkProps) {
	const pathname = usePathname();

	const isActive =
		href === "/dashboard"
			? pathname === href
			: pathname === href || pathname.startsWith(`${href}/`);

	return (
		<NavLink
			href={href}
			preservePeriod={preservePeriod}
			onClick={onClick}
			className={cn(
				"group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
				"text-foreground hover:bg-accent",
				isActive && "bg-primary/8",
			)}
		>
			<span
				className={cn(
					"size-8 rounded-lg flex items-center justify-center shrink-0 transition-all",
					isActive
						? "bg-primary text-primary-foreground shadow-sm"
						: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-sm",
				)}
			>
				{icon}
			</span>
			<span className="flex-1 flex flex-col gap-0">
				<span className="font-medium leading-tight">{children}</span>
				{description && (
					<span className="text-xs text-muted-foreground leading-snug mt-0.5">
						{description}
					</span>
				)}
			</span>
			{badge && badge > 0 ? (
				<Badge
					variant="secondary"
					className="text-xs px-1.5 py-0 h-5 shrink-0 ml-auto"
				>
					{badge}
				</Badge>
			) : null}
		</NavLink>
	);
}

export function MobileSectionLabel({ label }: { label: string }) {
	return (
		<p className="mt-3 mb-1 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
			{label}
		</p>
	);
}
