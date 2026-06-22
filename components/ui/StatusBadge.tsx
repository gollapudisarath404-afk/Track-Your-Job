import { ApplicationStatus, STATUS_CONFIG } from '@/lib/types'

interface StatusBadgeProps {
  status: ApplicationStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || { label: status, color: '#6B7280', bg: '#6B72801A', border: '#6B728033' }

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase border shrink-0"
      style={{
        color: config.color,
        backgroundColor: config.bg,
        borderColor: config.border,
      }}
    >
      {config.label}
    </span>
  )
}
