'use client'

import { useState } from 'react'
import Layout from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Plus, RefreshCw, Clock, User, BookOpen, MapPin } from 'lucide-react'

interface TimetableEntry {
  id: string
  subjectId: string
  subjectName: string
  subjectCode: string
  teacherId: string
  teacherName: string
  studentId: string
  studentName: string
  dayOfWeek: number
  startTime: number
  endTime: number
  room: string
}

interface Subject {
  id: string
  name: string
  code: string
  teacherId: string
  teacherName: string
}

interface Student {
  id: string
  name: string
  email: string
  grade: string
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

const timeSlots = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM

export default function TimetablePage() {
  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>([
    {
      id: '1',
      subjectId: '1',
      subjectName: 'Mathematics',
      subjectCode: 'MATH101',
      teacherId: '1',
      teacherName: 'Dr. Sarah Johnson',
      studentId: '1',
      studentName: 'John Doe',
      dayOfWeek: 1,
      startTime: 9,
      endTime: 10,
      room: 'A101'
    },
    {
      id: '2',
      subjectId: '2',
      subjectName: 'Physics',
      subjectCode: 'PHYS101',
      teacherId: '2',
      teacherName: 'Prof. Michael Chen',
      studentId: '1',
      studentName: 'John Doe',
      dayOfWeek: 1,
      startTime: 11,
      endTime: 12,
      room: 'B201'
    },
    {
      id: '3',
      subjectId: '3',
      subjectName: 'Chemistry',
      subjectCode: 'CHEM101',
      teacherId: '3',
      teacherName: 'Dr. Emily Davis',
      studentId: '1',
      studentName: 'John Doe',
      dayOfWeek: 2,
      startTime: 14,
      endTime: 15,
      room: 'C301'
    }
  ])

  const [subjects] = useState<Subject[]>([
    { id: '1', name: 'Mathematics', code: 'MATH101', teacherId: '1', teacherName: 'Dr. Sarah Johnson' },
    { id: '2', name: 'Physics', code: 'PHYS101', teacherId: '2', teacherName: 'Prof. Michael Chen' },
    { id: '3', name: 'Chemistry', code: 'CHEM101', teacherId: '3', teacherName: 'Dr. Emily Davis' }
  ])

  const [students] = useState<Student[]>([
    { id: '1', name: 'John Doe', email: 'john.doe@hanu.edu', grade: '10' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@hanu.edu', grade: '10' },
    { id: '3', name: 'Bob Johnson', email: 'bob.johnson@hanu.edu', grade: '11' }
  ])

  const [selectedStudent, setSelectedStudent] = useState<string>('1')
  const [isGenerating, setIsGenerating] = useState(false)

  const filteredEntries = timetableEntries.filter(entry => 
    selectedStudent === '' || entry.studentId === selectedStudent
  )

  const formatTime = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:00 ${period}`
  }

  const generateTimetable = async () => {
    setIsGenerating(true)
    
    // Simulate API call for timetable generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate some sample timetable entries
    const newEntries: TimetableEntry[] = []
    const student = students.find(s => s.id === selectedStudent)
    
    if (student) {
      // Simple algorithm to assign subjects to available slots
      const availableSlots = [
        { day: 1, start: 9, end: 10 },
        { day: 1, start: 11, end: 12 },
        { day: 2, start: 9, end: 10 },
        { day: 2, start: 14, end: 15 },
        { day: 3, start: 10, end: 11 },
        { day: 3, start: 15, end: 16 }
      ]
      
      subjects.slice(0, Math.min(subjects.length, availableSlots.length)).forEach((subject, index) => {
        const slot = availableSlots[index]
        newEntries.push({
          id: Date.now().toString() + index,
          subjectId: subject.id,
          subjectName: subject.name,
          subjectCode: subject.code,
          teacherId: subject.teacherId,
          teacherName: subject.teacherName,
          studentId: selectedStudent,
          studentName: student.name,
          dayOfWeek: slot.day,
          startTime: slot.start,
          endTime: slot.end,
          room: `A${(index + 1) * 101}`
        })
      })
    }
    
    setTimetableEntries(newEntries)
    setIsGenerating(false)
  }

  const getTimetableGrid = () => {
    const grid: { [key: string]: { [key: number]: TimetableEntry | null } } = {}
    
    // Initialize grid
    daysOfWeek.forEach((_, dayIndex) => {
      grid[dayIndex + 1] = {}
      timeSlots.forEach(time => {
        grid[dayIndex + 1][time] = null
      })
    })
    
    // Fill grid with entries
    filteredEntries.forEach(entry => {
      if (grid[entry.dayOfWeek]) {
        grid[entry.dayOfWeek][entry.startTime] = entry
      }
    })
    
    return grid
  }

  const timetableGrid = getTimetableGrid()

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Timetable</h1>
            <p className="text-muted-foreground">
              Generate and view class schedules
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent>
                {students.map(student => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} (Grade {student.grade})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={generateTimetable} disabled={isGenerating}>
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Calendar className="h-4 w-4 mr-2" />
              )}
              {isGenerating ? 'Generating...' : 'Generate Timetable'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="grid" className="space-y-4">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="grid" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Timetable</CardTitle>
                <CardDescription>
                  Visual representation of the weekly schedule.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border p-2 text-left font-medium min-w-[80px]">Time</th>
                        {daysOfWeek.map(day => (
                          <th key={day} className="border p-2 text-center font-medium min-w-[120px]">
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timeSlots.map(time => (
                        <tr key={time}>
                          <td className="border p-2 font-medium text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(time)}
                            </div>
                          </td>
                          {daysOfWeek.map((_, dayIndex) => {
                            const entry = timetableGrid[dayIndex + 1]?.[time]
                            return (
                              <td key={`${dayIndex}-${time}`} className="border p-2 align-top">
                                {entry ? (
                                  <div className="bg-primary/10 rounded p-2 text-sm">
                                    <div className="font-medium">{entry.subjectName}</div>
                                    <div className="text-xs text-muted-foreground">{entry.subjectCode}</div>
                                    <div className="flex items-center gap-1 mt-1">
                                      <User className="h-3 w-3" />
                                      <span className="text-xs">{entry.teacherName}</span>
                                    </div>
                                    <div className="flex items-center gap-1 mt-1">
                                      <MapPin className="h-3 w-3" />
                                      <span className="text-xs">{entry.room}</span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="h-16 bg-muted/20 rounded"></div>
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Schedule List</CardTitle>
                <CardDescription>
                  Detailed list of all scheduled classes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Day</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Room</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{entry.subjectName}</div>
                            <div className="text-sm text-muted-foreground">{entry.subjectCode}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {entry.teacherName}
                          </div>
                        </TableCell>
                        <TableCell>{entry.studentName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            <Calendar className="h-3 w-3 mr-1" />
                            {daysOfWeek[entry.dayOfWeek - 1]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {entry.room}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>
                Current timetable overview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Classes:</span>
                  <span className="font-medium">{filteredEntries.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subjects Covered:</span>
                  <span className="font-medium">
                    {new Set(filteredEntries.map(e => e.subjectId)).size}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Teachers Assigned:</span>
                  <span className="font-medium">
                    {new Set(filteredEntries.map(e => e.teacherId)).size}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common timetable operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Add Manual Entry
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate Timetable
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Export to PDF
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Changes</CardTitle>
              <CardDescription>
                Latest timetable updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium">Timetable generated</p>
                    <p className="text-xs text-muted-foreground">For John Doe (Grade 10)</p>
                    <p className="text-xs text-muted-foreground">5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium">Class rescheduled</p>
                    <p className="text-xs text-muted-foreground">Physics moved to Room B202</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}