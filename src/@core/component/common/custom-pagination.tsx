"use client"

import { Box, Button, Typography } from "@mui/material"
import { ChevronLeft, ChevronRight } from "@mui/icons-material"

interface CustomPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  onPrevious: () => void
  onNext: () => void
  itemName?: string
}

export function CustomPagination({
  currentPage,
  totalPages,
  totalItems,
  onPrevious,
  onNext,
  itemName = "items",
}: CustomPaginationProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}>
      <Button
        variant="outlined"
        size="small"
        onClick={onPrevious}
        disabled={currentPage === 1}
        startIcon={<ChevronLeft />}
      >
        Previous
      </Button>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Page {currentPage} of {totalPages} ({totalItems} total {itemName})
        </Typography>
      </Box>

      <Button
        variant="outlined"
        size="small"
        onClick={onNext}
        disabled={currentPage === totalPages}
        endIcon={<ChevronRight />}
      >
        Next
      </Button>
    </Box>
  )
}
