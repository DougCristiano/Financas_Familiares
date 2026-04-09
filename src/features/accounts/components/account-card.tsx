"use client";
import {
	RiArrowLeftRightLine,
	RiCloseLine,
	RiFileList2Line,
	RiInformationLine,
	RiPencilLine,
} from "@remixicon/react";
import type React from "react";
import MoneyValues from "@/shared/components/money-values";
import { Card, CardContent, CardFooter } from "@/shared/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/utils/ui";

interface AccountCardProps {
	accountName: string;
	accountType: string;
	balance: number;
	status?: string;
	icon?: React.ReactNode;
	excludeFromBalance?: boolean;
	excludeInitialBalanceFromIncome?: boolean;
	onViewStatement?: () => void;
	onEdit?: () => void;
	onRemove?: () => void;
	onTransfer?: () => void;
	className?: string;
}

export function AccountCard({
	accountName,
	accountType,
	balance,
	status,
	icon,
	excludeFromBalance,
	excludeInitialBalanceFromIncome,
	onViewStatement,
	onEdit,
	onRemove,
	onTransfer,
	className,
}: AccountCardProps) {
	const isInactive = status?.toLowerCase() === "inativa";

	const actions = [
		{
			label: "editar",
			icon: <RiPencilLine className="size-4" aria-hidden />,
			onClick: onEdit,
			className:
				"bg-amber-600 hover:bg-amber-700 text-white rounded px-3 py-1.5",
		},
		{
			label: "extrato",
			icon: <RiFileList2Line className="size-4" aria-hidden />,
			onClick: onViewStatement,
			className: "bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-1.5",
		},
		{
			label: "transferir",
			icon: <RiArrowLeftRightLine className="size-4" aria-hidden />,
			onClick: onTransfer,
			className:
				"bg-green-600 hover:bg-green-700 text-white rounded px-3 py-1.5",
		},
	].filter((action) => typeof action.onClick === "function");

	return (
		<Card className={cn("h-full w-full gap-0 relative", className)}>
			{onRemove && (
				<button
					type="button"
					onClick={onRemove}
					className="absolute top-1 right-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full p-1.5 transition-colors"
					aria-label="Remover conta"
				>
					<RiCloseLine className="size-5" aria-hidden />
				</button>
			)}
			<CardContent className="flex flex-1 flex-col gap-4">
				<div className="flex items-center gap-2">
					{icon ? (
						<div
							className={cn(
								"flex items-center justify-center",
								isInactive && "[&_img]:grayscale [&_img]:opacity-40",
							)}
						>
							{icon}
						</div>
					) : null}
					<h2 className="text-lg font-semibold text-foreground">
						{accountName}
					</h2>

					{(excludeFromBalance || excludeInitialBalanceFromIncome) && (
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="flex items-center">
									<RiInformationLine className="size-5 text-muted-foreground hover:text-foreground transition-colors cursor-help" />
								</div>
							</TooltipTrigger>
							<TooltipContent side="right" className="max-w-xs">
								<div className="space-y-1">
									{excludeFromBalance && (
										<p className="text-xs">
											<strong>Desconsiderado do saldo total:</strong> Esta conta
											não é incluída no cálculo do saldo total geral.
										</p>
									)}
									{excludeInitialBalanceFromIncome && (
										<p className="text-xs">
											<strong>
												Saldo inicial desconsiderado das receitas:
											</strong>{" "}
											O saldo inicial desta conta não é contabilizado como
											receita nas métricas.
										</p>
									)}
								</div>
							</TooltipContent>
						</Tooltip>
					)}
				</div>

				<div className="space-y-2">
					<MoneyValues amount={balance} className="text-3xl" />
					<p className="text-sm text-muted-foreground">{accountType}</p>
				</div>
			</CardContent>

			{actions.length > 0 ? (
				<CardFooter className="flex flex-wrap gap-3 px-6 pt-6 text-sm justify-between">
					{actions.map(({ label, icon, onClick, className }) => (
						<button
							key={label}
							type="button"
							onClick={onClick}
							className={cn(
								"flex items-center gap-1.5 font-medium transition-colors capitalize",
								className,
							)}
							aria-label={`${label} conta`}
						>
							{icon}
							{label}
						</button>
					))}
				</CardFooter>
			) : null}
		</Card>
	);
}
