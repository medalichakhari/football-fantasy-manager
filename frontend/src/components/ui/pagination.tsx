import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
  showInfo = true,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalPages <= 1) {
    return null;
  }

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages =
    totalPages <= 7
      ? Array.from({ length: totalPages }, (_, i) => i + 1)
      : getVisiblePages();

  return (
    <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => {
            if (page === "...") {
              return (
                <span key={`dots-${index}`} className="px-2 py-1 text-gray-500">
                  ...
                </span>
              );
            }

            return (
              <Button
                key={page}
                variant={
                  Number(currentPage) === Number(page) ? "default" : "outline"
                }
                size="sm"
                onClick={() => onPageChange(Number(page))}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {showInfo && (
        <span className="text-sm text-gray-500">
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, totalCount)} of {totalCount} items
        </span>
      )}
    </div>
  );
};
