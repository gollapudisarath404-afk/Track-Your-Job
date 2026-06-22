'use client'

import React, { useState } from 'react'
import { Application } from '@/lib/types'
import { formatDate, timeAgo } from '@/lib/utils'
import StatusBadge from '../ui/StatusBadge'
import { Edit2, Archive, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react'

interface ApplicationTableProps {
  applications: Application[]
  onEdit: (app: Application) => void
  onArchive: (id: string) => void
}

type SortField = 'company' | 'role' | 'status' | 'appliedAt' | 'updatedAt'
type SortOrder = 'asc' | 'desc'

export default function ApplicationTable({
  applications,
  onEdit,
  onArchive
}: ApplicationTableProps) {
  const [sortField, setSortField] = useState<SortField>('appliedAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  const sortedApplications = [...applications].sort((a, b) => {
    let fieldA = a[sortField] || ''
    let fieldB = b[sortField] || ''

    if (sortField === 'company' || sortField === 'role' || sortField === 'status') {
      fieldA = fieldA.toString().toLowerCase()
      fieldB = fieldB.toString().toLowerCase()
    }

    if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1
    if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  const SortHeader = ({ field, label }: { field: SortField; label: string }) => {
    const isSorted = sortField === field
    return (
      <button
        onClick={() => handleSort(field)}
        className="flex items-center gap-1 hover:text-text-primary transition-colors focus:outline-none"
      >
        <span>{label}</span>
        {isSorted ? (
          sortOrder === 'asc' ? (
            <ChevronUp className="w-3.5 h-3.5 text-accent" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-accent" />
          )
        ) : (
          <ArrowUpDown className="w-3.5 h-3.5 text-text-muted" />
        )}
      </button>
    )
  }

  return (
    <div className="w-full overflow-x-auto border border-border rounded-lg bg-bg-surface select-none">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-bg-surface/50 text-xs font-semibold text-text-secondary">
            <th className="px-6 py-4"><SortHeader field="company" label="Company" /></th>
            <th className="px-6 py-4"><SortHeader field="role" label="Role" /></th>
            <th className="px-6 py-4"><SortHeader field="status" label="Status" /></th>
            <th className="px-6 py-4"><SortHeader field="appliedAt" label="Applied" /></th>
            <th className="px-6 py-4 text-text-secondary">Source</th>
            <th className="px-6 py-4"><SortHeader field="updatedAt" label="Last Updated" /></th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sortedApplications.map((app) => (
            <tr
              key={app.id}
              onClick={() => onEdit(app)}
              className="hover:bg-bg-elevated/40 transition-colors duration-100 cursor-pointer"
            >
              <td className="px-6 py-4 font-bold text-text-primary truncate max-w-[180px]">
                {app.company}
              </td>
              <td className="px-6 py-4 text-text-secondary truncate max-w-[200px]">
                {app.role}
              </td>
              <td className="px-6 py-4 shrink-0">
                <StatusBadge status={app.status} />
              </td>
              <td className="px-6 py-4 font-mono text-xs text-text-secondary">
                {formatDate(app.appliedAt)}
              </td>
              <td className="px-6 py-4 text-text-secondary">
                {app.source || '—'}
              </td>
              <td className="px-6 py-4 font-mono text-xs text-text-muted">
                {timeAgo(app.updatedAt)}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onEdit(app)}
                    title="Edit Details"
                    className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded transition-colors focus:outline-none"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onArchive(app.id)}
                    title="Archive"
                    className="p-1.5 text-text-secondary hover:text-status-red hover:bg-bg-elevated rounded transition-colors focus:outline-none"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {sortedApplications.length === 0 && (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-text-secondary bg-bg-surface/10">
                No applications match the filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
