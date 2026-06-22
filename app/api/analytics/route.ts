import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [statusCounts, weeklyCounts, sourceCounts] = await Promise.all([
      // Status distribution
      prisma.application.groupBy({
        by: ['status'],
        where: { archived: false },
        _count: { _all: true },
      }),

      // Applications per week (last 12 weeks)
      prisma.$queryRaw<{ week: string; count: number }[]>`
        SELECT
          to_char(date_trunc('week', "appliedAt"), 'Mon DD') AS week,
          COUNT(*)::int AS count
        FROM "Application"
        WHERE "appliedAt" >= NOW() - INTERVAL '12 weeks'
        GROUP BY date_trunc('week', "appliedAt")
        ORDER BY date_trunc('week', "appliedAt") ASC
      `.catch((err) => {
        console.error('Weekly raw query failed, returning fallback:', err)
        return []
      }),

      // Response rate by source
      prisma.$queryRaw<{ source: string; total: number; responded: number }[]>`
        SELECT
          COALESCE(source, 'Unknown') AS source,
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE status NOT IN ('APPLIED'))::int AS responded
        FROM "Application"
        GROUP BY source
        ORDER BY total DESC
      `.catch((err) => {
        console.error('Source raw query failed, returning fallback:', err)
        return []
      }),
    ])

    return NextResponse.json({ statusCounts, weeklyCounts, sourceCounts })
  } catch (error) {
    console.error('Analytics API failure:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
