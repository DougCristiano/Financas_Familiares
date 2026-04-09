"use client";

import { useState } from "react";
import { UnsavedChangesDialog } from "@/shared/components/unsaved-changes-dialog";
import { Button } from "@/shared/components/ui/button";
import { DatePicker } from "@/shared/components/ui/date-picker";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/shared/components/ui/dialog";
import { useDialogUnsavedChangesGuard } from "@/shared/hooks/use-dialog-unsaved-changes-guard";
import { Label } from "@/shared/components/ui/label";

type EditPaymentDateDialogProps = {
	trigger: React.ReactNode;
	currentDate: Date;
	onDateChange: (date: Date) => void;
};

export function EditPaymentDateDialog({
	trigger,
	currentDate,
	onDateChange,
}: EditPaymentDateDialogProps) {
	const [open, setOpen] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
	const hasUnsavedChanges =
		selectedDate.getTime() !== new Date(currentDate).getTime();

	const {
		confirmOpen,
		setConfirmOpen,
		requestClose,
		handleDialogOpenChange,
		closeWithoutConfirmation,
	} = useDialogUnsavedChangesGuard({
		hasUnsavedChanges,
		setDialogOpen: setOpen,
	});

	const handleSave = () => {
		onDateChange(selectedDate);
		closeWithoutConfirmation();
	};

	return (
		<>
			<Dialog open={open} onOpenChange={handleDialogOpenChange}>
				<DialogTrigger asChild>{trigger}</DialogTrigger>
				<DialogContent
					className="sm:max-w-md"
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
						<DialogTitle>Editar data de pagamento</DialogTitle>
						<DialogDescription>
							Selecione a data em que o pagamento foi realizado.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="payment-date">Data de pagamento</Label>
							<DatePicker
								id="payment-date"
								value={selectedDate.toISOString().split("T")[0] ?? ""}
								onChange={(value) => {
									if (value) {
										setSelectedDate(new Date(value));
									}
								}}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={requestClose}>
							Cancelar
						</Button>
						<Button type="button" onClick={handleSave}>
							Salvar
						</Button>
					</DialogFooter>
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
