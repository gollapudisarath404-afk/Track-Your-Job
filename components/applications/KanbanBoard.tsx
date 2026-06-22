'use client'

import React from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { Application, ApplicationStatus } from '@/lib/types'
import KanbanColumn from './KanbanColumn'

interface KanbanBoardProps {
  applications: Application[]
  onStatusChange: (id: string, newStatus: ApplicationStatus) => void
  onEdit: (app: Application) => void
  onArchive: (id: string) => void
  onAddClick: (status: ApplicationStatus) => void
}

const COLUMNS: ApplicationStatus[] = [
  'APPLIED',
  'PHONE_SCREEN',
  'INTERVIEWING',
  'OFFERED',
  'REJECTED',
  'WITHDRAWN',
]

export default function KanbanBoard({
  applications,
  onStatusChange,
  onEdit,
  onArchive,
  onAddClick
}: KanbanBoardProps) {
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    const newStatus = destination.droppableId as ApplicationStatus
    onStatusChange(draggableId, newStatus)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 select-none scrollbar-thin">
        {COLUMNS.map((status) => {
          const filteredApps = applications.filter((app) => app.status === status)
          return (
            <div key={status} className="flex-1 min-w-[280px] max-w-[360px]">
              <KanbanColumn
                status={status}
                applications={filteredApps}
                onEdit={onEdit}
                onArchive={onArchive}
                onAddClick={onAddClick}
              />
            </div>
          )
        })}
      </div>
    </DragDropContext>
  )
}
