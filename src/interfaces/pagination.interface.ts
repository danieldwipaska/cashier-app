export interface PageMetaData {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
