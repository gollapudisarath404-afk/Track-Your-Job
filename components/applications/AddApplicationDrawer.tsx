'use client'

import React, { useState, useEffect } from 'react'
import Drawer from '../ui/Drawer'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { ApplicationStatus, STATUS_CONFIG } from '@/lib/types'
import { useToast } from '../ui/Toast'

interface AddApplicationDrawerProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (app: any) => void
  defaultStatus?: ApplicationStatus
}

export default function AddApplicationDrawer({
  isOpen,
  onClose,
  onAdd,
  defaultStatus = 'APPLIED'
}: AddApplicationDrawerProps) {
  const { showToast } = useToast()
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState<ApplicationStatus>(defaultStatus)
  const [source, setSource] = useState('')
  const [jobUrl, setJobUrl] = useState('')
  const [salary, setSalary] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ company?: string; role?: string }>({})

  useEffect(() => {
    if (isOpen) {
      setStatus(defaultStatus)
      setCompany('')
      setRole('')
      setSource('')
      setJobUrl('')
      setSalary('')
      setNotes('')
      setErrors({})
    }
  }, [isOpen, defaultStatus])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: { company?: string; role?: string } = {}
    if (!company) newErrors.company = 'Company is required'
    if (!role) newErrors.role = 'Role is required'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company,
          role,
          status,
          source: source || null,
          jobUrl: jobUrl || null,
          salary: salary || null,
          notes: notes || null
        })
      })

      if (!res.ok) throw new Error('Failed to create application')
      const data = await res.json()
      onAdd(data.data)
      showToast('Application created successfully', 'success')
      onClose()
    } catch (err) {
      showToast('Failed to create application', 'error')
    } finally {
      setLoading(false)
    }
  }

  const statusOptions = Object.entries(STATUS_CONFIG).map(([key, val]) => ({
    value: key,
    label: val.label
  }))

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Application"
      width="max-w-[480px]"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 select-none pb-8">
        <Input
          label="Company Name *"
          placeholder="e.g. Google"
          value={company}
          onChange={(e) => {
            setCompany(e.target.value)
            if (errors.company) setErrors((prev) => ({ ...prev, company: undefined }))
          }}
          error={errors.company}
        />

        <Input
          label="Role / Title *"
          placeholder="e.g. Software Engineer Intern"
          value={role}
          onChange={(e) => {
            setRole(e.target.value)
            if (errors.role) setErrors((prev) => ({ ...prev, role: undefined }))
          }}
          error={errors.role}
        />

        <Select
          label="Status"
          options={statusOptions}
          value={status}
          onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
        />

        <Input
          label="Source"
          placeholder="e.g. LinkedIn, Referral, Company Careers"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />

        <Input
          label="Salary Package"
          placeholder="e.g. ₹12L - 18L"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />

        <Input
          label="Job URL"
          placeholder="e.g. https://careers.google.com/jobs/..."
          value={jobUrl}
          onChange={(e) => setJobUrl(e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-text-primary uppercase tracking-wider">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add job description, reminders, contact info..."
            className="w-full min-h-[100px] p-3 text-sm text-text-primary bg-bg-surface border border-border rounded-md focus:border-accent focus:outline-none focus:ring-0 placeholder:text-text-muted resize-y"
          />
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <Button
            type="submit"
            loading={loading}
            className="flex-1"
          >
            Create Application
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Drawer>
  )
}
