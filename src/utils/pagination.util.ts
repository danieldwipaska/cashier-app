import { PageMetaData } from 'src/interfaces/pagination.interface';

export function paginate(
  page: number,
  take: number,
  totalData: number,
): PageMetaData {
  if (page < 1) throw new Error('Page must be greater than 0');
  if (take < 1) throw new Error('Take must be greater than 0');
  if (totalData < 0) throw new Error('Total data must be non-negative');

  const perPage = take;
  const totalItems = totalData;
  const totalPages = Math.ceil(totalData / take);
  const currentPage = Math.min(page, totalPages || 1);
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
  if (take < 1) throw new Error('Take must be greater than 0');
  if (page !== undefined && page < 1)
    throw new Error('Page must be greater than 0');

  return page ? (page - 1) * take : 0;
}
