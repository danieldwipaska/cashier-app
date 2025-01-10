export default interface Response<T> {
  statusCode: number;
  message: string;
  error?: string;
  data?: T;
  accessToken?: string;
  refreshToken?: string;
  pageMetaData?: {
    currentPage: number;
    nextPage: number | null;
    prevPage: number | null;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
}
