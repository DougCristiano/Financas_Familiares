import { and, eq, ilike, not, sql } from "drizzle-orm";
import { financialAccounts, payers, transactions } from "@/db/schema";
import { INITIAL_BALANCE_NOTE } from "@/shared/lib/accounts/constants";
import { db } from "@/shared/lib/db";
import { loadLogoOptions } from "@/shared/lib/logo/options";
import { PAYER_ROLE_ADMIN } from "@/shared/lib/payers/constants";

export type AccountData = {
	id: string;
	name: string;
	accountType: string;
	status: string;
	note: string | null;
	logo: string | null;
	initialBalance: number;
	balance: number;
	excludeFromBalance: boolean;
	excludeInitialBalanceFromIncome: boolean;
};

export async function fetchAccountsForUser(
	userId: string,
): Promise<{ accounts: AccountData[]; logoOptions: string[] }> {
	const [accountRows, logoOptions] = await Promise.all([
		db
			.select({
				id: financialAccounts.id,
				name: financialAccounts.name,
				accountType: financialAccounts.accountType,
				status: financialAccounts.status,
				note: financialAccounts.note,
				logo: financialAccounts.logo,
				initialBalance: financialAccounts.initialBalance,
				excludeFromBalance: financialAccounts.excludeFromBalance,
				excludeInitialBalanceFromIncome:
					financialAccounts.excludeInitialBalanceFromIncome,
				balanceMovements: sql<number>`
          coalesce(
            sum(
              case
                when ${transactions.note} = ${INITIAL_BALANCE_NOTE} then 0
                else ${transactions.amount}
              end
            ),
            0
          )
        `,
			})
			.from(financialAccounts)
			.leftJoin(
				transactions,
				and(
					eq(transactions.accountId, financialAccounts.id),
					eq(transactions.userId, userId),
					eq(transactions.isSettled, true),
				),
			)
			.leftJoin(payers, eq(transactions.payerId, payers.id))
			.where(
				and(
					eq(financialAccounts.userId, userId),
					not(ilike(financialAccounts.status, "inativa")),
					sql`(${transactions.id} IS NULL OR ${payers.role} = ${PAYER_ROLE_ADMIN})`,
				),
			)
			.groupBy(
				financialAccounts.id,
				financialAccounts.name,
				financialAccounts.accountType,
				financialAccounts.status,
				financialAccounts.note,
				financialAccounts.logo,
				financialAccounts.initialBalance,
				financialAccounts.excludeFromBalance,
				financialAccounts.excludeInitialBalanceFromIncome,
			),
		loadLogoOptions(),
	]);

	const accounts = accountRows.map((account) => ({
		id: account.id,
		name: account.name,
		accountType: account.accountType,
		status: account.status,
		note: account.note,
		logo: account.logo,
		initialBalance: Number(account.initialBalance ?? 0),
		balance:
			Number(account.initialBalance ?? 0) +
			Number(account.balanceMovements ?? 0),
		excludeFromBalance: account.excludeFromBalance,
		excludeInitialBalanceFromIncome: account.excludeInitialBalanceFromIncome,
	}));

	return { accounts, logoOptions };
}

export async function fetchInactiveForUser(
	userId: string,
): Promise<{ accounts: AccountData[]; logoOptions: string[] }> {
	const [accountRows, logoOptions] = await Promise.all([
		db
			.select({
				id: financialAccounts.id,
				name: financialAccounts.name,
				accountType: financialAccounts.accountType,
				status: financialAccounts.status,
				note: financialAccounts.note,
				logo: financialAccounts.logo,
				initialBalance: financialAccounts.initialBalance,
				excludeFromBalance: financialAccounts.excludeFromBalance,
				excludeInitialBalanceFromIncome:
					financialAccounts.excludeInitialBalanceFromIncome,
				balanceMovements: sql<number>`
          coalesce(
            sum(
              case
                when ${transactions.note} = ${INITIAL_BALANCE_NOTE} then 0
                else ${transactions.amount}
              end
            ),
            0
          )
        `,
			})
			.from(financialAccounts)
			.leftJoin(
				transactions,
				and(
					eq(transactions.accountId, financialAccounts.id),
					eq(transactions.userId, userId),
					eq(transactions.isSettled, true),
				),
			)
			.leftJoin(payers, eq(transactions.payerId, payers.id))
			.where(
				and(
					eq(financialAccounts.userId, userId),
					ilike(financialAccounts.status, "inativa"),
					sql`(${transactions.id} IS NULL OR ${payers.role} = ${PAYER_ROLE_ADMIN})`,
				),
			)
			.groupBy(
				financialAccounts.id,
				financialAccounts.name,
				financialAccounts.accountType,
				financialAccounts.status,
				financialAccounts.note,
				financialAccounts.logo,
				financialAccounts.initialBalance,
				financialAccounts.excludeFromBalance,
				financialAccounts.excludeInitialBalanceFromIncome,
			),
		loadLogoOptions(),
	]);

	const accounts = accountRows.map((account) => ({
		id: account.id,
		name: account.name,
		accountType: account.accountType,
		status: account.status,
		note: account.note,
		logo: account.logo,
		initialBalance: Number(account.initialBalance ?? 0),
		balance:
			Number(account.initialBalance ?? 0) +
			Number(account.balanceMovements ?? 0),
		excludeFromBalance: account.excludeFromBalance,
		excludeInitialBalanceFromIncome: account.excludeInitialBalanceFromIncome,
	}));

	return { accounts, logoOptions };
}

export async function fetchAllAccountsForUser(userId: string): Promise<{
	activeAccounts: AccountData[];
	archivedAccounts: AccountData[];
	logoOptions: string[];
}> {
	const [activeData, archivedData] = await Promise.all([
		fetchAccountsForUser(userId),
		fetchInactiveForUser(userId),
	]);

	return {
		activeAccounts: activeData.accounts,
		archivedAccounts: archivedData.accounts,
		logoOptions: activeData.logoOptions,
	};
}
