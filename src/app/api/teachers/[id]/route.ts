import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teacher = await db.teacher.findUnique({
      where: { id: params.id },
      include: {
        subjects: true,
        availabilities: true,
        timetableEntries: {
          include: {
            subject: true,
            student: true
          }
        },
        user: {
          select: {
            id: true,
            email: true,
            role: true
          }
        }
      }
    })

    if (!teacher) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(teacher)
  } catch (error) {
    console.error('Error fetching teacher:', error)
    return NextResponse.json(
      { error: 'Failed to fetch teacher' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, email, department } = body

    // Check if teacher exists
    const existingTeacher = await db.teacher.findUnique({
      where: { id: params.id }
    })

    if (!existingTeacher) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      )
    }

    // Check if email is being changed and if it conflicts with another teacher
    if (email !== existingTeacher.email) {
      const emailConflict = await db.teacher.findFirst({
        where: { 
          email: email,
          id: { not: params.id }
        }
      })

      if (emailConflict) {
        return NextResponse.json(
          { error: 'Teacher with this email already exists' },
          { status: 400 }
        )
      }
    }

    const teacher = await db.teacher.update({
      where: { id: params.id },
      data: {
        name,
        email,
        department
      },
      include: {
        subjects: true,
        availabilities: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true
          }
        }
      }
    })

    return NextResponse.json(teacher)
  } catch (error) {
    console.error('Error updating teacher:', error)
    return NextResponse.json(
      { error: 'Failed to update teacher' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if teacher exists
    const existingTeacher = await db.teacher.findUnique({
      where: { id: params.id },
      include: {
        subjects: true,
        timetableEntries: true
      }
    })

    if (!existingTeacher) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      )
    }

    // Check if teacher has associated subjects or timetable entries
    if (existingTeacher.subjects.length > 0 || existingTeacher.timetableEntries.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete teacher with associated subjects or timetable entries' },
        { status: 400 }
      )
    }

    await db.teacher.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Teacher deleted successfully' })
  } catch (error) {
    console.error('Error deleting teacher:', error)
    return NextResponse.json(
      { error: 'Failed to delete teacher' },
      { status: 500 }
    )
  }
}