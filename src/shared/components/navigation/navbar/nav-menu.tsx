"use client";

import { RiDashboardLine, RiMenuLine } from "@remixicon/react";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { CalculatorDialogContent } from "@/shared/components/calculator/calculator-dialog";
import { Button } from "@/shared/components/ui/button";
import { Dialog } from "@/shared/components/ui/dialog";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/shared/components/ui/navigation-menu";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/shared/components/ui/sheet";
import { cn } from "@/shared/utils/ui";
import { MobileLink, MobileSectionLabel } from "./mobile-link";
import { NavDropdown } from "./nav-dropdown";
import { NAV_SECTIONS } from "./nav-items";
import { NavPill } from "./nav-pill";
import { MobileTools, NavToolsDropdown } from "./nav-tools";

const triggerClass =
	"h-auto! px-0! py-0! pb-0.5! bg-transparent! shadow-none! rounded-none! lowercase! text-sm! font-medium! text-white/75! hover:text-white! hover:bg-transparent! focus:bg-transparent! data-[state=open]:text-white! data-[state=open]:bg-transparent! relative! data-[state=open]:border-b-2! data-[state=open]:border-white! focus-visible:ring-0! [&>svg:last-child]:size-3! [&>svg:last-child]:opacity-60! [&>svg:last-child]:ml-0.5! transition-colors! after:absolute! after:bottom-0! after:left-0! after:h-0.5! after:w-full! after:bg-white! after:scale-x-0! hover:after:scale-x-100! data-[state=open]:after:scale-x-100! after:origin-left! after:transition-transform! after:duration-300!";

const triggerActiveClass = "text-white! border-white!";

export function NavMenu() {
	const pathname = usePathname();
	const [sheetOpen, setSheetOpen] = useState(false);
	const [calculatorOpen, setCalculatorOpen] = useState(false);
	const close = () => setSheetOpen(false);
	const openCalculator = () => setCalculatorOpen(true);

	return (
		<>
			{/* Desktop (apenas acima de 930px) */}
			<nav className="hidden min-[931px]:flex items-center ml-auto">
				<NavigationMenu viewport={false}>
					<NavigationMenuList className="gap-6">
						<NavigationMenuItem>
							<NavPill href="/dashboard" preservePeriod>
								Dashboard
							</NavPill>
						</NavigationMenuItem>

						{NAV_SECTIONS.map((section) => {
							const isSectionActive = section.items.some(
								(item) =>
									pathname === item.href ||
									pathname.startsWith(`${item.href}/`),
							);
							return (
								<NavigationMenuItem key={section.label}>
									<NavigationMenuTrigger
										className={cn(
											triggerClass,
											isSectionActive && triggerActiveClass,
											"capitalize",
										)}
									>
										{section.label}
									</NavigationMenuTrigger>
									<NavigationMenuContent>
										<NavDropdown items={section.items} />
									</NavigationMenuContent>
								</NavigationMenuItem>
							);
						})}

						<NavigationMenuItem>
							<NavigationMenuTrigger className={triggerClass}>
								Ferramentas
							</NavigationMenuTrigger>
							<NavigationMenuContent className="group-data-[viewport=false]/navigation-menu:right-0 group-data-[viewport=false]/navigation-menu:left-auto">
								<NavToolsDropdown onOpenCalculator={openCalculator} />
							</NavigationMenuContent>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</nav>

			{/* Mobile - order-[-1] places hamburger before logo visually */}
			<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
				<SheetTrigger asChild>
					<Button
						variant="navbar"
						size="icon-sm"
						className="-order-1 min-[931px]:hidden"
					>
						<RiMenuLine className="size-5" />
						<span className="sr-only">Abrir menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="w-72 p-0 shadow-none">
					<SheetHeader className="border-b border-border/60 p-4">
						<SheetTitle>Menu</SheetTitle>
					</SheetHeader>
					<nav className="p-3 overflow-y-auto">
						<MobileLink
							href="/dashboard"
							icon={<RiDashboardLine className="size-4" />}
							onClick={close}
							preservePeriod
						>
							dashboard
						</MobileLink>

						{NAV_SECTIONS.map((section) => {
							const mobileItems = section.items.filter(
								(item) => !item.hideOnMobile,
							);
							if (mobileItems.length === 0) return null;
							return (
								<div key={section.label}>
									<MobileSectionLabel label={section.label} />
									{mobileItems.map((item) => (
										<MobileLink
											key={item.href}
											href={item.href}
											icon={item.icon}
											onClick={close}
											badge={item.badge}
											preservePeriod={item.preservePeriod}
											description={item.description}
										>
											{item.label}
										</MobileLink>
									))}
								</div>
							);
						})}

						<MobileSectionLabel label="Ferramentas" />
						<MobileTools onClose={close} onOpenCalculator={openCalculator} />
					</nav>
				</SheetContent>
			</Sheet>

			<Dialog open={calculatorOpen} onOpenChange={setCalculatorOpen}>
				<CalculatorDialogContent open={calculatorOpen} />
			</Dialog>
		</>
	);
}
