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
	const quickActionButtonClass =
		"flex-1 min-w-0 justify-center gap-2 px-2 min-[480px]:px-3";
	const quickActionTextClass = "hidden min-[520px]:inline";

	return (
		<div className="flex w-full items-center gap-2">
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
						className={quickActionButtonClass}
						aria-label="Nova receita"
						title="Nova receita"
					>
						<RiAddFill className="size-4 text-success/80" />
						<span className={quickActionTextClass}>Nova receita</span>
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
						className={quickActionButtonClass}
						aria-label="Nova despesa"
						title="Nova despesa"
					>
						<RiAddFill className="size-4 text-destructive/80" />
						<span className={quickActionTextClass}>Nova despesa</span>
					</Button>
				}
			/>

			<NoteDialog
				mode="create"
				trigger={
					<Button
						size="sm"
						variant="outline"
						className={quickActionButtonClass}
						aria-label="Nova anotação"
						title="Nova anotação"
					>
						<RiTodoLine className="size-4 text-info/80" />
						<span className={quickActionTextClass}>Nova anotação</span>
					</Button>
				}
			/>
		</div>
	);
}
