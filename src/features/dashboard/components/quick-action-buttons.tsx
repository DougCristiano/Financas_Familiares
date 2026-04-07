"use client";

import { RiAddFill, RiTodoLine } from "@remixicon/react";
import { NoteDialog } from "@/features/notes/components/note-dialog";
import { TransactionDialog } from "@/features/transactions/components/dialogs/transaction-dialog/transaction-dialog";
import type { SelectOption } from "@/features/transactions/components/types";
import { Button } from "@/shared/components/ui/button";

type QuickActionButtonsProps = {
	period: string;
	quickActionOptions: {
		payerOptions: SelectOption[];
		splitPayerOptions: SelectOption[];
		defaultPayerId: string | null;
		accountOptions: SelectOption[];
		cardOptions: SelectOption[];
		categoryOptions: SelectOption[];
		estabelecimentos: string[];
	};
};

export function QuickActionButtons({
	period,
	quickActionOptions,
}: QuickActionButtonsProps) {
	return (
		<div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
			<TransactionDialog
				mode="create"
				payerOptions={quickActionOptions.payerOptions}
				splitPayerOptions={quickActionOptions.splitPayerOptions}
				defaultPayerId={quickActionOptions.defaultPayerId}
				accountOptions={quickActionOptions.accountOptions}
				cardOptions={quickActionOptions.cardOptions}
				categoryOptions={quickActionOptions.categoryOptions}
				estabelecimentos={quickActionOptions.estabelecimentos}
				defaultPeriod={period}
				defaultTransactionType="Receita"
				trigger={
					<Button
						size="sm"
						variant="outline"
						className="gap-2 flex-1 sm:flex-none"
					>
						<RiAddFill className="size-4 text-success/80" />
						<span>Nova receita</span>
					</Button>
				}
			/>

			<TransactionDialog
				mode="create"
				payerOptions={quickActionOptions.payerOptions}
				splitPayerOptions={quickActionOptions.splitPayerOptions}
				defaultPayerId={quickActionOptions.defaultPayerId}
				accountOptions={quickActionOptions.accountOptions}
				cardOptions={quickActionOptions.cardOptions}
				categoryOptions={quickActionOptions.categoryOptions}
				estabelecimentos={quickActionOptions.estabelecimentos}
				defaultPeriod={period}
				defaultTransactionType="Despesa"
				trigger={
					<Button
						size="sm"
						variant="outline"
						className="gap-2 flex-1 sm:flex-none"
					>
						<RiAddFill className="size-4 text-destructive/80" />
						<span>Nova despesa</span>
					</Button>
				}
			/>

			<NoteDialog
				mode="create"
				trigger={
					<Button
						size="sm"
						variant="outline"
						className="gap-2 flex-1 sm:flex-none"
					>
						<RiTodoLine className="size-4 text-info/80" />
						<span>Nova anotação</span>
					</Button>
				}
			/>
		</div>
	);
}
