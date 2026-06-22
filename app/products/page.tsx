'use client'

import React, { useState, useEffect } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import ProductFilters from '@/components/products/ProductFilters'
import ProductGrid from '@/components/products/ProductGrid'
import ProductList from '@/components/products/ProductList'
import Pagination from '@/components/products/Pagination'
import SkeletonCard from '@/components/ui/SkeletonCard'
import EmptyState from '@/components/ui/EmptyState'
import { ShoppingBag } from 'lucide-react'
import { Product } from '@/lib/types'
import { useToast } from '@/components/ui/Toast'

export default function ProductsPage() {
  const { showToast } = useToast()
  
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [limit, setLimit] = useState(20)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const [currentPage, setCurrentPage] = useState(1)
  const [cursorsHistory, setCursorsHistory] = useState<(string | null)[]>([null])

  const fetchProducts = async (cursor: string | null = null) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('limit', limit.toString())
      if (cursor) params.append('cursor', cursor)
      if (category) params.append('category', category)
      if (search) params.append('search', search)
      if (minPrice) params.append('minPrice', minPrice)
      if (maxPrice) params.append('maxPrice', maxPrice)

      const res = await fetch(`/api/products?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch products')
      const data = await res.json()

      setProducts(data.data || [])
      setNextCursor(data.nextCursor)
      setHasMore(data.hasMore)
      if (data.categories) {
        setCategories(data.categories)
      }
    } catch (err) {
      console.error(err)
      showToast('Failed to load products. Make sure database is seeded.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setCurrentPage(1)
    setCursorsHistory([null])
    fetchProducts(null)
  }, [search, category, minPrice, maxPrice, limit])

  const handleNextPage = () => {
    if (!hasMore || !nextCursor) return
    const nextHistory = [...cursorsHistory]
    nextHistory[currentPage] = nextCursor
    setCursorsHistory(nextHistory)
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    fetchProducts(nextCursor)
  }

  const handlePrevPage = () => {
    if (currentPage === 1) return
    const prevPage = currentPage - 1
    setCurrentPage(prevPage)
    const prevCursor = cursorsHistory[prevPage - 1]
    fetchProducts(prevCursor)
  }

  const handleClearFilters = () => {
    setSearch('')
    setCategory('')
    setMinPrice('')
    setMaxPrice('')
    setLimit(20)
  }

  return (
    <div className="space-y-6 select-none min-h-screen">
      <PageHeader
        title="Product Catalog"
        subtitle="200,000 products · browsed newest first"
      />

      <ProductFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        categories={categories}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onClear={handleClearFilters}
      />

      {loading ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: limit }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="border border-border rounded-lg bg-bg-surface p-5 space-y-4 animate-pulse">
            <div className="h-6 bg-bg-elevated rounded w-full" />
            <div className="h-6 bg-bg-elevated rounded w-full" />
            <div className="h-6 bg-bg-elevated rounded w-full" />
          </div>
        )
      ) : products.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No products found"
          description="Try adjusting your keywords, category selector, or price range filters."
          action={{
            label: 'Clear Filters',
            onClick: handleClearFilters,
          }}
        />
      ) : viewMode === 'grid' ? (
        <ProductGrid products={products} />
      ) : (
        <ProductList products={products} />
      )}

      {products.length > 0 && (
        <Pagination
          currentPage={currentPage}
          limit={limit}
          hasMore={hasMore}
          onPrev={handlePrevPage}
          onNext={handleNextPage}
          onLimitChange={setLimit}
        />
      )}
    </div>
  )
}
