import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import React from "react";

const Paginate = ({
  totalPages = 0,
  visiblePage,
  currentPage,
  handlePageChange,
}: {
  totalPages?: number;
  visiblePage: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
}) => {
  const renderPaginationLinks = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - Math.floor(visiblePage / 2));

    for (let i = startPage; i <= Math.min(totalPages, startPage + visiblePage - 1); i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink className="cursor-pointer" onClick={() => handlePageChange(i)} isActive={currentPage === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (startPage > 1) {
      pages.unshift(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    if (startPage + visiblePage - 1 < totalPages) {
      pages.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem className="cursor-pointer">
          <PaginationPrevious onClick={() => handlePageChange(Math.max(1, currentPage - 1))} />
        </PaginationItem>
        {renderPaginationLinks()}
        <PaginationItem className="cursor-pointer">
          <PaginationNext onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default Paginate;
