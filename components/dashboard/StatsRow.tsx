import React from 'react'
import { ClipboardList, Calendar, Award, XOctagon } from 'lucide-react'

interface StatsRowProps {
  total: number
  interviewing: number
  offers: number
  rejected: number
}

export default function StatsRow({ total, interviewing, offers, rejected }: StatsRowProps) {
  const stats = [
    {
      label: 'Total',
      value: total,
      sublabel: 'applications',
      icon: <ClipboardList className="w-5 h-5 text-accent" />,
      bg: 'bg-accent/10',
    },
    {
      label: 'Interviewing',
      value: interviewing,
      sublabel: 'in progress',
      icon: <Calendar className="w-5 h-5 text-status-amber" />,
      bg: 'bg-status-amber/10',
    },
    {
      label: 'Offers',
      value: offers,
      sublabel: 'received',
      icon: <Award className="w-5 h-5 text-status-green" />,
      bg: 'bg-status-green/10',
    },
    {
      label: 'Rejected',
      value: rejected,
      sublabel: 'this month',
      icon: <XOctagon className="w-5 h-5 text-status-red" />,
      bg: 'bg-status-red/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-bg-surface border border-border rounded-lg p-5 flex flex-col relative select-none">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-text-secondary">{stat.label}</span>
            <div className={`p-2 rounded-full ${stat.bg} flex items-center justify-center shrink-0`}>
              {stat.icon}
            </div>
          </div>
          <span className="text-3xl font-extrabold text-text-primary tracking-tight mt-3">
            {stat.value}
          </span>
          <span className="text-[11px] font-mono text-text-muted mt-1 uppercase tracking-wide">
            {stat.sublabel}
          </span>
        </div>
      ))}
    </div>
  )
}
