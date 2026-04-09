"use client";

import { usePathname } from "next/navigation";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/utils/ui";
import type { NavItem } from "./nav-items";
import { NavLink } from "./nav-link";

type NavDropdownProps = {
	items: NavItem[];
};

export function NavDropdown({ items }: NavDropdownProps) {
	const pathname = usePathname();

	return (
		<ul className="grid w-80 gap-0.5 p-2">
			{items.map((item) => {
				const isActive =
					pathname === item.href || pathname.startsWith(`${item.href}/`);

				return (
					<li key={item.href}>
						<NavLink
							href={item.href}
							preservePeriod={item.preservePeriod}
							className={cn(
								"group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:scale-[1.01] border-l-2 border-transparent hover:border-primary",
								isActive
									? "bg-primary/8 text-foreground border-l-primary"
									: "text-foreground hover:bg-primary/15",
							)}
						>
							<span
								className={cn(
									"size-9 rounded-lg flex items-center justify-center shrink-0 transition-all",
									isActive
										? "bg-primary text-white shadow-sm"
										: "bg-primary/15 text-white/70 group-hover:bg-primary group-hover:text-white group-hover:shadow-sm",
								)}
							>
								{item.icon}
							</span>
							<span className="flex flex-col min-w-0 flex-1">
								<span className="text-sm font-medium leading-tight">
									{item.label}
								</span>
								{item.description && (
									<span className="text-xs text-muted-foreground leading-snug mt-0.5 truncate">
										{item.description}
									</span>
								)}
							</span>

							{item.badge && item.badge > 0 ? (
								<Badge
									variant="secondary"
									className="text-xs px-1.5 py-0 h-5 min-w-5 shrink-0 ml-auto"
								>
									{item.badge}
								</Badge>
							) : null}
						</NavLink>
					</li>
				);
			})}
		</ul>
	);
}
