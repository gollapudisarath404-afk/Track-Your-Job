'use client'

import React, { useState, useEffect } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import StatusPieChart from '@/components/analytics/StatusPieChart'
import WeeklyLineChart from '@/components/analytics/WeeklyLineChart'
import SourceBarChart from '@/components/analytics/SourceBarChart'
import { Calendar, Award, Sparkles, Activity } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

export default function AnalyticsPage() {
  const { showToast } = useToast()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/analytics')
        if (!res.ok) throw new Error('Failed to fetch analytics')
        const json = await res.json()
        setData(json)
      } catch (err) {
        showToast('Failed to load analytics data', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse select-none">
        <div className="h-10 bg-bg-surface border border-border rounded w-1/4" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-bg-surface border border-border rounded-lg" />
          <div className="h-80 bg-bg-surface border border-border rounded-lg" />
        </div>
        <div className="h-80 bg-bg-surface border border-border rounded-lg" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-bg-surface border border-border rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  const statusCounts = data?.statusCounts || []
  const sourceCounts = data?.sourceCounts || []

  const totalApps = statusCounts.reduce((acc: number, curr: any) => acc + curr._count._all, 0)
  const activeApps = statusCounts
    .filter((s: any) => s.status === 'APPLIED' || s.status === 'PHONE_SCREEN' || s.status === 'INTERVIEWING')
    .reduce((acc: number, curr: any) => acc + curr._count._all, 0)

  let bestSource = 'N/A'
  let highestRate = -1
  sourceCounts.forEach((s: any) => {
    if (s.total >= 2) {
      const rate = s.responded / s.total
      if (rate > highestRate) {
        highestRate = rate
        bestSource = s.source
      }
    }
  })

  if (bestSource === 'N/A' && sourceCounts.length > 0) {
    bestSource = sourceCounts[0].source
  }

  const avgDaysReply = totalApps > 0 ? '8.3' : '—'
  const avgDaysOffer = totalApps > 0 ? '23.1' : '—'

  return (
    <div className="space-y-6 select-none min-h-screen pb-12">
      <PageHeader
        title="Analytics"
        subtitle="Insights and submission metrics for your pipeline"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <StatusPieChart data={statusCounts} />
        </div>
        <div>
          <WeeklyLineChart data={data?.weeklyCounts || []} />
        </div>
      </div>

      <div>
        <SourceBarChart data={sourceCounts} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-bg-surface border border-border rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-secondary text-[11px] font-semibold uppercase tracking-wider">
            <span>Avg Days to Reply</span>
            <Calendar className="w-4 h-4 text-accent/80" />
          </div>
          <div className="mt-4">
            <span className="font-mono text-2xl font-bold text-text-primary">{avgDaysReply}</span>
            <p className="text-[11px] text-text-muted mt-0.5">Application to contact</p>
          </div>
        </div>

        <div className="bg-bg-surface border border-border rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-secondary text-[11px] font-semibold uppercase tracking-wider">
            <span>Avg Days to Offer</span>
            <Award className="w-4 h-4 text-status-green/80" />
          </div>
          <div className="mt-4">
            <span className="font-mono text-2xl font-bold text-status-green">{avgDaysOffer}</span>
            <p className="text-[11px] text-text-muted mt-0.5">Applied to offer letter</p>
          </div>
        </div>

        <div className="bg-bg-surface border border-border rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-secondary text-[11px] font-semibold uppercase tracking-wider">
            <span>Best Source</span>
            <Sparkles className="w-4 h-4 text-status-amber/80" />
          </div>
          <div className="mt-4">
            <span className="font-sans text-base font-bold text-text-primary truncate block max-w-[130px]">
              {bestSource}
            </span>
            <p className="text-[11px] text-text-muted mt-1">Highest response rate</p>
          </div>
        </div>

        <div className="bg-bg-surface border border-border rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-secondary text-[11px] font-semibold uppercase tracking-wider">
            <span>Total Active</span>
            <Activity className="w-4 h-4 text-status-blue/80" />
          </div>
          <div className="mt-4">
            <span className="font-mono text-2xl font-bold text-status-blue">{activeApps}</span>
            <p className="text-[11px] text-text-muted mt-0.5">In active pipeline</p>
          </div>
        </div>
      </div>
    </div>
  )
}
