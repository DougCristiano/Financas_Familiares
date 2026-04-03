"use client";

import { useQuery } from "@tanstack/react-query";
import type { TransactionAttachmentListItem } from "@/features/transactions/attachment-queries";
import { fetchJson } from "@/shared/lib/fetch-json";

export const transactionAttachmentsQueryKey = (transactionId: string) =>
	["transactions", "attachments", transactionId] as const;

export function useTransactionAttachments(transactionId: string) {
	return useQuery({
		queryKey: transactionAttachmentsQueryKey(transactionId),
		queryFn: () =>
			fetchJson<TransactionAttachmentListItem[]>(
				`/api/transactions/${transactionId}/attachments`,
			),
		enabled: Boolean(transactionId),
		staleTime: 30_000,
	});
}
