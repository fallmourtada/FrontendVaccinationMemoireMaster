import { useState, useMemo } from 'react';

interface UsePaginationProps<T> {
  data: T[];
  itemsPerPage?: number;
}

export function usePagination<T>({ data, itemsPerPage = 10 }: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  // Reset à la page 1 si la page actuelle dépasse le total
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  return {
    currentPage,
    totalPages,
    currentData,
    setCurrentPage,
    totalItems: data.length,
    itemsPerPage,
    startIndex: (currentPage - 1) * itemsPerPage + 1,
    endIndex: Math.min(currentPage * itemsPerPage, data.length),
  };
}