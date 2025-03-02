import React from 'react'
import { Pagination } from 'react-bootstrap';

const PaginationControl = ({ currentPage, totalPages, onPageChange }) => {
    return (
      <div className="d-flex justify-content-center py-3">
        <Pagination>
          <Pagination.First 
            onClick={() => onPageChange(1)} 
            disabled={currentPage === 1}
          />
          <Pagination.Prev 
            onClick={() => onPageChange(currentPage - 1)} 
            disabled={currentPage === 1}
          />
          
          {/* Show page numbers */}
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => onPageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          
          <Pagination.Next 
            onClick={() => onPageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
          />
          <Pagination.Last 
            onClick={() => onPageChange(totalPages)} 
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    );
  };

export default PaginationControl