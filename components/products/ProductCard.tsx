import React from 'react'
import { Product } from '@/lib/types'
import { formatDate, formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: Product
}

export function getCategoryStyles(category: string) {
  let hash = 0
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colors = [
    { color: '#60A5FA', bg: '#60A5FA1A', border: '#60A5FA33' },
    { color: '#F472B6', bg: '#F472B61A', border: '#F472B633' },
    { color: '#34D399', bg: '#34D3991A', border: '#34D39933' },
    { color: '#FB923C', bg: '#FB923C1A', border: '#FB923C33' },
    { color: '#2DD4BF', bg: '#2DD4BF1A', border: '#2DD4BF33' },
    { color: '#A78BFA', bg: '#A78BFA1A', border: '#A78BFA33' },
    { color: '#F59E0B', bg: '#F59E0B1A', border: '#F59E0B33' },
  ]
  return colors[Math.abs(hash) % colors.length]
}

export default function ProductCard({ product }: ProductCardProps) {
  const badgeStyle = getCategoryStyles(product.category)

  return (
    <div className="bg-bg-surface border border-border rounded-lg p-5 flex flex-col gap-4 select-none hover:border-text-muted transition-all duration-100">
      {/* Category badge */}
      <div>
        <span
          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase border shrink-0"
          style={{
            color: badgeStyle.color,
            backgroundColor: badgeStyle.bg,
            borderColor: badgeStyle.border,
          }}
        >
          {product.category}
        </span>
      </div>

      {/* Name (2-line clamp) */}
      <h4 className="font-bold text-[15px] text-text-primary tracking-tight line-clamp-2 min-h-[40px] leading-snug">
        {product.name}
      </h4>

      {/* Price + ID */}
      <div className="flex items-baseline justify-between mt-auto">
        <span className="font-mono text-base font-extrabold text-text-primary">
          {formatPrice(product.price)}
        </span>
        <span className="font-mono text-[10px] text-text-muted select-all shrink-0">
          #{product.id.slice(0, 8)}...
        </span>
      </div>

      {/* Created date */}
      <div className="text-[11px] font-mono text-text-secondary border-t border-border/40 pt-2 flex justify-between items-center">
        <span className="text-text-muted">Added:</span>
        <span>{formatDate(product.createdAt)}</span>
      </div>
    </div>
  )
}
