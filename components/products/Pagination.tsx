'use client'

import React from 'react'
import Button from '../ui/Button'
import Select from '../ui/Select'

interface PaginationProps {
  onPrev: () => void
  onNext: () => void
  onLimitChange: (limit: number) => void
  currentPage: number
  limit: number
  hasMore: boolean
  totalProducts?: number
}

export default function Pagination({
  onPrev,
  onNext,
  onLimitChange,
  currentPage,
  limit,
  hasMore,
  totalProducts = 200000
}: PaginationProps) {
  const startRange = (currentPage - 1) * limit + 1
  const endRange = startRange + limit - 1

  const limitOptions = [
    { value: '10', label: '10 per page' },
    { value: '20', label: '20 per page' },
    { value: '50', label: '50 per page' },
    { value: '100', label: '100 per page' },
  ]

  const totalPagesEstimate = Math.ceil(totalProducts / limit)

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 pt-4 border-t border-border select-none text-sm text-text-secondary">
      <div>
        Showing <span className="font-mono text-text-primary">{startRange.toLocaleString()}</span>–
        <span className="font-mono text-text-primary">{Math.min(endRange, totalProducts).toLocaleString()}</span> of{' '}
        <span className="font-mono text-text-primary">{totalProducts.toLocaleString()}</span> products
      </div>

      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={onPrev} disabled={currentPage === 1}>
          ← Previous
        </Button>
        <span className="font-mono text-xs">
          Page <span className="text-text-primary">{currentPage}</span> of ~{totalPagesEstimate.toLocaleString()}
        </span>
        <Button variant="secondary" onClick={onNext} disabled={!hasMore}>
          Next →
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs">Items per page:</span>
        <div className="w-32">
          <Select
            options={limitOptions}
            value={limit.toString()}
            onChange={(e) => onLimitChange(parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  )
}
