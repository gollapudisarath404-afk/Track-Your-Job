import React from 'react'
import { Product } from '@/lib/types'
import { formatDate, formatPrice } from '@/lib/utils'
import { getCategoryStyles } from './ProductCard'

interface ProductListProps {
  products: Product[]
}

export default function ProductList({ products }: ProductListProps) {
  return (
    <div className="w-full overflow-x-auto border border-border rounded-lg bg-bg-surface select-none">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-bg-surface/50 text-xs font-semibold text-text-secondary">
            <th className="px-6 py-4">ID</th>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Price</th>
            <th className="px-6 py-4">Added Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {products.map((product) => {
            const badgeStyle = getCategoryStyles(product.category)
            return (
              <tr key={product.id} className="hover:bg-bg-elevated/40 transition-colors duration-100">
                <td className="px-6 py-4 font-mono text-[11px] text-text-muted select-all">
                  #{product.id.slice(0, 8)}...
                </td>
                <td className="px-6 py-4 font-bold text-text-primary truncate max-w-[240px]">
                  {product.name}
                </td>
                <td className="px-6 py-4">
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
                </td>
                <td className="px-6 py-4 font-mono text-text-primary font-semibold">
                  {formatPrice(product.price)}
                </td>
                <td className="px-6 py-4 font-mono text-xs text-text-secondary">
                  {formatDate(product.createdAt)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
