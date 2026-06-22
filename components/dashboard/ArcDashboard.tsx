import React from 'react'
import ArcMeter from '../ui/ArcMeter'

interface ArcDashboardProps {
  offerRate: number
  interviewsCount: number
  offersCount: number
}

export default function ArcDashboard({ offerRate, interviewsCount, offersCount }: ArcDashboardProps) {
  return (
    <div className="bg-bg-surface border border-border rounded-lg p-6 flex flex-col items-center justify-center text-center h-full select-none">
      <h3 className="text-sm font-bold text-text-primary mb-6 tracking-tight self-start">Offer Conversion</h3>
      
      <div className="flex-1 flex flex-col items-center justify-center w-full py-4">
        <ArcMeter value={offerRate} label="Offer Rate" />
        
        <div className="flex items-center gap-4 mt-6 text-sm text-text-secondary">
          <div className="flex flex-col items-center">
            <span className="font-mono text-lg font-bold text-text-primary">{interviewsCount}</span>
            <span className="text-[11px] text-text-muted uppercase">Interviews</span>
          </div>
          <span className="text-text-muted">→</span>
          <div className="flex flex-col items-center">
            <span className="font-mono text-lg font-bold text-status-green">{offersCount}</span>
            <span className="text-[11px] text-text-muted uppercase">Offers</span>
          </div>
        </div>
      </div>
    </div>
  )
}
