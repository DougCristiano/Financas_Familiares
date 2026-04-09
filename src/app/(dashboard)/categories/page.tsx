import { connection } from "next/server";
import { CategoriesPage } from "@/features/categories/components/categories-page";
import {
	type ResolvedCategoriesSearchParams,
	resolveCategoriesPagination,
	resolveCategoriesSearchQuery,
	resolveCategoriesType,
} from "@/features/categories/page-helpers";
import { fetchCategoriesPageForUser } from "@/features/categories/queries";
import { getUserId } from "@/shared/lib/auth/server";

type PageProps = {
	searchParams?: Promise<ResolvedCategoriesSearchParams>;
};

export default async function Page({ searchParams }: PageProps) {
	await connection();
	const userId = await getUserId();
	const resolvedSearchParams = searchParams ? await searchParams : undefined;
	const activeType = resolveCategoriesType(resolvedSearchParams);
	const searchQuery = resolveCategoriesSearchQuery(resolvedSearchParams);
	const pagination = resolveCategoriesPagination(resolvedSearchParams);

	const categoriesData = await fetchCategoriesPageForUser(userId, {
		type: activeType,
		searchQuery,
		page: pagination.page,
		pageSize: pagination.pageSize,
	});

	return (
		<main className="flex flex-col items-start gap-6">
			<CategoriesPage
				activeType={activeType}
				searchQuery={searchQuery}
				categoriesData={categoriesData}
			/>
		</main>
	);
}
