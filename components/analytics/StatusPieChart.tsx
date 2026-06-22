'use client'

import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { STATUS_CONFIG, ApplicationStatus } from '@/lib/types'

interface StatusPieChartProps {
  data: { status: ApplicationStatus; _count: { _all: number } }[]
}

export default function StatusPieChart({ data }: StatusPieChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-72 flex items-center justify-center bg-bg-surface border border-border rounded-lg animate-pulse">
        <div className="text-xs text-text-secondary">Loading status distribution...</div>
      </div>
    )
  }

  const chartData = data.map((item) => {
    const config = STATUS_CONFIG[item.status] || { label: item.status, color: '#6B7280' }
    return {
      name: config.label,
      value: item._count._all,
      color: config.color,
    }
  })

  const hasData = chartData.length > 0

  return (
    <div className="bg-bg-surface border border-border rounded-lg p-5 flex flex-col h-full select-none">
      <h3 className="text-sm font-bold text-text-primary mb-4 tracking-tight">Status Distribution</h3>
      <div className="flex-1 w-full min-h-[260px] flex items-center justify-center">
        {hasData ? (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#111118" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#1C1C28',
                  border: '1px solid #22222E',
                  borderRadius: 6,
                }}
                itemStyle={{ color: '#EEEEF5' }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-xs text-text-secondary">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-xs text-text-secondary">No status data available</div>
        )}
      </div>
    </div>
  )
}
