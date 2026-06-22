import React from 'react'
import Link from 'next/link'
import { STATUS_CONFIG, ApplicationStatus } from '@/lib/types'
import { timeAgo } from '@/lib/utils'

interface ActivityItem {
  id: string
  company: string
  fromStatus?: ApplicationStatus | null
  toStatus: ApplicationStatus
  changedAt: string
}

interface ActivityFeedProps {
  activities: ActivityItem[]
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const displayActivities = activities.slice(0, 8)

  return (
    <div className="bg-bg-surface border border-border rounded-lg p-5 flex flex-col h-full select-none">
      <h3 className="text-sm font-bold text-text-primary mb-4 tracking-tight">Recent Activity</h3>
      
      {displayActivities.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-8">
          <p className="text-xs text-text-secondary">No recent activity</p>
        </div>
      ) : (
        <div className="flex-1 divide-y divide-border/40 overflow-y-auto">
          {displayActivities.map((activity) => {
            const statusCfg = STATUS_CONFIG[activity.toStatus] || { color: '#6B7280', label: activity.toStatus }
            return (
              <div key={activity.id} className="flex items-center justify-between py-3 text-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: statusCfg.color }}
                  />
                  <div className="flex items-baseline gap-1.5 min-w-0">
                    <span className="font-bold text-text-primary truncate">{activity.company}</span>
                    <span className="text-xs text-text-secondary shrink-0">·</span>
                    <span className="text-xs text-text-secondary truncate">
                      {activity.fromStatus ? `Moved to ${statusCfg.label}` : `Applied for`}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-text-muted shrink-0 ml-4">
                  {timeAgo(activity.changedAt)}
                </span>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-border flex justify-end">
        <Link
          href="/applications"
          className="text-xs font-semibold text-accent hover:text-[#7B73FF] transition-colors"
        >
          View all →
        </Link>
      </div>
    </div>
  )
}
