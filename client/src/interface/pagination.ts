export interface PaginationInterface<T> {
  page: number;
  limit: number;
  totalRows: number;
  totalPage: number;
  totalStock?: number;
  remainingAmount?: number;
  totalFee?: number;
  totalIncome?: number;
  totalOutcome?: number;
  totalProfit?: number;
  totalQtyIncome?: number;
  totalQtyOutcome?: number;
  data: T[];
}
