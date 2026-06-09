import { Pagination as PaginationComponent } from "./Pagination";
import { TablePagination as TablePaginationComponent } from "./TablePagination";

export const Pagination = PaginationComponent;
export const TablePagination = TablePaginationComponent;
export { DEFAULT_PAGE_SIZE_OPTIONS } from "./types";
export type {
  PaginationProps,
  PaginationVariant,
  TablePaginationProps,
} from "./types";
