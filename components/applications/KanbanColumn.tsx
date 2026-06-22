import React from 'react'
import { Droppable, Draggable } from '@hello-pangea/dnd'
import { Application, ApplicationStatus, STATUS_CONFIG } from '@/lib/types'
import ApplicationCard from './ApplicationCard'
import { Plus } from 'lucide-react'

interface KanbanColumnProps {
  status: ApplicationStatus
  applications: Application[]
  onEdit: (app: Application) => void
  onArchive: (id: string) => void
  onAddClick: (status: ApplicationStatus) => void
}

export default function KanbanColumn({
  status,
  applications,
  onEdit,
  onArchive,
  onAddClick
}: KanbanColumnProps) {
  const config = STATUS_CONFIG[status] || { label: status, color: '#6B7280' }

  return (
    <div className="flex flex-col bg-bg-surface/10 border border-border/60 rounded-lg w-full min-w-[280px] h-[calc(100vh-280px)] select-none">
      {/* Column Header */}
      <div className="p-3 border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: config.color }}
          />
          <h3 className="font-bold text-sm text-text-primary">{config.label}</h3>
        </div>
        <span
          className="font-mono text-xs font-bold px-2 py-0.5 rounded-full border"
          style={{
            color: config.color,
            borderColor: `${config.color}33`,
            backgroundColor: `${config.color}10`
          }}
        >
          {applications.length}
        </span>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto p-3 flex flex-col gap-3 min-h-[150px] transition-colors duration-100 ${
              snapshot.isDraggingOver ? 'bg-bg-elevated/20' : ''
            }`}
          >
            {applications.map((app, index) => (
              <Draggable key={app.id} draggableId={app.id} index={index}>
                {(providedDraggable) => (
                  <div
                    ref={providedDraggable.innerRef}
                    {...providedDraggable.draggableProps}
                    {...providedDraggable.dragHandleProps}
                  >
                    <ApplicationCard
                      application={app}
                      onEdit={onEdit}
                      onArchive={onArchive}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            {applications.length === 0 && (
              <button
                onClick={() => onAddClick(status)}
                className="flex-1 flex flex-col items-center justify-center p-6 border border-dashed border-border/80 rounded-lg hover:border-text-muted hover:bg-bg-surface/20 transition-all duration-100 group min-h-[120px]"
              >
                <Plus className="w-5 h-5 text-text-muted group-hover:text-text-primary transition-colors" />
                <span className="text-xs text-text-muted group-hover:text-text-primary mt-1.5 font-medium transition-colors">
                  Add Application
                </span>
              </button>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}
