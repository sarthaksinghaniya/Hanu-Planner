'use client'

import { useState } from 'react'
import Layout from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Calendar, Clock, BookOpen, User, MapPin, Bell } from 'lucide-react'

interface TimetableEntry {
  id: string
  subjectName: string
  subjectCode: string
  teacherName: string
  dayOfWeek: number
  startTime: number
  endTime: number
  room: string
}

const daysOfWeek = [
  'Monday',
  'Tuesday', 
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
]

export default function StudentPage() {
  const [timetableEntries] = useState<TimetableEntry[]>([
    {
      id: '1',
      subjectName: 'Mathematics',
      subjectCode: 'MATH101',
      teacherName: 'Dr. Sarah Johnson',
      dayOfWeek: 1,
      startTime: 9,
      endTime: 10,
      room: 'A101'
    },
    {
      id: '2',
      subjectName: 'Physics',
      subjectCode: 'PHYS101',
      teacherName: 'Prof. Michael Chen',
      dayOfWeek: 1,
      startTime: 11,
      endTime: 12,
      room: 'B201'
    },
    {
      id: '3',
      subjectName: 'Chemistry',
      subjectCode: 'CHEM101',
      teacherName: 'Dr. Emily Davis',
      dayOfWeek: 2,
      startTime: 14,
      endTime: 15,
      room: 'C301'
    }
  ])

  const [studentInfo] = useState({
    name: 'John Doe',
    grade: '10',
    email: 'john.doe@hanu.edu',
    totalSubjects: 3,
    totalClasses: 15
  })

  const formatTime = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:00 ${period}`
  }

  const getTodaySchedule = () => {
    const today = new Date().getDay() // 0 = Sunday, 1 = Monday, etc.
    const dayOfWeek = today === 0 ? 7 : today // Convert Sunday to 7
    return timetableEntries.filter(entry => entry.dayOfWeek === dayOfWeek)
  }

  const getUpcomingClasses = () => {
    const now = new Date()
    const currentDay = now.getDay() === 0 ? 7 : now.getDay()
    const currentHour = now.getHours()
    
    return timetableEntries
      .filter(entry => {
        if (entry.dayOfWeek === currentDay) {
          return entry.startTime > currentHour
        }
        return entry.dayOfWeek > currentDay
      })
      .slice(0, 3)
  }

  const todaySchedule = getTodaySchedule()
  const upcomingClasses = getUpcomingClasses()

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {studentInfo.name}!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              Grade {studentInfo.grade}
            </Badge>
            <Badge variant="secondary">
              <Bell className="h-3 w-3 mr-1" />
              3 notifications
            </Badge>
          </div>
        </div>

        {/* Student Info Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentInfo.totalSubjects}</div>
              <p className="text-xs text-muted-foreground">
                Active this semester
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentInfo.totalClasses}</div>
              <p className="text-xs text-muted-foreground">
                Per week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todaySchedule.length}</div>
              <p className="text-xs text-muted-foreground">
                Scheduled for today
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">95%</div>
              <p className="text-xs text-muted-foreground">
                This semester
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>
                Your classes for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todaySchedule.length > 0 ? (
                <div className="space-y-3">
                  {todaySchedule.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <span className="font-medium">{entry.subjectName}</span>
                          <Badge variant="secondary" className="text-xs">
                            {entry.subjectCode}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {entry.room}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {entry.teacherName}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No classes scheduled for today</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Classes */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Classes</CardTitle>
              <CardDescription>
                Your next few classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingClasses.length > 0 ? (
                <div className="space-y-3">
                  {upcomingClasses.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <span className="font-medium">{entry.subjectName}</span>
                          <Badge variant="outline" className="text-xs">
                            {daysOfWeek[entry.dayOfWeek - 1]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {entry.room}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {entry.teacherName}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming classes</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Full Weekly Timetable */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Timetable</CardTitle>
            <CardDescription>
              Your complete weekly schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Monday</TableHead>
                  <TableHead>Tuesday</TableHead>
                  <TableHead>Wednesday</TableHead>
                  <TableHead>Thursday</TableHead>
                  <TableHead>Friday</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { time: '9:00 - 10:00', hour: 9 },
                  { time: '10:00 - 11:00', hour: 10 },
                  { time: '11:00 - 12:00', hour: 11 },
                  { time: '14:00 - 15:00', hour: 14 },
                  { time: '15:00 - 16:00', hour: 15 },
                  { time: '16:00 - 17:00', hour: 16 }
                ].map((timeSlot) => (
                  <TableRow key={timeSlot.hour}>
                    <TableCell className="font-medium">{timeSlot.time}</TableCell>
                    {daysOfWeek.slice(0, 5).map((day, index) => {
                      const entry = timetableEntries.find(
                        e => e.dayOfWeek === index + 1 && e.startTime === timeSlot.hour
                      )
                      return (
                        <TableCell key={day}>
                          {entry ? (
                            <div className="bg-primary/10 rounded p-2">
                              <div className="font-medium text-sm">{entry.subjectName}</div>
                              <div className="text-xs text-muted-foreground">
                                {entry.teacherName}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {entry.room}
                              </div>
                            </div>
                          ) : (
                            <div className="h-12 bg-muted/20 rounded"></div>
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}