import {
	RiArrowLeftDoubleLine,
	RiArrowLeftSLine,
	RiArrowRightDoubleLine,
	RiArrowRightSLine,
} from "@remixicon/react";
import { CATEGORIES_PAGE_SIZE_OPTIONS } from "@/features/categories/page-helpers";
import { Button } from "@/shared/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import type { CategoriesPaginationState } from "./types";

type CategoriesPaginationProps = {
	pagination: CategoriesPaginationState;
	isPending: boolean;
	onPageChange: (page: number) => void;
	onPageSizeChange: (pageSize: number) => void;
};

export function CategoriesPagination({
	pagination,
	isPending,
	onPageChange,
	onPageSizeChange,
}: CategoriesPaginationProps) {
	if (pagination.totalItems === 0) {
		return null;
	}

	const canPreviousPage = pagination.page > 1;
	const canNextPage = pagination.page < pagination.totalPages;

	return (
		<div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex items-center gap-2">
				<span className="text-sm text-muted-foreground">
					{pagination.totalItems} categorias
				</span>
				<Select
					disabled={isPending}
					value={pagination.pageSize.toString()}
					onValueChange={(value) => onPageSizeChange(Number(value))}
				>
					<SelectTrigger className="w-max">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{CATEGORIES_PAGE_SIZE_OPTIONS.map((option) => (
							<SelectItem key={option} value={option.toString()}>
								{option} itens
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex items-center gap-2">
				<span className="text-sm text-muted-foreground">
					Página {pagination.page} de {pagination.totalPages}
				</span>
				<div className="flex items-center gap-1">
					<Button
						variant="outline"
						size="icon-sm"
						onClick={() => onPageChange(1)}
						disabled={!canPreviousPage || isPending}
						aria-label="Primeira página"
					>
						<RiArrowLeftDoubleLine className="size-4" />
					</Button>
					<Button
						variant="outline"
						size="icon-sm"
						onClick={() => onPageChange(pagination.page - 1)}
						disabled={!canPreviousPage || isPending}
						aria-label="Página anterior"
					>
						<RiArrowLeftSLine className="size-4" />
					</Button>
					<Button
						variant="outline"
						size="icon-sm"
						onClick={() => onPageChange(pagination.page + 1)}
						disabled={!canNextPage || isPending}
						aria-label="Próxima página"
					>
						<RiArrowRightSLine className="size-4" />
					</Button>
					<Button
						variant="outline"
						size="icon-sm"
						onClick={() => onPageChange(pagination.totalPages)}
						disabled={!canNextPage || isPending}
						aria-label="Última página"
					>
						<RiArrowRightDoubleLine className="size-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
