"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useTransition } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import {
	formatPeriod,
	getNextPeriod,
	getPreviousPeriod,
	MONTH_NAMES,
	parsePeriod,
} from "@/shared/utils/period";
import { capitalize } from "@/shared/utils/string";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import LoadingSpinner from "./loading-spinner";
import NavigationButton from "./nav-button";
import { useMonthPeriod } from "./use-month-period";

export default function MonthNavigation() {
	const { period, defaultPeriod, buildHref } = useMonthPeriod();

	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const { year: selectedYear, month: selectedMonth } = parsePeriod(period);
	const { year: currentYear } = parsePeriod(defaultPeriod);

	const prevTarget = buildHref(getPreviousPeriod(period));
	const nextTarget = buildHref(getNextPeriod(period));
	const returnTarget = buildHref(defaultPeriod);
	const isDifferentFromCurrent = period !== defaultPeriod;

	const yearOptions = useMemo(() => {
		const minYear = Math.min(selectedYear, currentYear) - 10;
		const maxYear = Math.max(selectedYear, currentYear) + 10;

		return Array.from({ length: maxYear - minYear + 1 }, (_, index) =>
			String(maxYear - index),
		);
	}, [selectedYear, currentYear]);

	useEffect(() => {
		router.prefetch(prevTarget);
		router.prefetch(nextTarget);
		router.prefetch(returnTarget);
	}, [router, prevTarget, nextTarget, returnTarget]);

	const handleNavigate = (href: string) => {
		startTransition(() => {
			router.replace(href, { scroll: false });
		});
	};

	const handlePeriodChange = (year: number, month: number) => {
		const targetPeriod = formatPeriod(year, month);
		handleNavigate(buildHref(targetPeriod));
	};

	const handleMonthSelect = (value: string) => {
		const month = Number.parseInt(value, 10);
		if (Number.isNaN(month) || month < 1 || month > 12) {
			return;
		}

		handlePeriodChange(selectedYear, month);
	};

	const handleYearSelect = (value: string) => {
		const year = Number.parseInt(value, 10);
		if (Number.isNaN(year)) {
			return;
		}

		handlePeriodChange(year, selectedMonth);
	};

	return (
		<Card className="sticky top-14 z-10 flex w-full flex-row p-4 backdrop-blur-xs supports-backdrop-filter:bg-card/80">
			<div className="flex w-full flex-wrap items-center gap-2 sm:gap-3">
				<NavigationButton
					direction="left"
					disabled={isPending}
					onClick={() => handleNavigate(prevTarget)}
				/>

				<Select
					value={String(selectedMonth)}
					onValueChange={handleMonthSelect}
					disabled={isPending}
				>
					<SelectTrigger
						size="sm"
						className="w-[9rem] capitalize"
						aria-label="Selecionar mês"
					>
						<SelectValue placeholder="Mês" />
					</SelectTrigger>
					<SelectContent align="start">
						{MONTH_NAMES.map((monthName, index) => (
							<SelectItem
								key={monthName}
								value={String(index + 1)}
								className="capitalize"
							>
								{capitalize(monthName)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select
					value={String(selectedYear)}
					onValueChange={handleYearSelect}
					disabled={isPending}
				>
					<SelectTrigger
						size="sm"
						className="w-[6.5rem]"
						aria-label="Selecionar ano"
					>
						<SelectValue placeholder="Ano" />
					</SelectTrigger>
					<SelectContent align="start">
						{yearOptions.map((year) => (
							<SelectItem key={year} value={year}>
								{year}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{isPending && <LoadingSpinner />}

				<NavigationButton
					direction="right"
					disabled={isPending}
					onClick={() => handleNavigate(nextTarget)}
				/>

				<Button
					variant="outline"
					size="sm"
					className="ml-auto"
					disabled={isPending || !isDifferentFromCurrent}
					onClick={() => handleNavigate(returnTarget)}
					aria-label="Redefinir para o mês atual"
				>
					Mês Atual
				</Button>
			</div>
		</Card>
	);
}
