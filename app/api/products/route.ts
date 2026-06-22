import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const limitParam = parseInt(searchParams.get('limit') || '20')
  const limit = Math.min(Math.max(limitParam, 1), 100)
  const cursorParam = searchParams.get('cursor')
  const category = searchParams.get('category') || undefined
  const search = searchParams.get('search') || undefined
  const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined
  const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined

  try {
    let cursor: { createdAt: string; id: string } | null = null
    if (cursorParam) {
      cursor = JSON.parse(Buffer.from(cursorParam, 'base64').toString('utf-8'))
    }

    const products = await prisma.$queryRawUnsafe<any[]>(`
      SELECT id, name, category, price::float, "createdAt", "updatedAt"
      FROM "Product"
      WHERE 1=1
        ${cursor ? `AND ("createdAt", id) < ('${cursor.createdAt}'::timestamptz, '${cursor.id}')` : ''}
        ${category ? `AND category = '${category.replace(/'/g, "''")}'` : ''}
        ${search ? `AND name ILIKE '%${search.replace(/'/g, "''")}%'` : ''}
        ${minPrice !== undefined ? `AND price >= ${minPrice}` : ''}
        ${maxPrice !== undefined ? `AND price <= ${maxPrice}` : ''}
      ORDER BY "createdAt" DESC, id DESC
      LIMIT ${limit}
    `)

    const lastRow = products[products.length - 1]
    const nextCursor = lastRow && products.length === limit
      ? Buffer.from(JSON.stringify({ createdAt: lastRow.createdAt, id: lastRow.id })).toString('base64')
      : null

    const categories = await prisma.$queryRaw<{ category: string }[]>`
      SELECT DISTINCT category FROM "Product" ORDER BY category
    `

    return NextResponse.json({
      data: products,
      nextCursor,
      categories: categories.map(c => c.category),
      hasMore: !!nextCursor,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
