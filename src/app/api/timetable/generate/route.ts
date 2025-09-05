import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId } = body

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      )
    }

    // Check if student exists
    const student = await db.student.findUnique({
      where: { id: studentId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true
          }
        }
      }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Get all subjects
    const subjects = await db.subject.findMany({
      include: {
        teacher: {
          include: {
            availabilities: true
          }
        }
      }
    })

    if (subjects.length === 0) {
      return NextResponse.json(
        { error: 'No subjects available for scheduling' },
        { status: 400 }
      )
    }

    // Clear existing timetable entries for this student
    await db.timetableEntry.deleteMany({
      where: { studentId }
    })

    // Simple scheduling algorithm
    const generatedEntries = []
    const workingDays = [1, 2, 3, 4, 5] // Monday to Friday
    const timeSlots = [
      { start: 9, end: 10 },
      { start: 10, end: 11 },
      { start: 11, end: 12 },
      { start: 14, end: 15 },
      { start: 15, end: 16 },
      { start: 16, end: 17 }
    ]

    // Assign subjects to available slots
    for (const subject of subjects) {
      let scheduled = false
      
      for (const day of workingDays) {
        if (scheduled) break
        
        for (const slot of timeSlots) {
          if (scheduled) break
          
          // Check if teacher is available
          const teacherAvailable = subject.teacher.availabilities.some(
            avail => 
              avail.dayOfWeek === day &&
              avail.startTime <= slot.start &&
              avail.endTime >= slot.end
          )
          
          if (!teacherAvailable) continue
          
          // Check for conflicts
          const conflicts = await db.timetableEntry.findMany({
            where: {
              OR: [
                {
                  studentId,
                  dayOfWeek: day,
                  OR: [
                    {
                      AND: [
                        { startTime: { lte: slot.start } },
                        { endTime: { gt: slot.start } }
                      ]
                    },
                    {
                      AND: [
                        { startTime: { lt: slot.end } },
                        { endTime: { gte: slot.end } }
                      ]
                    }
                  ]
                },
                {
                  teacherId: subject.teacherId,
                  dayOfWeek: day,
                  OR: [
                    {
                      AND: [
                        { startTime: { lte: slot.start } },
                        { endTime: { gt: slot.start } }
                      ]
                    },
                    {
                      AND: [
                        { startTime: { lt: slot.end } },
                        { endTime: { gte: slot.end } }
                      ]
                    }
                  ]
                }
              ]
            }
          })
          
          if (conflicts.length === 0) {
            // Create timetable entry
            const entry = await db.timetableEntry.create({
              data: {
                subjectId: subject.id,
                teacherId: subject.teacherId,
                studentId,
                dayOfWeek: day,
                startTime: slot.start,
                endTime: slot.end,
                room: `A${Math.floor(Math.random() * 900) + 101}` // Random room number
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
            
            generatedEntries.push(entry)
            scheduled = true
          }
        }
      }
    }

    return NextResponse.json({
      message: 'Timetable generated successfully',
      entries: generatedEntries,
      totalEntries: generatedEntries.length
    })
  } catch (error) {
    console.error('Error generating timetable:', error)
    return NextResponse.json(
      { error: 'Failed to generate timetable' },
      { status: 500 }
    )
  }
}