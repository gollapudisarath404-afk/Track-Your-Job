'use client'

import React from 'react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { LayoutGrid, List } from 'lucide-react'

interface ProductFiltersProps {
  search: string
  setSearch: (s: string) => void
  category: string
  setCategory: (c: string) => void
  categories: string[]
  minPrice: string
  setMinPrice: (p: string) => void
  maxPrice: string
  setMaxPrice: (p: string) => void
  viewMode: 'grid' | 'list'
  setViewMode: (m: 'grid' | 'list') => void
  onClear: () => void
}

export default function ProductFilters({
  search,
  setSearch,
  category,
  setCategory,
  categories,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  viewMode,
  setViewMode,
  onClear
}: ProductFiltersProps) {
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map((c) => ({ value: c, label: c })),
  ]

  const hasActiveFilters = search || category || minPrice || maxPrice

  return (
    <div className="space-y-4 mb-6 select-none bg-bg-surface border border-border rounded-lg p-4">
      <div className="flex flex-col xl:flex-row gap-3">
        {/* Search input */}
        <div className="flex-1">
          <Input
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category select */}
        <div className="w-full md:w-56">
          <Select
            options={categoryOptions}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        {/* Price filter */}
        <div className="flex items-center gap-2 w-full md:w-80">
          <Input
            type="number"
            placeholder="Min Price (₹)"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span className="text-text-muted text-xs">—</span>
          <Input
            type="number"
            placeholder="Max Price (₹)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        {/* View mode toggle + Clear */}
        <div className="flex items-center gap-2 self-end xl:self-auto ml-auto xl:ml-0">
          {hasActiveFilters && (
            <Button variant="ghost" onClick={onClear}>
              Clear
            </Button>
          )}

          <div className="flex items-center border border-border rounded-md overflow-hidden bg-bg-base shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={`p-2 transition-colors duration-100 ${
                viewMode === 'grid'
                  ? 'bg-bg-elevated text-accent'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List view"
              className={`p-2 transition-colors duration-100 ${
                viewMode === 'list'
                  ? 'bg-bg-elevated text-accent'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
