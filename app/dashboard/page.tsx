'use client'

import React, { useState, useEffect } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import StatsRow from '@/components/dashboard/StatsRow'
import ArcDashboard from '@/components/dashboard/ArcDashboard'
import ActivityFeed from '@/components/dashboard/ActivityFeed'
import Button from '@/components/ui/Button'
import AddApplicationDrawer from '@/components/applications/AddApplicationDrawer'
import { Plus } from 'lucide-react'
import { Application } from '@/lib/types'
import { useToast } from '@/components/ui/Toast'

export default function DashboardPage() {
  const { showToast } = useToast()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false)

  const fetchData = async () => {
    try {
      const appsRes = await fetch('/api/applications')
      if (!appsRes.ok) throw new Error('Failed to fetch dashboard data')
      const appsJson = await appsRes.json()
      setApplications(appsJson.data || [])
    } catch (err) {
      console.error(err)
      showToast('Failed to load dashboard data', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAddApplication = (newApp: Application) => {
    setApplications((prev) => [newApp, ...prev])
    fetchData()
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse select-none">
        <div className="h-10 bg-bg-surface border border-border rounded w-1/3" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-bg-surface border border-border rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-[320px] bg-bg-surface border border-border rounded-lg lg:col-span-1" />
          <div className="h-[320px] bg-bg-surface border border-border rounded-lg lg:col-span-2" />
        </div>
      </div>
    )
  }

  const totalCount = applications.length
  const interviewingCount = applications.filter((a) => a.status === 'INTERVIEWING').length
  const offersCount = applications.filter((a) => a.status === 'OFFERED').length
  
  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const rejectedCount = applications.filter((a) => {
    if (a.status !== 'REJECTED') return false
    const date = new Date(a.updatedAt)
    return date >= thisMonthStart
  }).length

  const offerRate = totalCount > 0 ? offersCount / totalCount : 0.0

  const allActivities: any[] = []
  applications.forEach((app) => {
    if (app.history) {
      app.history.forEach((hist) => {
        allActivities.push({
          id: hist.id,
          company: app.company,
          fromStatus: hist.fromStatus,
          toStatus: hist.toStatus,
          changedAt: hist.changedAt,
        })
      })
    }
  })

  allActivities.sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime())

  return (
    <div className="space-y-8 select-none relative min-h-screen pb-16">
      <PageHeader
        title="Dashboard"
        subtitle="Track every step. Miss nothing."
        actions={
          <Button
            onClick={() => setIsAddDrawerOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Application
          </Button>
        }
      />

      <StatsRow
        total={totalCount}
        interviewing={interviewingCount}
        offers={offersCount}
        rejected={rejectedCount}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ArcDashboard
            offerRate={offerRate}
            interviewsCount={interviewingCount}
            offersCount={offersCount}
          />
        </div>
        <div className="lg:col-span-2">
          <ActivityFeed activities={allActivities} />
        </div>
      </div>

      <button
        onClick={() => setIsAddDrawerOpen(true)}
        aria-label="Add application"
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-accent hover:bg-[#7B73FF] text-[#EEEEF5] rounded-full flex items-center justify-center shadow-lg transition-transform duration-100 active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      <AddApplicationDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        onAdd={handleAddApplication}
      />
    </div>
  )
}
