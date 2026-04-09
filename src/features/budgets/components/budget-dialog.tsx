"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import {
	createBudgetAction,
	updateBudgetAction,
} from "@/features/budgets/actions";
import { CategoryIcon } from "@/features/categories/components/category-icon";
import { PeriodPicker } from "@/shared/components/period-picker";
import { Button } from "@/shared/components/ui/button";
import { CurrencyInput } from "@/shared/components/ui/currency-input";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import { Slider } from "@/shared/components/ui/slider";
import { UnsavedChangesDialog } from "@/shared/components/unsaved-changes-dialog";
import { useControlledState } from "@/shared/hooks/use-controlled-state";
import { useDialogUnsavedChangesGuard } from "@/shared/hooks/use-dialog-unsaved-changes-guard";
import { useFormState } from "@/shared/hooks/use-form-state";
import { formatCurrency } from "@/shared/utils/currency";

import type { Budget, BudgetCategory, BudgetFormValues } from "./types";

interface BudgetDialogProps {
	mode: "create" | "update";
	trigger?: React.ReactNode;
	budget?: Budget;
	categories: BudgetCategory[];
	defaultPeriod: string;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

const DEFAULT_SLIDER_MAX = 100000;
const SLIDER_STEP = 10;

type SliderLimitMode = "default" | "custom";

const toNonNegativeNumber = (value: string | number | null | undefined) => {
	const normalized =
		typeof value === "number"
			? value
			: Number.parseFloat((value ?? "").toString().replace(",", "."));

	return Number.isFinite(normalized) ? Math.max(0, normalized) : 0;
};

const roundUpToSliderStep = (value: number) =>
	Math.ceil(value / SLIDER_STEP) * SLIDER_STEP;

const buildSuggestedSliderMax = (values: number[]) => {
	const highestValue = Math.max(DEFAULT_SLIDER_MAX, ...values);
	return roundUpToSliderStep(highestValue);
};

const buildInitialValues = ({
	budget,
	defaultPeriod,
}: {
	budget?: Budget;
	defaultPeriod: string;
}): BudgetFormValues => ({
	categoryId: budget?.category?.id ?? "",
	period: budget?.period ?? defaultPeriod,
	amount: budget ? (Math.round(budget.amount * 100) / 100).toFixed(2) : "",
});

export function BudgetDialog({
	mode,
	trigger,
	budget,
	categories,
	defaultPeriod,
	open,
	onOpenChange,
}: BudgetDialogProps) {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	// Use controlled state hook for dialog open state
	const [dialogOpen, setDialogOpen] = useControlledState(
		open,
		false,
		onOpenChange,
	);

	const initialState = useMemo(
		() =>
			buildInitialValues({
				budget,
				defaultPeriod,
			}),
		[budget, defaultPeriod],
	);

	// Use form state hook for form management
	const { formState, resetForm, updateField } =
		useFormState<BudgetFormValues>(initialState);
	const [sliderLimitMode, setSliderLimitMode] =
		useState<SliderLimitMode>("default");
	const [customSliderMaxValue, setCustomSliderMaxValue] = useState(
		DEFAULT_SLIDER_MAX.toFixed(2),
	);

	const hasUnsavedChanges = useMemo(
		() => JSON.stringify(formState) !== JSON.stringify(initialState),
		[formState, initialState],
	);

	const {
		confirmOpen,
		setConfirmOpen,
		requestClose,
		handleDialogOpenChange,
		closeWithoutConfirmation,
	} = useDialogUnsavedChangesGuard({
		hasUnsavedChanges,
		isCloseBlocked: isPending,
		setDialogOpen,
	});

	// Reset form when dialog opens
	useEffect(() => {
		if (dialogOpen) {
			resetForm(initialState);
			setErrorMessage(null);

			const initialAmount = toNonNegativeNumber(initialState.amount);
			const initialSpent = toNonNegativeNumber(budget?.spent);
			const shouldStartWithCustomLimit =
				Math.max(initialAmount, initialSpent) > DEFAULT_SLIDER_MAX;

			if (shouldStartWithCustomLimit) {
				setSliderLimitMode("custom");
				setCustomSliderMaxValue(
					buildSuggestedSliderMax([initialAmount, initialSpent]).toFixed(2),
				);
			} else {
				setSliderLimitMode("default");
				setCustomSliderMaxValue(DEFAULT_SLIDER_MAX.toFixed(2));
			}
		}
	}, [budget?.spent, dialogOpen, initialState, resetForm]);

	// Clear error when dialog closes
	useEffect(() => {
		if (!dialogOpen) {
			setErrorMessage(null);
		}
	}, [dialogOpen]);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setErrorMessage(null);

		if (mode === "update" && !budget?.id) {
			const message = "Orçamento inválido.";
			setErrorMessage(message);
			toast.error(message);
			return;
		}

		if (formState.categoryId.length === 0) {
			const message = "Selecione uma categoria.";
			setErrorMessage(message);
			toast.error(message);
			return;
		}

		if (formState.period.length === 0) {
			const message = "Informe o período.";
			setErrorMessage(message);
			toast.error(message);
			return;
		}

		if (formState.amount.length === 0) {
			const message = "Informe o valor limite.";
			setErrorMessage(message);
			toast.error(message);
			return;
		}

		const currentAmount = toNonNegativeNumber(formState.amount);
		if (currentAmount > sliderMax) {
			const message = `O valor do orçamento não pode ser maior que ${formatCurrency(sliderMax)}.`;
			setErrorMessage(message);
			toast.error(message);
			return;
		}

		const payload = {
			categoryId: formState.categoryId,
			period: formState.period,
			amount: formState.amount,
		};

		startTransition(async () => {
			const result =
				mode === "create"
					? await createBudgetAction(payload)
					: await updateBudgetAction({
						id: budget?.id ?? "",
						...payload,
					});

			if (result.success) {
				toast.success(result.message);
				closeWithoutConfirmation();
				resetForm(initialState);
				return;
			}

			setErrorMessage(result.error);
			toast.error(result.error);
		});
	};

	const title = mode === "create" ? "Novo orçamento" : "Editar orçamento";
	const description =
		mode === "create"
			? "Defina um limite de gastos para acompanhar suas despesas."
			: "Atualize os detalhes do orçamento selecionado.";
	const submitLabel =
		mode === "create" ? "Salvar orçamento" : "Atualizar orçamento";
	const disabled = categories.length === 0;
	const sliderValue = toNonNegativeNumber(formState.amount);
	const spentValue = toNonNegativeNumber(budget?.spent);
	const parsedCustomSliderMax = toNonNegativeNumber(customSliderMaxValue);
	const customSliderMax =
		parsedCustomSliderMax > 0
			? Math.max(DEFAULT_SLIDER_MAX, roundUpToSliderStep(parsedCustomSliderMax))
			: DEFAULT_SLIDER_MAX;
	const sliderMax =
		sliderLimitMode === "custom" ? customSliderMax : DEFAULT_SLIDER_MAX;
	const sliderDisplayValue = Math.min(sliderValue, sliderMax);
	const handleBudgetAmountChange = (value: string) => {
		if (value.length === 0) {
			updateField("amount", "");
			return;
		}

		const nextAmount = toNonNegativeNumber(value);
		const clampedAmount = Math.min(nextAmount, sliderMax);
		updateField("amount", clampedAmount.toFixed(2));
	};

	useEffect(() => {
		if (sliderValue > sliderMax) {
			updateField("amount", sliderMax.toFixed(2));
		}
	}, [sliderMax, sliderValue, updateField]);

	const handleSliderLimitModeChange = (value: string) => {
		const nextMode: SliderLimitMode = value === "custom" ? "custom" : "default";

		if (nextMode === "custom") {
			if (customSliderMaxValue.length === 0) {
				setCustomSliderMaxValue(
					buildSuggestedSliderMax([sliderValue, spentValue]).toFixed(2),
				);
			}
			setSliderLimitMode("custom");
			return;
		}

		if (sliderValue > DEFAULT_SLIDER_MAX) {
			updateField("amount", DEFAULT_SLIDER_MAX.toFixed(2));
		}

		setSliderLimitMode("default");
	};

	return (
		<>
			<Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
				{trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
				<DialogContent
					onEscapeKeyDown={(e) => {
						e.preventDefault();
						requestClose();
					}}
					onInteractOutside={(e) => {
						e.preventDefault();
						requestClose();
					}}
				>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>

					{disabled ? (
						<div className="space-y-4">
							<div className="rounded-lg border border-dashed bg-muted/10 p-4 text-sm text-muted-foreground">
								Cadastre pelo menos uma categoria de despesa para criar um
								orçamento.
							</div>
							<DialogFooter>
								<Button type="button" variant="outline" onClick={requestClose}>
									Fechar
								</Button>
							</DialogFooter>
						</div>
					) : (
						<form className="space-y-4" onSubmit={handleSubmit}>
							<div className="space-y-2">
								<Label htmlFor="budget-category">Categoria</Label>
								<Select
									value={formState.categoryId}
									onValueChange={(value) => updateField("categoryId", value)}
								>
									<SelectTrigger id="budget-category" className="w-full">
										<SelectValue placeholder="Selecione uma categoria" />
									</SelectTrigger>
									<SelectContent>
										{categories.map((category) => (
											<SelectItem key={category.id} value={category.id}>
												<CategoryIcon
													name={category.icon ?? undefined}
													className="size-4"
												/>
												<span>{category.name}</span>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="budget-period">Período</Label>
									<PeriodPicker
										value={formState.period}
										onChange={(value) => updateField("period", value)}
										className="w-full"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="budget-amount">Valor limite</Label>
									<div className="space-y-3 rounded-md border p-3">
										<div className="flex items-center justify-between text-sm">
											<span className="text-muted-foreground">
												Limite atual
											</span>
											<span className="font-medium text-foreground">
												{formatCurrency(sliderValue)}
											</span>
										</div>

										<div className="space-y-2">
											<Label htmlFor="budget-amount-input">
												Valor do orçamento
											</Label>
											<CurrencyInput
												id="budget-amount-input"
												value={formState.amount}
												onValueChange={handleBudgetAmountChange}
												placeholder="R$ 0,00"
											/>
										</div>

										<div className="space-y-2">
											<Label htmlFor="budget-slider-limit-mode">
												Teto de orçamento
											</Label>
											<Select
												value={sliderLimitMode}
												onValueChange={handleSliderLimitModeChange}
											>
												<SelectTrigger
													id="budget-slider-limit-mode"
													className="w-full"
												>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="default">
														Padrão ({formatCurrency(DEFAULT_SLIDER_MAX)})
													</SelectItem>
													<SelectItem value="custom">Personalizado</SelectItem>
												</SelectContent>
											</Select>
										</div>

										{sliderLimitMode === "custom" ? (
											<div className="space-y-2">
												<Label htmlFor="budget-slider-max-input">
													Teto máximo personalizado
												</Label>
												<CurrencyInput
													id="budget-slider-max-input"
													value={customSliderMaxValue}
													onValueChange={setCustomSliderMaxValue}
													placeholder="R$ 100.000,00"
												/>
											</div>
										) : null}

										<Slider
											id="budget-amount"
											value={[sliderDisplayValue]}
											min={0}
											max={sliderMax}
											step={SLIDER_STEP}
											onValueChange={(value) =>
												updateField("amount", value[0]?.toFixed(2) ?? "0.00")
											}
										/>

										<div className="flex items-center justify-between text-xs text-muted-foreground">
											<span>{formatCurrency(0)}</span>
											<span>{formatCurrency(sliderMax)}</span>
										</div>
									</div>
								</div>
							</div>

							{errorMessage ? (
								<p className="text-sm font-medium text-destructive">
									{errorMessage}
								</p>
							) : null}

							<DialogFooter>
								<Button
									type="button"
									variant="outline"
									onClick={requestClose}
									disabled={isPending}
								>
									Cancelar
								</Button>
								<Button
									type="submit"
									disabled={isPending}
									className="text-white"
								>
									{isPending ? "Salvando..." : submitLabel}
								</Button>
							</DialogFooter>
						</form>
					)}
				</DialogContent>
			</Dialog>

			<UnsavedChangesDialog
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				onConfirm={closeWithoutConfirmation}
			/>
		</>
	);
}
