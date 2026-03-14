import { and, desc, eq } from "drizzle-orm";
import { cards, categories, financialAccounts, inboxItems } from "@/db/schema";
import type {
	InboxItem,
	SelectOption,
} from "@/features/inbox/components/types";
import {
	buildOptionSets,
	buildSluggedFilters,
} from "@/features/transactions/page-helpers";
import {
	fetchRecentEstablishments,
	fetchTransactionFilterSources,
} from "@/features/transactions/queries";
import { db } from "@/shared/lib/db";

export async function fetchInboxItems(
	userId: string,
	status: "pending" | "processed" | "discarded" = "pending",
): Promise<InboxItem[]> {
	const items = await db
		.select()
		.from(inboxItems)
		.where(and(eq(inboxItems.userId, userId), eq(inboxItems.status, status)))
		.orderBy(desc(inboxItems.createdAt));

	return items;
}

export async function fetchInboxItemById(
	userId: string,
	itemId: string,
): Promise<InboxItem | null> {
	const [item] = await db
		.select()
		.from(inboxItems)
		.where(and(eq(inboxItems.id, itemId), eq(inboxItems.userId, userId)))
		.limit(1);

	return item ?? null;
}

export async function fetchCategoriesForSelect(
	userId: string,
	type?: string,
): Promise<SelectOption[]> {
	const rows = await db
		.select({ id: categories.id, name: categories.name })
		.from(categories)
		.where(
			type
				? and(eq(categories.userId, userId), eq(categories.type, type))
				: eq(categories.userId, userId),
		)
		.orderBy(categories.name);

	return rows.map((row) => ({ value: row.id, label: row.name }));
}

export async function fetchAccountsForSelect(
	userId: string,
): Promise<SelectOption[]> {
	const rows = await db
		.select({ id: financialAccounts.id, name: financialAccounts.name })
		.from(financialAccounts)
		.where(
			and(
				eq(financialAccounts.userId, userId),
				eq(financialAccounts.status, "ativo"),
			),
		)
		.orderBy(financialAccounts.name);

	return rows.map((row) => ({ value: row.id, label: row.name }));
}

export async function fetchCardsForSelect(
	userId: string,
): Promise<(SelectOption & { lastDigits?: string })[]> {
	const rows = await db
		.select({ id: cards.id, name: cards.name })
		.from(cards)
		.where(and(eq(cards.userId, userId), eq(cards.status, "ativo")))
		.orderBy(cards.name);

	return rows.map((row) => ({ value: row.id, label: row.name }));
}

export async function fetchAppLogoMap(
	userId: string,
): Promise<Record<string, string>> {
	const [userCartoes, userContas] = await Promise.all([
		db
			.select({ name: cards.name, logo: cards.logo })
			.from(cards)
			.where(eq(cards.userId, userId)),
		db
			.select({ name: financialAccounts.name, logo: financialAccounts.logo })
			.from(financialAccounts)
			.where(eq(financialAccounts.userId, userId)),
	]);

	const logoMap: Record<string, string> = {};

	for (const item of [...userCartoes, ...userContas]) {
		if (item.logo) {
			logoMap[item.name.toLowerCase()] = item.logo;
		}
	}

	return logoMap;
}

export async function fetchPendingInboxCount(userId: string): Promise<number> {
	const items = await db
		.select({ id: inboxItems.id })
		.from(inboxItems)
		.where(
			and(eq(inboxItems.userId, userId), eq(inboxItems.status, "pending")),
		);

	return items.length;
}

/**
 * Fetch all data needed for the TransactionDialog in inbox context
 */
export async function fetchInboxDialogData(userId: string): Promise<{
	payerOptions: SelectOption[];
	splitPayerOptions: SelectOption[];
	defaultPayerId: string | null;
	accountOptions: SelectOption[];
	cardOptions: SelectOption[];
	categoryOptions: SelectOption[];
	estabelecimentos: string[];
}> {
	const filterSources = await fetchTransactionFilterSources(userId);
	const sluggedFilters = buildSluggedFilters(filterSources);

	const {
		payerOptions,
		splitPayerOptions,
		defaultPayerId,
		accountOptions,
		cardOptions,
		categoryOptions,
	} = buildOptionSets({
		...sluggedFilters,
		payerRows: filterSources.payerRows,
	});

	const estabelecimentos = await fetchRecentEstablishments(userId);

	return {
		payerOptions,
		splitPayerOptions,
		defaultPayerId,
		accountOptions,
		cardOptions,
		categoryOptions,
		estabelecimentos,
	};
}
