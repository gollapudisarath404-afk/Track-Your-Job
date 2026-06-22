import React from 'react'
import { LucideIcon } from 'lucide-react'
import Button from './Button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-lg bg-bg-surface/30 min-h-[320px] select-none">
      <Icon className="w-12 h-12 text-text-muted shrink-0 mb-4" />
      <h3 className="text-lg font-bold text-text-primary tracking-tight">{title}</h3>
      <p className="text-sm text-text-secondary max-w-sm mt-1 mb-6 leading-relaxed">
        {description}
      </p>
      {action && (
        <Button variant="secondary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
