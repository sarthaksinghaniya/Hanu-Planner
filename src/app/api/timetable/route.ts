import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId') || ''
    const teacherId = searchParams.get('teacherId') || ''
    const subjectId = searchParams.get('subjectId') || ''

    const whereClause: any = {}
    if (studentId) whereClause.studentId = studentId
    if (teacherId) whereClause.teacherId = teacherId
    if (subjectId) whereClause.subjectId = subjectId

    const timetableEntries = await db.timetableEntry.findMany({
      where: whereClause,
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
            description: true
          }
        },
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true
          }
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            grade: true
          }
        }
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    })

    return NextResponse.json(timetableEntries)
  } catch (error) {
    console.error('Error fetching timetable entries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch timetable entries' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subjectId, teacherId, studentId, dayOfWeek, startTime, endTime, room } = body

    // Validate input
    if (!subjectId || !teacherId || !studentId || !dayOfWeek || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate time range
    if (startTime >= endTime) {
      return NextResponse.json(
        { error: 'Start time must be before end time' },
        { status: 400 }
      )
    }

    // Check if subject, teacher, and student exist
    const subject = await db.subject.findUnique({ where: { id: subjectId } })
    const teacher = await db.teacher.findUnique({ where: { id: teacherId } })
    const student = await db.student.findUnique({ where: { id: studentId } })

    if (!subject || !teacher || !student) {
      return NextResponse.json(
        { error: 'Subject, teacher, or student not found' },
        { status: 404 }
      )
    }

    // Check for conflicts
    const conflicts = await db.timetableEntry.findMany({
      where: {
        OR: [
          // Student conflict
          {
            studentId,
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
          },
          // Teacher conflict
          {
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
        ]
      }
    })

    if (conflicts.length > 0) {
      return NextResponse.json(
        { error: 'Schedule conflict detected', conflicts },
        { status: 400 }
      )
    }

    // Check teacher availability
    const teacherAvailable = await db.availability.findFirst({
      where: {
        teacherId,
        dayOfWeek,
        startTime: { lte: startTime },
        endTime: { gte: endTime }
      }
    })

    if (!teacherAvailable) {
      return NextResponse.json(
        { error: 'Teacher is not available during this time slot' },
        { status: 400 }
      )
    }

    const timetableEntry = await db.timetableEntry.create({
      data: {
        subjectId,
        teacherId,
        studentId,
        dayOfWeek,
        startTime,
        endTime,
        room: room || null
      },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
            description: true
          }
        },
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true
          }
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            grade: true
          }
        }
      }
    })

    return NextResponse.json(timetableEntry, { status: 201 })
  } catch (error) {
    console.error('Error creating timetable entry:', error)
    return NextResponse.json(
      { error: 'Failed to create timetable entry' },
      { status: 500 }
    )
  }
}