import { PageMetaData } from 'src/interfaces/pagination.interface';

export function paginate(
  page: number,
  take: number,
  totalData: number,
): PageMetaData {
  const perPage = take;
  const totalItems = totalData;
  const totalPages = Math.ceil(totalData / take);
  const currentPage = page || 1;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return {
    currentPage,
    perPage,
    totalItems,
    totalPages,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage,
  };
}

export function countSkip(take: number, page?: number): number {
  return page ? (page - 1) * take : 0;
}
