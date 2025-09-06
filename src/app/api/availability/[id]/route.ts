import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const availability = await db.availability.findUnique({
      where: { id: params.id },
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

    if (!availability) {
      return NextResponse.json(
        { error: 'Availability not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(availability)
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const body = await request.json()
    const { dayOfWeek, startTime, endTime } = body

    // Check if availability exists
    const existingAvailability = await db.availability.findUnique({
      where: { id: params.id }
    })

    if (!existingAvailability) {
      return NextResponse.json(
        { error: 'Availability not found' },
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

    // Check for overlapping availability (excluding current one)
    const conflictingAvailability = await db.availability.findFirst({
      where: {
        teacherId: existingAvailability.teacherId,
        dayOfWeek,
        id: { not: params.id },
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

    if (conflictingAvailability) {
      return NextResponse.json(
        { error: 'Availability conflicts with existing schedule' },
        { status: 400 }
      )
    }

    const availability = await db.availability.update({
      where: { id: params.id },
      data: {
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

    return NextResponse.json(availability)
  } catch (error) {
    console.error('Error updating availability:', error)
    return NextResponse.json(
      { error: 'Failed to update availability' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Check if availability exists
    const existingAvailability = await db.availability.findUnique({
      where: { id: params.id }
    })

    if (!existingAvailability) {
      return NextResponse.json(
        { error: 'Availability not found' },
        { status: 404 }
      )
    }

    await db.availability.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Availability deleted successfully' })
  } catch (error) {
    console.error('Error deleting availability:', error)
    return NextResponse.json(
      { error: 'Failed to delete availability' },
      { status: 500 }
    )
  }
}