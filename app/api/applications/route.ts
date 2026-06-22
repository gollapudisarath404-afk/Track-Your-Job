import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const archived = searchParams.get('archived') === 'true'
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const applications = await prisma.application.findMany({
      where: {
        archived,
        ...(status && { status: status as any }),
        ...(search && {
          OR: [
            { company: { contains: search, mode: 'insensitive' } },
            { role: { contains: search, mode: 'insensitive' } }
          ]
        }),
      },
      include: { history: { orderBy: { changedAt: 'desc' }, take: 5 } },
      orderBy: { appliedAt: 'desc' },
    })

    return NextResponse.json({ data: applications })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { company, role, status, source, jobUrl, salary, notes, appliedAt } = body

    if (!company || !role) {
      return NextResponse.json({ error: 'company and role are required' }, { status: 400 })
    }

    const app = await prisma.application.create({
      data: {
        company, role,
        status: status || 'APPLIED',
        source, jobUrl, salary, notes,
        appliedAt: appliedAt ? new Date(appliedAt) : new Date(),
        history: {
          create: { toStatus: status || 'APPLIED' }
        }
      },
      include: { history: true }
    })

    return NextResponse.json({ data: app }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 })
  }
}
