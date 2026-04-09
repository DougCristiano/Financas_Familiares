import {
	CATEGORY_TYPES,
	type CategoryType,
} from "@/shared/lib/categories/constants";

export type ResolvedCategoriesSearchParams =
	| Record<string, string | string[] | undefined>
	| undefined;

export const CATEGORIES_DEFAULT_PAGE_SIZE = 10;
export const CATEGORIES_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export const getSingleParam = (
	params: ResolvedCategoriesSearchParams,
	key: string,
): string | null => {
	const value = params?.[key];
	if (!value) {
		return null;
	}

	return Array.isArray(value) ? (value[0] ?? null) : value;
};

export const resolveCategoriesType = (
	params: ResolvedCategoriesSearchParams,
): CategoryType => {
	const typeParam = getSingleParam(params, "type");
	if (!typeParam) {
		return CATEGORY_TYPES[0];
	}

	return CATEGORY_TYPES.includes(typeParam as CategoryType)
		? (typeParam as CategoryType)
		: CATEGORY_TYPES[0];
};

export const resolveCategoriesSearchQuery = (
	params: ResolvedCategoriesSearchParams,
): string => {
	const rawQuery = getSingleParam(params, "q") ?? "";
	return rawQuery.trim();
};

export const resolveCategoriesPagination = (
	params: ResolvedCategoriesSearchParams,
): { page: number; pageSize: number } => {
	const pageParam = Number.parseInt(getSingleParam(params, "page") ?? "", 10);
	const pageSizeParam = Number.parseInt(
		getSingleParam(params, "pageSize") ?? "",
		10,
	);

	const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
	const pageSize = CATEGORIES_PAGE_SIZE_OPTIONS.includes(pageSizeParam)
		? pageSizeParam
		: CATEGORIES_DEFAULT_PAGE_SIZE;

	return { page, pageSize };
};

export const buildCategoryNameSearchPattern = (
	searchQuery: string,
): string | null => {
	const normalized = searchQuery.trim();
	if (normalized.length === 0) {
		return null;
	}

	// Troca espaços por coringa para casar termos intermediários.
	const wildcardQuery = normalized.replace(/\s+/g, "%");
	return `%${wildcardQuery}%`;
};
