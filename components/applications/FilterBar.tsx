'use client'

import React from 'react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { X } from 'lucide-react'
import { ApplicationStatus, STATUS_CONFIG } from '@/lib/types'

interface FilterBarProps {
  search: string
  setSearch: (s: string) => void
  status: string
  setStatus: (s: string) => void
  source: string
  setSource: (s: string) => void
  sources: string[]
  onClear: () => void
}

export default function FilterBar({
  search,
  setSearch,
  status,
  setStatus,
  source,
  setSource,
  sources,
  onClear
}: FilterBarProps) {
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    ...Object.entries(STATUS_CONFIG).map(([key, val]) => ({
      value: key,
      label: val.label,
    })),
  ]

  const sourceOptions = [
    { value: '', label: 'All Sources' },
    ...sources.map((s) => ({ value: s, label: s })),
  ]

  const hasActiveFilters = search || status || source

  return (
    <div className="space-y-3 mb-6 select-none">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search companies or roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select
            options={sourceOptions}
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={onClear} className="shrink-0">
            Clear Filters
          </Button>
        )}
      </div>

      {/* Dismissible chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center text-xs">
          <span className="text-text-secondary">Active filters:</span>
          {search && (
            <span className="inline-flex items-center gap-1 bg-bg-surface border border-border px-2 py-0.5 rounded text-text-primary">
              Search: &ldquo;{search}&rdquo;
              <button onClick={() => setSearch('')} className="hover:text-accent ml-1">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {status && (
            <span className="inline-flex items-center gap-1 bg-bg-surface border border-border px-2 py-0.5 rounded text-text-primary">
              Status: {STATUS_CONFIG[status as ApplicationStatus]?.label || status}
              <button onClick={() => setStatus('')} className="hover:text-accent ml-1">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {source && (
            <span className="inline-flex items-center gap-1 bg-bg-surface border border-border px-2 py-0.5 rounded text-text-primary">
              Source: {source}
              <button onClick={() => setSource('')} className="hover:text-accent ml-1">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
