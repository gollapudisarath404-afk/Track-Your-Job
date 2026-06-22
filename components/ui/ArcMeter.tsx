'use client'

import React, { useEffect, useState } from 'react'

interface ArcMeterProps {
  value: number // fraction between 0 and 1, e.g. 0.125
  label?: string
}

export default function ArcMeter({ value = 0, label = 'offer rate' }: ArcMeterProps) {
  const [offset, setOffset] = useState(391)

  const maxStroke = 391.0
  const activeStroke = maxStroke * Math.min(Math.max(value, 0), 1)

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(maxStroke - activeStroke)
    }, 100)
    return () => clearTimeout(timer)
  }, [activeStroke])

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-[220px] mx-auto select-none">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Background track (280 degrees) */}
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="#22222E"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="391 503"
          transform="rotate(130 100 100)"
        />
        {/* Foreground active fill */}
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="#6C63FF"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="391 503"
          strokeDashoffset={offset}
          transform="rotate(130 100 100)"
          className="transition-[stroke-dashoffset] duration-[1000ms] ease-out"
        />
      </svg>

      {/* Center text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
        <span className="font-mono text-2xl font-bold text-text-primary tracking-tight">
          {(value * 100).toFixed(1)}%
        </span>
        <span className="text-[11px] text-text-secondary font-medium uppercase tracking-wider mt-0.5">
          {label}
        </span>
      </div>
    </div>
  )
}
