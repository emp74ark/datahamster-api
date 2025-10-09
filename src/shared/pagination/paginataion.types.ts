export type PaginationParams = {
  pageNumber?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
};

export type Paginated<T> = {
  total: number;
  results: T[];
};

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}
