import { and, desc, eq, lt, type SQL, sql } from "drizzle-orm";
import { financialAccounts, payers, transactions } from "@/db/schema";
import { INITIAL_BALANCE_NOTE } from "@/shared/lib/accounts/constants";
import { db } from "@/shared/lib/db";
import { PAYER_ROLE_ADMIN } from "@/shared/lib/payers/constants";

export type AccountSummaryData = {
	openingBalance: number;
	currentBalance: number;
	totalIncomes: number;
	totalExpenses: number;
};

export async function fetchAccountData(userId: string, accountId: string) {
	const account = await db.query.financialAccounts.findFirst({
		columns: {
			id: true,
			name: true,
			accountType: true,
			status: true,
			initialBalance: true,
			logo: true,
			note: true,
		},
		where: and(
			eq(financialAccounts.id, accountId),
			eq(financialAccounts.userId, userId),
		),
	});

	return account;
}

export async function fetchAccountSummary(
	userId: string,
	accountId: string,
	selectedPeriod: string,
): Promise<AccountSummaryData> {
	const [periodSummary] = await db
		.select({
			netAmount: sql<number>`
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
			incomes: sql<number>`
        coalesce(
          sum(
            case
              when ${transactions.note} = ${INITIAL_BALANCE_NOTE} then 0
              when ${transactions.transactionType} = 'Receita' then ${transactions.amount}
              else 0
            end
          ),
          0
        )
      `,
			expenses: sql<number>`
        coalesce(
          sum(
            case
              when ${transactions.note} = ${INITIAL_BALANCE_NOTE} then 0
              when ${transactions.transactionType} = 'Despesa' then ${transactions.amount}
              else 0
            end
          ),
          0
        )
      `,
		})
		.from(transactions)
		.innerJoin(payers, eq(transactions.payerId, payers.id))
		.where(
			and(
				eq(transactions.userId, userId),
				eq(transactions.accountId, accountId),
				eq(transactions.period, selectedPeriod),
				eq(transactions.isSettled, true),
				eq(payers.role, PAYER_ROLE_ADMIN),
			),
		);

	const [previousRow] = await db
		.select({
			previousMovements: sql<number>`
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
		.from(transactions)
		.innerJoin(payers, eq(transactions.payerId, payers.id))
		.where(
			and(
				eq(transactions.userId, userId),
				eq(transactions.accountId, accountId),
				lt(transactions.period, selectedPeriod),
				eq(transactions.isSettled, true),
				eq(payers.role, PAYER_ROLE_ADMIN),
			),
		);

	const account = await fetchAccountData(userId, accountId);
	if (!account) {
		throw new Error("Account not found");
	}

	const initialBalance = Number(account.initialBalance ?? 0);
	const previousMovements = Number(previousRow?.previousMovements ?? 0);
	const openingBalance = initialBalance + previousMovements;
	const netAmount = Number(periodSummary?.netAmount ?? 0);
	const totalIncomes = Number(periodSummary?.incomes ?? 0);
	const totalExpenses = Math.abs(Number(periodSummary?.expenses ?? 0));
	const currentBalance = openingBalance + netAmount;

	return {
		openingBalance,
		currentBalance,
		totalIncomes,
		totalExpenses,
	};
}

export async function fetchAccountLancamentos(
	filters: SQL[],
	settledOnly = true,
) {
	const allFilters = settledOnly
		? [...filters, eq(transactions.isSettled, true)]
		: filters;

	return db.query.transactions.findMany({
		where: and(...allFilters),
		with: {
			payer: true,
			financialAccount: true,
			card: true,
			category: true,
		},
		orderBy: desc(transactions.purchaseDate),
	});
}
