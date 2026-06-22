import React from 'react'

export default function SkeletonCard() {
  return (
    <div className="bg-bg-surface border border-border rounded-lg p-5 flex flex-col gap-4 animate-pulse select-none">
      {/* Category badge skeleton */}
      <div className="w-20 h-5 bg-bg-elevated rounded-full" />

      {/* Name skeleton */}
      <div className="space-y-2 mt-2">
        <div className="h-4 bg-bg-elevated rounded w-5/6" />
        <div className="h-4 bg-bg-elevated rounded w-2/3" />
      </div>

      {/* Price + ID skeleton */}
      <div className="flex items-center justify-between mt-4">
        <div className="h-5 bg-bg-elevated rounded w-1/3" />
        <div className="h-3 bg-bg-elevated rounded w-1/4" />
      </div>

      {/* Date skeleton */}
      <div className="h-3 bg-bg-elevated rounded w-1/2 mt-1" />
    </div>
  )
}
