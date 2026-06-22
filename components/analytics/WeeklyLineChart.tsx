'use client'

import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface WeeklyLineChartProps {
  data: { week: string; count: number }[]
}

export default function WeeklyLineChart({ data }: WeeklyLineChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-72 flex items-center justify-center bg-bg-surface border border-border rounded-lg animate-pulse">
        <div className="text-xs text-text-secondary">Loading weekly trend...</div>
      </div>
    )
  }

  const hasData = data && data.length > 0

  return (
    <div className="bg-bg-surface border border-border rounded-lg p-5 flex flex-col h-full select-none">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-text-primary tracking-tight">Applications Per Week</h3>
        <p className="text-xs text-text-secondary mt-0.5">12-week submission trend</p>
      </div>

      <div className="flex-1 w-full min-h-[260px] flex items-center justify-center">
        {hasData ? (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#22222E" vertical={false} />
              <XAxis
                dataKey="week"
                stroke="#44445A"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#44445A"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dx={-10}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: '#1C1C28',
                  border: '1px solid #22222E',
                  borderRadius: 6,
                }}
                labelStyle={{ fontSize: 11, fontWeight: 'bold', color: '#EEEEF5' }}
                itemStyle={{ fontSize: 12, color: '#6C63FF' }}
              />
              <Line
                type="monotone"
                dataKey="count"
                name="Applications"
                stroke="#6C63FF"
                strokeWidth={2}
                dot={{ stroke: '#6C63FF', strokeWidth: 1, r: 2, fill: '#09090E' }}
                activeDot={{ r: 4, strokeWidth: 0, fill: '#7B73FF' }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-xs text-text-secondary">No submission data available</div>
        )}
      </div>
    </div>
  )
}
