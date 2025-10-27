import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../assets/styles/pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of middle pages
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if near the start
      if (currentPage <= 3) {
        start = 2;
        end = 4;
      }

      // Adjust if near the end
      if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }

      // Add ellipsis if needed
      if (start > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    if (page !== "..." && page !== currentPage) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) {
    return null; // Don't show pagination if only one page
  }

  return (
    <div className="pagination-container">
      <div className="pagination">
        {/* Previous Button */}
        <button
          className={`pagination-btn pagination-arrow ${
            currentPage === 1 ? "disabled" : ""
          }`}
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={18} />
          <span className="pagination-arrow-text">PRÉCÉDENT</span>
        </button>

        {/* Page Numbers */}
        <div className="pagination-numbers">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              className={`pagination-number ${
                page === currentPage ? "active" : ""
              } ${page === "..." ? "ellipsis" : ""}`}
              onClick={() => handlePageClick(page)}
              disabled={page === "..."}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          className={`pagination-btn pagination-arrow ${
            currentPage === totalPages ? "disabled" : ""
          }`}
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          <span className="pagination-arrow-text">SUIVANT</span>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Page Info */}
      <div className="pagination-info">
        Page {currentPage} sur {totalPages}
      </div>
    </div>
  );
};

export default Pagination;
