'use client'

import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface SourceItem {
  source: string
  total: number
  responded: number
}

interface SourceBarChartProps {
  data: SourceItem[]
}

export default function SourceBarChart({ data }: SourceBarChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-72 flex items-center justify-center bg-bg-surface border border-border rounded-lg animate-pulse">
        <div className="text-xs text-text-secondary">Loading response rates...</div>
      </div>
    )
  }

  const chartData = data
    .map((item) => {
      const rate = item.total > 0 ? Math.round((item.responded / item.total) * 100) : 0
      return {
        source: item.source,
        rate,
        total: item.total,
        responded: item.responded,
      }
    })
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 6)

  const hasData = chartData.length > 0

  return (
    <div className="bg-bg-surface border border-border rounded-lg p-5 flex flex-col h-full select-none">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-text-primary tracking-tight">Response Rate by Platform</h3>
        <p className="text-xs text-text-secondary mt-0.5">Response rate = status changes beyond &ldquo;Applied&rdquo;</p>
      </div>

      <div className="flex-1 w-full min-h-[260px] flex items-center justify-center">
        {hasData ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
            >
              <CartesianGrid stroke="#22222E" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 100]}
                stroke="#44445A"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dy={5}
                unit="%"
              />
              <YAxis
                dataKey="source"
                type="category"
                stroke="#44445A"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dx={-5}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  background: '#1C1C28',
                  border: '1px solid #22222E',
                  borderRadius: 6,
                }}
                labelStyle={{ fontSize: 11, fontWeight: 'bold', color: '#EEEEF5' }}
                itemStyle={{ fontSize: 12, color: '#6C63FF' }}
                formatter={(value: any, name: any, props: any) => [
                  `${value}% (${props.payload.responded}/${props.payload.total})`,
                  'Response Rate',
                ]}
              />
              <Bar dataKey="rate" fill="#6C63FF" radius={[0, 4, 4, 0]} barSize={12}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#6C63FF" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-xs text-text-secondary">No platform statistics available</div>
        )}
      </div>
    </div>
  )
}
