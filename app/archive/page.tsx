'use client'

import React, { useState, useEffect } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import Modal from '@/components/ui/Modal'
import StatusBadge from '@/components/ui/StatusBadge'
import { Application } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { Archive, RotateCcw, Trash2 } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

export default function ArchivePage() {
  const { showToast } = useToast()
  const [archivedApps, setArchivedApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const fetchArchived = async () => {
    try {
      const res = await fetch('/api/applications?archived=true')
      if (!res.ok) throw new Error('Failed to fetch archived applications')
      const data = await res.json()
      setArchivedApps(data.data || [])
    } catch (err) {
      showToast('Failed to load archived applications', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArchived()
  }, [])

  const handleRestore = async (id: string) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: false }),
      })
      if (!res.ok) throw new Error('Failed to restore application')
      setArchivedApps((prev) => prev.filter((app) => app.id !== id))
      showToast('Application restored to pipeline', 'success')
    } catch (err) {
      showToast('Failed to restore application', 'error')
    }
  }

  const handleRestoreAll = async () => {
    if (archivedApps.length === 0) return
    try {
      await Promise.all(
        archivedApps.map((app) =>
          fetch(`/api/applications/${app.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ archived: false }),
          })
        )
      )
      setArchivedApps([])
      showToast('All applications restored', 'success')
    } catch (err) {
      showToast('Failed to restore all applications', 'error')
    }
  }

  const handleDeleteAll = async () => {
    if (archivedApps.length === 0) return
    try {
      await Promise.all(
        archivedApps.map((app) =>
          fetch(`/api/applications/${app.id}`, {
            method: 'DELETE',
          })
        )
      )
      setArchivedApps([])
      showToast('All archived applications permanently deleted', 'success')
      setIsDeleteModalOpen(false)
    } catch (err) {
      showToast('Failed to delete all applications', 'error')
    }
  }

  return (
    <div className="space-y-6 select-none min-h-screen">
      <PageHeader
        title="Archive"
        subtitle="Archived applications not currently in your active board"
        actions={
          archivedApps.length > 0 ? (
            <div className="flex items-center gap-3">
              <Button variant="secondary" onClick={handleRestoreAll} icon={<RotateCcw className="w-4 h-4" />}>
                Restore All
              </Button>
              <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)} icon={<Trash2 className="w-4 h-4" />}>
                Delete All
              </Button>
            </div>
          ) : undefined
        }
      />

      {loading ? (
        <div className="space-y-4 py-12 flex flex-col items-center justify-center">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-text-secondary">Loading archive...</span>
        </div>
      ) : archivedApps.length === 0 ? (
        <EmptyState
          icon={Archive}
          title="No archived applications"
          description="Archiving a job application hides it from your kanban board while preserving history details."
        />
      ) : (
        <div className="w-full overflow-x-auto border border-border rounded-lg bg-bg-surface">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-surface/50 text-xs font-semibold text-text-secondary">
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Applied</th>
                <th className="px-6 py-4">Archived On</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {archivedApps.map((app) => (
                <tr key={app.id} className="hover:bg-bg-elevated/40 transition-colors duration-100">
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
                  <td className="px-6 py-4 font-mono text-xs text-text-muted">
                    {formatDate(app.updatedAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => handleRestore(app.id)}
                        icon={<RotateCcw className="w-3.5 h-3.5" />}
                        className="h-8 px-3"
                      >
                        Restore
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Permanently Delete All?"
        footer={
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteAll}>
              Delete All Permanently
            </Button>
          </div>
        }
      >
        <p className="text-sm text-text-secondary leading-relaxed">
          This operation is irreversible. All {archivedApps.length} archived job applications will be permanently removed from the database, including notes, salaries, and historic status timelines.
        </p>
      </Modal>
    </div>
  )
}
