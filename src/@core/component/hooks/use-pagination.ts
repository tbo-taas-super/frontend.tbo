"use client"

import { useState, useEffect, useMemo } from "react"

interface UsePaginationProps<T> {
  data: T[]
  itemsPerPage: number
}

export function usePagination<T>({ data, itemsPerPage }: UsePaginationProps<T>) {
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const paginatedData = useMemo(
    () => data.slice(startIndex, startIndex + itemsPerPage),
    [data, startIndex, itemsPerPage],
  )

  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1)
    }
  }

  // Reset to page 1 when data changes
  useEffect(() => {
    setPage(1)
  }, [data.length])

  return {
    currentPage: page,
    totalPages,
    paginatedData,
    handlePrevious,
    handleNext,
    setPage,
  }
}
