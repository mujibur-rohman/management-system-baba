export interface PaginationInterface<T> {
  page: number;
  limit: number;
  totalRows: number;
  totalPage: number;
  totalStock?: number;
  data: T[];
}
