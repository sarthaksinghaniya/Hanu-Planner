import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const department = searchParams.get('department') || ''

    const teachers = await db.teacher.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ],
        ...(department && { department: { equals: department } })
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
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(teachers)
  } catch (error) {
    console.error('Error fetching teachers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch teachers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, department, userId } = body

    // Check if teacher with email already exists
    const existingTeacher = await db.teacher.findUnique({
      where: { email }
    })

    if (existingTeacher) {
      return NextResponse.json(
        { error: 'Teacher with this email already exists' },
        { status: 400 }
      )
    }

    // Create teacher
    const teacher = await db.teacher.create({
      data: {
        name,
        email,
        department,
        userId: userId || null
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

    return NextResponse.json(teacher, { status: 201 })
  } catch (error) {
    console.error('Error creating teacher:', error)
    return NextResponse.json(
      { error: 'Failed to create teacher' },
      { status: 500 }
    )
  }
}