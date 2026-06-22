'use client'

import React, { useState, useEffect } from 'react'
import Drawer from '../ui/Drawer'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { Application, ApplicationStatus, STATUS_CONFIG } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { Archive, Trash2, ExternalLink, Calendar, DollarSign, Tag, Clock } from 'lucide-react'
import { useToast } from '../ui/Toast'

interface ApplicationDrawerProps {
  isOpen: boolean
  onClose: () => void
  application: Application | null
  onUpdate: (app: Application) => void
  onDelete: (id: string) => void
  onArchive: (id: string) => void
}

export default function ApplicationDrawer({
  isOpen,
  onClose,
  application,
  onUpdate,
  onDelete,
  onArchive
}: ApplicationDrawerProps) {
  const { showToast } = useToast()
  const [notes, setNotes] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [source, setSource] = useState('')
  const [jobUrl, setJobUrl] = useState('')
  const [salary, setSalary] = useState('')
  const [status, setStatus] = useState<ApplicationStatus>('APPLIED')

  useEffect(() => {
    if (application) {
      setNotes(application.notes || '')
      setCompany(application.company || '')
      setRole(application.role || '')
      setSource(application.source || '')
      setJobUrl(application.jobUrl || '')
      setSalary(application.salary || '')
      setStatus(application.status || 'APPLIED')
    }
  }, [application])

  if (!application) return null

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    setStatus(newStatus)
    try {
      const res = await fetch(`/api/applications/${application.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Failed to update status')
      const data = await res.json()
      onUpdate(data.data)
      showToast(`Status updated to ${STATUS_CONFIG[newStatus].label}`, 'success')
    } catch (err) {
      showToast('Failed to update status', 'error')
      setStatus(application.status)
    }
  }

  const handleNotesBlur = async () => {
    if (notes === (application.notes || '')) return
    try {
      const res = await fetch(`/api/applications/${application.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      })
      if (!res.ok) throw new Error('Failed to save notes')
      const data = await res.json()
      onUpdate(data.data)
      showToast('Notes auto-saved', 'success')
    } catch (err) {
      showToast('Failed to save notes', 'error')
    }
  }

  const handleFieldBlur = async (fieldName: string, value: string) => {
    if (value === ((application as any)[fieldName] || '')) return
    try {
      const res = await fetch(`/api/applications/${application.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [fieldName]: value }),
      })
      if (!res.ok) throw new Error(`Failed to update ${fieldName}`)
      const data = await res.json()
      onUpdate(data.data)
      showToast(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} updated`, 'success')
    } catch (err) {
      showToast(`Failed to update ${fieldName}`, 'error')
    }
  }

  const statusOptions = Object.entries(STATUS_CONFIG).map(([key, val]) => ({
    value: key,
    label: val.label,
  }))

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Application Details"
      width="max-w-[480px]"
    >
      <div className="flex flex-col gap-6 select-none h-full pb-8">
        {/* Top actions */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              icon={<Archive className="w-4 h-4" />}
              onClick={() => {
                onArchive(application.id)
                onClose()
              }}
            >
              {application.archived ? 'Restore' : 'Archive'}
            </Button>
            <Button
              variant="danger"
              icon={<Trash2 className="w-4 h-4" />}
              onClick={() => {
                if (confirm('Are you sure you want to delete this application?')) {
                  onDelete(application.id)
                  onClose()
                }
              }}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Header fields */}
        <div className="space-y-1">
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            onBlur={() => handleFieldBlur('company', company)}
            className="w-full text-2xl font-extrabold bg-transparent text-text-primary tracking-tight focus:outline-none focus:border-b border-border/80 pb-0.5 border-b border-transparent"
          />
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            onBlur={() => handleFieldBlur('role', role)}
            className="w-full text-base font-semibold bg-transparent text-text-secondary focus:outline-none focus:border-b border-border/80 pb-0.5 border-b border-transparent mt-1"
          />
        </div>

        {/* Status drop control */}
        <div className="bg-bg-surface border border-border rounded-lg p-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Current Status
          </span>
          <div className="w-44">
            <Select
              options={statusOptions}
              value={status}
              onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus)}
            />
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-bg-surface/50 border border-border/60 rounded-lg p-3 flex flex-col gap-1">
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3 h-3" /> Applied Date
            </span>
            <span className="font-mono text-xs text-text-primary mt-1">
              {formatDate(application.appliedAt)}
            </span>
          </div>
          <div className="bg-bg-surface/50 border border-border/60 rounded-lg p-3 flex flex-col gap-1">
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3 h-3" /> Job Source
            </span>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              onBlur={() => handleFieldBlur('source', source)}
              placeholder="e.g. LinkedIn"
              className="bg-transparent text-xs text-text-primary focus:outline-none focus:border-b border-border border-b border-transparent py-0.5 mt-1 w-full"
            />
          </div>
          <div className="bg-bg-surface/50 border border-border/60 rounded-lg p-3 flex flex-col gap-1 col-span-2">
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3 h-3" /> Salary Package
            </span>
            <input
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              onBlur={() => handleFieldBlur('salary', salary)}
              placeholder="e.g. ₹12L - 18L"
              className="bg-transparent text-xs text-text-primary focus:outline-none focus:border-b border-border border-b border-transparent py-0.5 mt-1 w-full"
            />
          </div>
          <div className="bg-bg-surface/50 border border-border/60 rounded-lg p-3 flex flex-col gap-1 col-span-2">
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <ExternalLink className="w-3 h-3" /> Job URL
            </span>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                onBlur={() => handleFieldBlur('jobUrl', jobUrl)}
                placeholder="https://..."
                className="bg-transparent text-xs text-text-primary focus:outline-none focus:border-b border-border border-b border-transparent py-0.5 flex-1 min-w-0"
              />
              {jobUrl && (
                <a
                  href={jobUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent hover:text-[#7B73FF] shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Notes editor */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-primary uppercase tracking-wider">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleNotesBlur}
            placeholder="Add application logs, interviewer names, links..."
            className="w-full min-h-[120px] p-3 text-sm text-text-primary bg-bg-surface border border-border rounded-md focus:border-accent focus:outline-none focus:ring-0 placeholder:text-text-muted resize-y"
          />
        </div>

        {/* History Timeline */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> History Timeline
          </h4>
          <div className="border-l border-border pl-4 space-y-4">
            {application.history?.map((hist) => {
              const statusCfg = STATUS_CONFIG[hist.toStatus as ApplicationStatus] || { label: hist.toStatus }
              return (
                <div key={hist.id} className="relative text-xs">
                  <span
                    className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-bg-surface"
                    style={{ backgroundColor: STATUS_CONFIG[hist.toStatus as ApplicationStatus]?.color || '#6B7280' }}
                  />
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-text-primary font-semibold">
                      {hist.fromStatus
                        ? `Status changed from ${STATUS_CONFIG[hist.fromStatus as ApplicationStatus]?.label || hist.fromStatus} to ${statusCfg.label}`
                        : `Application created with status ${statusCfg.label}`}
                    </span>
                    <span className="font-mono text-[10px] text-text-muted whitespace-nowrap ml-2">
                      {formatDate(hist.changedAt)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Drawer>
  )
}
