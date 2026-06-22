import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const app = await prisma.application.findUnique({
      where: { id: params.id },
      include: { history: { orderBy: { changedAt: 'desc' } } }
    })
    if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ data: app })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const current = await prisma.application.findUnique({ where: { id: params.id } })
    if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const statusChanged = body.status && body.status !== current.status

    const updated = await prisma.application.update({
      where: { id: params.id },
      data: {
        ...body,
        ...(statusChanged && {
          history: {
            create: { fromStatus: current.status, toStatus: body.status }
          }
        })
      },
      include: { history: { orderBy: { changedAt: 'desc' } } }
    })

    return NextResponse.json({ data: updated })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.application.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 })
  }
}
