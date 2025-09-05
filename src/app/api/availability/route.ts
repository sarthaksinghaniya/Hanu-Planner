import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get('teacherId') || ''
    const dayOfWeek = searchParams.get('dayOfWeek') ? parseInt(searchParams.get('dayOfWeek')!) : null

    const whereClause: any = {}
    if (teacherId) whereClause.teacherId = teacherId
    if (dayOfWeek) whereClause.dayOfWeek = dayOfWeek

    const availabilities = await db.availability.findMany({
      where: whereClause,
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true
          }
        }
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    })

    return NextResponse.json(availabilities)
  } catch (error) {
    console.error('Error fetching availabilities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availabilities' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { teacherId, dayOfWeek, startTime, endTime } = body

    // Validate input
    if (!teacherId || !dayOfWeek || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if teacher exists
    const teacher = await db.teacher.findUnique({
      where: { id: teacherId }
    })

    if (!teacher) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      )
    }

    // Validate time range
    if (startTime >= endTime) {
      return NextResponse.json(
        { error: 'Start time must be before end time' },
        { status: 400 }
      )
    }

    // Check for overlapping availability
    const existingAvailability = await db.availability.findFirst({
      where: {
        teacherId,
        dayOfWeek,
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } }
            ]
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } }
            ]
          },
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } }
            ]
          }
        ]
      }
    })

    if (existingAvailability) {
      return NextResponse.json(
        { error: 'Availability conflicts with existing schedule' },
        { status: 400 }
      )
    }

    const availability = await db.availability.create({
      data: {
        teacherId,
        dayOfWeek,
        startTime,
        endTime
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true
          }
        }
      }
    })

    return NextResponse.json(availability, { status: 201 })
  } catch (error) {
    console.error('Error creating availability:', error)
    return NextResponse.json(
      { error: 'Failed to create availability' },
      { status: 500 }
    )
  }
}