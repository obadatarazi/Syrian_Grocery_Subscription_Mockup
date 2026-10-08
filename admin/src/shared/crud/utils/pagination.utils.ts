export function paginateList<T>(items: T[], page: number, pageSize: number): T[] {
  const safePage = Math.max(page, 1);
  const start = (safePage - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function getTotalPages(totalItems: number, pageSize: number): number {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

export function createPaginationMeta(totalItems: number, page: number, pageSize: number) {
  const totalPages = getTotalPages(totalItems, pageSize);
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, totalItems);

  return {
    page: safePage,
    pageSize,
    totalItems,
    totalPages,
    start,
    end,
  };
}
