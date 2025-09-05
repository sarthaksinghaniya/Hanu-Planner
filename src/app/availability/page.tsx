'use client'

import { useState } from 'react'
import Layout from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock, Plus, Edit, Trash2, Search, Calendar, User } from 'lucide-react'

interface Availability {
  id: string
  teacherId: string
  teacherName: string
  dayOfWeek: number
  startTime: number
  endTime: number
}

interface Teacher {
  id: string
  name: string
  email: string
  department: string
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

export default function AvailabilityPage() {
  const [availabilities, setAvailabilities] = useState<Availability[]>([
    {
      id: '1',
      teacherId: '1',
      teacherName: 'Dr. Sarah Johnson',
      dayOfWeek: 1,
      startTime: 9,
      endTime: 12
    },
    {
      id: '2',
      teacherId: '1',
      teacherName: 'Dr. Sarah Johnson',
      dayOfWeek: 3,
      startTime: 14,
      endTime: 17
    },
    {
      id: '3',
      teacherId: '2',
      teacherName: 'Prof. Michael Chen',
      dayOfWeek: 2,
      startTime: 10,
      endTime: 13
    },
    {
      id: '4',
      teacherId: '3',
      teacherName: 'Dr. Emily Davis',
      dayOfWeek: 1,
      startTime: 8,
      endTime: 11
    }
  ])

  const [teachers] = useState<Teacher[]>([
    { id: '1', name: 'Dr. Sarah Johnson', email: 'sarah.johnson@hanu.edu', department: 'Mathematics' },
    { id: '2', name: 'Prof. Michael Chen', email: 'michael.chen@hanu.edu', department: 'Physics' },
    { id: '3', name: 'Dr. Emily Davis', email: 'emily.davis@hanu.edu', department: 'Chemistry' }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTeacher, setSelectedTeacher] = useState<string>('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingAvailability, setEditingAvailability] = useState<Availability | null>(null)

  const filteredAvailabilities = availabilities.filter(availability =>
    availability.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedTeacher === '' || availability.teacherId === selectedTeacher)
  )

  const handleAddAvailability = (formData: FormData) => {
    const teacherId = formData.get('teacherId') as string
    const teacher = teachers.find(t => t.id === teacherId)
    
    if (!teacher) return

    const newAvailability: Availability = {
      id: Date.now().toString(),
      teacherId,
      teacherName: teacher.name,
      dayOfWeek: parseInt(formData.get('dayOfWeek') as string),
      startTime: parseInt(formData.get('startTime') as string),
      endTime: parseInt(formData.get('endTime') as string)
    }
    
    setAvailabilities([...availabilities, newAvailability])
    setIsAddDialogOpen(false)
  }

  const handleEditAvailability = (formData: FormData) => {
    if (!editingAvailability) return
    
    const updatedAvailability = {
      ...editingAvailability,
      dayOfWeek: parseInt(formData.get('dayOfWeek') as string),
      startTime: parseInt(formData.get('startTime') as string),
      endTime: parseInt(formData.get('endTime') as string)
    }
    
    setAvailabilities(availabilities.map(a => a.id === editingAvailability.id ? updatedAvailability : a))
    setEditingAvailability(null)
  }

  const handleDeleteAvailability = (id: string) => {
    setAvailabilities(availabilities.filter(a => a.id !== id))
  }

  const formatTime = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:00 ${period}`
  }

  const getAvailabilityMatrix = () => {
    const matrix: { [key: string]: { [key: number]: boolean } } = {}
    
    // Initialize matrix
    teachers.forEach(teacher => {
      matrix[teacher.name] = {}
      daysOfWeek.forEach((_, dayIndex) => {
        matrix[teacher.name][dayIndex + 1] = false
      })
    })
    
    // Mark available slots
    availabilities.forEach(availability => {
      if (matrix[availability.teacherName]) {
        matrix[availability.teacherName][availability.dayOfWeek] = true
      }
    })
    
    return matrix
  }

  const availabilityMatrix = getAvailabilityMatrix()

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Availability</h1>
            <p className="text-muted-foreground">
              Manage teacher availability for scheduling
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Availability
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Availability</DialogTitle>
                <DialogDescription>
                  Set teacher availability for scheduling.
                </DialogDescription>
              </DialogHeader>
              <form action={handleAddAvailability}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="teacher" className="text-right">
                      Teacher
                    </Label>
                    <Select name="teacherId" required>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map(teacher => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="day" className="text-right">
                      Day
                    </Label>
                    <Select name="dayOfWeek" required>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {daysOfWeek.map((day, index) => (
                          <SelectItem key={day} value={(index + 1).toString()}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startTime" className="text-right">
                      Start Time
                    </Label>
                    <Select name="startTime" required>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Start time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(time => (
                          <SelectItem key={time} value={time.toString()}>
                            {formatTime(time)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endTime" className="text-right">
                      End Time
                    </Label>
                    <Select name="endTime" required>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="End time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(time => (
                          <SelectItem key={time} value={time.toString()}>
                            {formatTime(time)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add Availability</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="matrix">Matrix View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by teacher name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Teachers</SelectItem>
                  {teachers.map(teacher => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Teacher Availability</CardTitle>
                <CardDescription>
                  Manage when teachers are available for classes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Day</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAvailabilities.map((availability) => (
                      <TableRow key={availability.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {availability.teacherName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            <Calendar className="h-3 w-3 mr-1" />
                            {daysOfWeek[availability.dayOfWeek - 1]}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatTime(availability.startTime)}</TableCell>
                        <TableCell>{formatTime(availability.endTime)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingAvailability(availability)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Edit Availability</DialogTitle>
                                  <DialogDescription>
                                    Update teacher availability.
                                  </DialogDescription>
                                </DialogHeader>
                                <form action={handleEditAvailability}>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="edit-day" className="text-right">
                                        Day
                                      </Label>
                                      <Select name="dayOfWeek" defaultValue={editingAvailability?.dayOfWeek.toString()} required>
                                        <SelectTrigger className="col-span-3">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {daysOfWeek.map((day, index) => (
                                            <SelectItem key={day} value={(index + 1).toString()}>
                                              {day}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="edit-startTime" className="text-right">
                                        Start Time
                                      </Label>
                                      <Select name="startTime" defaultValue={editingAvailability?.startTime.toString()} required>
                                        <SelectTrigger className="col-span-3">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {timeSlots.map(time => (
                                            <SelectItem key={time} value={time.toString()}>
                                              {formatTime(time)}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="edit-endTime" className="text-right">
                                        End Time
                                      </Label>
                                      <Select name="endTime" defaultValue={editingAvailability?.endTime.toString()} required>
                                        <SelectTrigger className="col-span-3">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {timeSlots.map(time => (
                                            <SelectItem key={time} value={time.toString()}>
                                              {formatTime(time)}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button type="submit">Save Changes</Button>
                                  </DialogFooter>
                                </form>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteAvailability(availability.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="matrix" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Availability Matrix</CardTitle>
                <CardDescription>
                  Visual overview of teacher availability across the week.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border p-2 text-left font-medium">Teacher</th>
                        {daysOfWeek.map(day => (
                          <th key={day} className="border p-2 text-center font-medium min-w-[100px]">
                            {day.substring(0, 3)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(availabilityMatrix).map(([teacherName, days]) => (
                        <tr key={teacherName}>
                          <td className="border p-2 font-medium">{teacherName}</td>
                          {daysOfWeek.map((_, dayIndex) => (
                            <td key={dayIndex} className="border p-2 text-center">
                              {days[dayIndex + 1] ? (
                                <Badge variant="default" className="bg-green-500">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Available
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-gray-200">
                                  Unavailable
                                </Badge>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}