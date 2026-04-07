"use client";

import { RiCalculatorLine, RiEyeLine, RiEyeOffLine } from "@remixicon/react";
import { usePrivacyMode } from "@/shared/components/providers/privacy-provider";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/utils/ui";

type NavToolsDropdownProps = {
	onOpenCalculator: () => void;
};

export function NavToolsDropdown({ onOpenCalculator }: NavToolsDropdownProps) {
	const { privacyMode, toggle } = usePrivacyMode();

	return (
		<ul className="grid w-80 gap-0.5 p-2">
			<li>
				<button
					type="button"
					className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all text-foreground hover:bg-accent"
					onClick={onOpenCalculator}
				>
					<span className="size-9 rounded-lg flex items-center justify-center shrink-0 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-sm transition-all">
						<RiCalculatorLine className="size-4" />
					</span>
					<span className="flex flex-col flex-1 text-left">
						<span className="text-sm font-medium leading-tight">calculadora</span>
						<span className="text-xs text-muted-foreground leading-snug mt-0.5">
							faça cálculos rápidos
						</span>
					</span>
				</button>
			</li>
			<li>
				<button
					type="button"
					onClick={toggle}
					className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all text-foreground hover:bg-accent"
				>
					<span
						className={cn(
							"size-9 rounded-lg flex items-center justify-center shrink-0 transition-all group-hover:shadow-sm",
							privacyMode
								? "bg-primary text-primary-foreground"
								: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
						)}
					>
						{privacyMode ? (
							<RiEyeOffLine className="size-4" />
						) : (
							<RiEyeLine className="size-4" />
						)}
					</span>
					<span className="flex flex-col flex-1 text-left">
						<span className="text-sm font-medium leading-tight">privacidade</span>
						<span className="text-xs text-muted-foreground leading-snug mt-0.5">
							oculta valores na tela
						</span>
					</span>
					{privacyMode && (
						<Badge
							variant="secondary"
							className="text-xs px-1.5 py-0 h-5 text-success ml-auto shrink-0"
						>
							ativo
						</Badge>
					)}
				</button>
			</li>
		</ul>
	);
}

type MobileToolsProps = {
	onClose: () => void;
	onOpenCalculator: () => void;
};

export function MobileTools({ onClose, onOpenCalculator }: MobileToolsProps) {
	const { privacyMode, toggle } = usePrivacyMode();

	return (
		<>
			<button
				type="button"
				onClick={() => {
					onClose();
					onOpenCalculator();
				}}
				className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors text-muted-foreground hover:text-foreground hover:bg-accent"
			>
				<span className="text-muted-foreground shrink-0">
					<RiCalculatorLine className="size-4" />
				</span>
				<span className="flex-1 text-left">calculadora</span>
			</button>
			<button
				type="button"
				onClick={() => {
					toggle();
					onClose();
				}}
				className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors text-muted-foreground hover:text-foreground hover:bg-accent"
			>
				<span className="text-muted-foreground shrink-0">
					{privacyMode ? (
						<RiEyeOffLine className="size-4" />
					) : (
						<RiEyeLine className="size-4" />
					)}
				</span>
				<span className="flex-1 text-left">privacidade</span>
				{privacyMode && (
					<Badge
						variant="secondary"
						className="text-xs px-1.5 py-0 h-4 text-success"
					>
						Ativo
					</Badge>
				)}
			</button>
		</>
	);
}
