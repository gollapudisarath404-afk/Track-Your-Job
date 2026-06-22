import React from 'react'
import { Application } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import StatusBadge from '../ui/StatusBadge'
import { Edit2, Archive } from 'lucide-react'

interface ApplicationCardProps {
  application: Application
  onEdit: (app: Application) => void
  onArchive: (id: string) => void
}

export default function ApplicationCard({ application, onEdit, onArchive }: ApplicationCardProps) {
  return (
    <div
      onClick={() => onEdit(application)}
      className="group bg-bg-surface border border-border rounded-lg p-4 flex flex-col gap-3 relative select-none hover:border-text-muted transition-all duration-100 cursor-pointer"
    >
      <div className="pr-14">
        <h4 className="font-bold text-[15px] text-text-primary tracking-tight group-hover:text-accent transition-colors duration-100 truncate">
          {application.company}
        </h4>
        <p className="text-xs text-text-secondary mt-0.5 truncate">{application.role}</p>
      </div>

      <div className="flex items-center justify-between mt-1">
        <StatusBadge status={application.status} />
        <span className="font-mono text-[11px] text-text-muted">
          {formatDate(application.appliedAt)}
        </span>
      </div>

      {/* Hover action icons */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit(application)
          }}
          title="Edit Details"
          className="p-1 text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded transition-colors focus:outline-none"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onArchive(application.id)
          }}
          title="Archive Application"
          className="p-1 text-text-secondary hover:text-status-red hover:bg-bg-elevated rounded transition-colors focus:outline-none"
        >
          <Archive className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
