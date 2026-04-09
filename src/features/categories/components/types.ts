import type { CategoryType } from "@/shared/lib/categories/constants";

export type { CategoryType } from "@/shared/lib/categories/constants";
export {
	CATEGORY_TYPE_LABEL,
	CATEGORY_TYPES,
} from "@/shared/lib/categories/constants";

export type Category = {
	id: string;
	name: string;
	type: CategoryType;
	icon: string | null;
};

export type CategoriesPaginationState = {
	page: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
};

export type CategoriesPaginatedData = {
	items: Category[];
	pagination: CategoriesPaginationState;
};

export type CategoryFormValues = {
	name: string;
	type: CategoryType;
	icon: string;
};
