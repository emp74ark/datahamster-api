export interface PaginationParams {
  pageNumber?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface Paginated<T> {
  total: number;
  results: T[];
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}
