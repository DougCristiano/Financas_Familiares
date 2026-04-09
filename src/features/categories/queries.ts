import { and, asc, count, eq, ilike } from "drizzle-orm";
import { categories } from "@/db/schema";
import type {
	CategoriesPaginatedData,
	Category,
	CategoryType,
} from "@/features/categories/components/types";
import { buildCategoryNameSearchPattern } from "@/features/categories/page-helpers";
import { db } from "@/shared/lib/db";

export type CategoryData = {
	id: string;
	name: string;
	type: CategoryType;
	icon: string | null;
};

type FetchCategoriesPageInput = {
	type: CategoryType;
	searchQuery: string;
	page: number;
	pageSize: number;
};

const toCategoryData = (category: CategoryData): Category => ({
	id: category.id,
	name: category.name,
	type: category.type,
	icon: category.icon,
});

export async function fetchCategoriesPageForUser(
	userId: string,
	{ type, searchQuery, page, pageSize }: FetchCategoriesPageInput,
): Promise<CategoriesPaginatedData> {
	const searchPattern = buildCategoryNameSearchPattern(searchQuery);
	const filters = [eq(categories.userId, userId), eq(categories.type, type)];

	if (searchPattern) {
		filters.push(ilike(categories.name, searchPattern));
	}

	const whereClause = and(...filters);
	const [{ totalItems }] = await db
		.select({ totalItems: count() })
		.from(categories)
		.where(whereClause);

	const safeTotalItems = Number(totalItems ?? 0);
	const totalPages =
		safeTotalItems > 0 ? Math.ceil(safeTotalItems / pageSize) : 1;
	const currentPage = Math.min(Math.max(page, 1), totalPages);
	const offset = (currentPage - 1) * pageSize;

	const rows = await db
		.select({
			id: categories.id,
			name: categories.name,
			type: categories.type,
			icon: categories.icon,
		})
		.from(categories)
		.where(whereClause)
		.orderBy(asc(categories.name))
		.limit(pageSize)
		.offset(offset);

	const items = rows.map((row) =>
		toCategoryData({
			id: row.id,
			name: row.name,
			type: row.type as CategoryType,
			icon: row.icon,
		}),
	);

	return {
		items,
		pagination: {
			page: currentPage,
			pageSize,
			totalItems: safeTotalItems,
			totalPages,
		},
	};
}
