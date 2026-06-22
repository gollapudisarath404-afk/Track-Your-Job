'use client'

import React, { useState, useEffect } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import FilterBar from '@/components/applications/FilterBar'
import KanbanBoard from '@/components/applications/KanbanBoard'
import ApplicationTable from '@/components/applications/ApplicationTable'
import ApplicationDrawer from '@/components/applications/ApplicationDrawer'
import AddApplicationDrawer from '@/components/applications/AddApplicationDrawer'
import Button from '@/components/ui/Button'
import { LayoutGrid, List, Plus } from 'lucide-react'
import { Application, ApplicationStatus } from '@/lib/types'
import { useToast } from '@/components/ui/Toast'

export default function ApplicationsPage() {
  const { showToast } = useToast()
  const [applications, setApplications] = useState<Application[]>([])
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban')
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [source, setSource] = useState('')

  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [addDefaultStatus, setAddDefaultStatus] = useState<ApplicationStatus>('APPLIED')

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/applications')
      if (!res.ok) throw new Error('Failed to fetch applications')
      const data = await res.json()
      setApplications(data.data || [])
    } catch (err) {
      showToast('Failed to load applications', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    const previousApps = [...applications]
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    )

    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Failed to update status')
      
      const data = await res.json()
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? data.data : app))
      )
      showToast('Status updated successfully', 'success')
    } catch (err) {
      setApplications(previousApps)
      showToast('Failed to update status', 'error')
    }
  }

  const handleUpdate = (updatedApp: Application) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === updatedApp.id ? updatedApp : app))
    )
    if (selectedApp?.id === updatedApp.id) {
      setSelectedApp(updatedApp)
    }
  }

  const handleArchive = async (id: string) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: true }),
      })
      if (!res.ok) throw new Error('Failed to archive application')
      setApplications((prev) => prev.filter((app) => app.id !== id))
      showToast('Application archived successfully', 'success')
    } catch (err) {
      showToast('Failed to archive application', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete application')
      setApplications((prev) => prev.filter((app) => app.id !== id))
      showToast('Application deleted successfully', 'success')
    } catch (err) {
      showToast('Failed to delete application', 'error')
    }
  }

  const handleAdd = (newApp: Application) => {
    setApplications((prev) => [newApp, ...prev])
  }

  const handleClearFilters = () => {
    setSearch('')
    setStatus('')
    setSource('')
  }

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(search.toLowerCase()) ||
      app.role.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = status ? app.status === status : true
    const matchesSource = source ? app.source === source : true
    return matchesSearch && matchesStatus && matchesSource
  })

  const uniqueSources = Array.from(
    new Set(applications.map((app) => app.source).filter(Boolean))
  ) as string[]

  const handleCardEdit = (app: Application) => {
    setSelectedApp(app)
    setIsDetailOpen(true)
  }

  const handleAddPrompt = (statusVal: ApplicationStatus) => {
    setAddDefaultStatus(statusVal)
    setIsAddOpen(true)
  }

  return (
    <div className="space-y-6 select-none min-h-screen">
      <PageHeader
        title="Applications"
        subtitle="Manage and track your job application pipeline"
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-border rounded-md overflow-hidden bg-bg-surface shrink-0">
              <button
                onClick={() => setViewMode('kanban')}
                aria-label="Kanban view"
                className={`p-2 transition-colors duration-100 ${
                  viewMode === 'kanban'
                    ? 'bg-bg-elevated text-accent'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                aria-label="Table view"
                className={`p-2 transition-colors duration-100 ${
                  viewMode === 'table'
                    ? 'bg-bg-elevated text-accent'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <Button
              onClick={() => handleAddPrompt('APPLIED')}
              icon={<Plus className="w-4 h-4" />}
            >
              Add Application
            </Button>
          </div>
        }
      />

      <FilterBar
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        source={source}
        setSource={setSource}
        sources={uniqueSources}
        onClear={handleClearFilters}
      />

      {loading ? (
        <div className="space-y-4 py-12 flex flex-col items-center justify-center">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-text-secondary">Loading pipeline...</span>
        </div>
      ) : viewMode === 'kanban' ? (
        <KanbanBoard
          applications={filteredApplications}
          onStatusChange={handleStatusChange}
          onEdit={handleCardEdit}
          onArchive={handleArchive}
          onAddClick={handleAddPrompt}
        />
      ) : (
        <ApplicationTable
          applications={filteredApplications}
          onEdit={handleCardEdit}
          onArchive={handleArchive}
        />
      )}

      <ApplicationDrawer
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false)
          setSelectedApp(null)
        }}
        application={selectedApp}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onArchive={handleArchive}
      />

      <AddApplicationDrawer
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAdd}
        defaultStatus={addDefaultStatus}
      />
    </div>
  )
}
