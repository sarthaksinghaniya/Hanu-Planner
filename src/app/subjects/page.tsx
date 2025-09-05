'use client'

import { useState } from 'react'
import Layout from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Plus, Edit, Trash2, Search, User, Code } from 'lucide-react'

interface Subject {
  id: string
  name: string
  code: string
  description: string
  teacherId: string
  teacherName: string
  totalClasses: number
}

interface Teacher {
  id: string
  name: string
  email: string
  department: string
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: '1',
      name: 'Mathematics',
      code: 'MATH101',
      description: 'Introduction to Calculus and Algebra',
      teacherId: '1',
      teacherName: 'Dr. Sarah Johnson',
      totalClasses: 15
    },
    {
      id: '2',
      name: 'Physics',
      code: 'PHYS101',
      description: 'Fundamentals of Mechanics and Thermodynamics',
      teacherId: '2',
      teacherName: 'Prof. Michael Chen',
      totalClasses: 12
    },
    {
      id: '3',
      name: 'Chemistry',
      code: 'CHEM101',
      description: 'Organic and Inorganic Chemistry Basics',
      teacherId: '3',
      teacherName: 'Dr. Emily Davis',
      totalClasses: 18
    }
  ])

  const [teachers] = useState<Teacher[]>([
    { id: '1', name: 'Dr. Sarah Johnson', email: 'sarah.johnson@hanu.edu', department: 'Mathematics' },
    { id: '2', name: 'Prof. Michael Chen', email: 'michael.chen@hanu.edu', department: 'Physics' },
    { id: '3', name: 'Dr. Emily Davis', email: 'emily.davis@hanu.edu', department: 'Chemistry' }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddSubject = (formData: FormData) => {
    const teacherId = formData.get('teacherId') as string
    const teacher = teachers.find(t => t.id === teacherId)
    
    if (!teacher) return

    const newSubject: Subject = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      description: formData.get('description') as string,
      teacherId,
      teacherName: teacher.name,
      totalClasses: 0
    }
    setSubjects([...subjects, newSubject])
    setIsAddDialogOpen(false)
  }

  const handleEditSubject = (formData: FormData) => {
    if (!editingSubject) return
    
    const teacherId = formData.get('teacherId') as string
    const teacher = teachers.find(t => t.id === teacherId)
    
    if (!teacher) return

    const updatedSubject = {
      ...editingSubject,
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      description: formData.get('description') as string,
      teacherId,
      teacherName: teacher.name
    }
    
    setSubjects(subjects.map(s => s.id === editingSubject.id ? updatedSubject : s))
    setEditingSubject(null)
  }

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id))
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Subjects</h1>
            <p className="text-muted-foreground">
              Manage subjects and their assignments
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Subject</DialogTitle>
                <DialogDescription>
                  Create a new subject in the system.
                </DialogDescription>
              </DialogHeader>
              <form action={handleAddSubject}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" name="name" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="code" className="text-right">
                      Code
                    </Label>
                    <Input id="code" name="code" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Input id="description" name="description" className="col-span-3" />
                  </div>
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
                </div>
                <DialogFooter>
                  <Button type="submit">Add Subject</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="cards">Card View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>All Subjects</CardTitle>
                <CardDescription>
                  A list of all subjects in the system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Classes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubjects.map((subject) => (
                      <TableRow key={subject.id}>
                        <TableCell className="font-medium">{subject.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            <Code className="h-3 w-3 mr-1" />
                            {subject.code}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{subject.description}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {subject.teacherName}
                          </div>
                        </TableCell>
                        <TableCell>{subject.totalClasses}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingSubject(subject)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Edit Subject</DialogTitle>
                                  <DialogDescription>
                                    Update subject information.
                                  </DialogDescription>
                                </DialogHeader>
                                <form action={handleEditSubject}>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="edit-name" className="text-right">
                                        Name
                                      </Label>
                                      <Input
                                        id="edit-name"
                                        name="name"
                                        defaultValue={editingSubject?.name}
                                        className="col-span-3"
                                        required
                                      />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="edit-code" className="text-right">
                                        Code
                                      </Label>
                                      <Input
                                        id="edit-code"
                                        name="code"
                                        defaultValue={editingSubject?.code}
                                        className="col-span-3"
                                        required
                                      />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="edit-description" className="text-right">
                                        Description
                                      </Label>
                                      <Input
                                        id="edit-description"
                                        name="description"
                                        defaultValue={editingSubject?.description}
                                        className="col-span-3"
                                      />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="edit-teacher" className="text-right">
                                        Teacher
                                      </Label>
                                      <Select name="teacherId" defaultValue={editingSubject?.teacherId} required>
                                        <SelectTrigger className="col-span-3">
                                          <SelectValue />
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
                              onClick={() => handleDeleteSubject(subject.id)}
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
          
          <TabsContent value="cards" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredSubjects.map((subject) => (
                <Card key={subject.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      {subject.name}
                    </CardTitle>
                    <CardDescription>
                      <Badge variant="secondary">
                        <Code className="h-3 w-3 mr-1" />
                        {subject.code}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">{subject.description}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4" />
                        {subject.teacherName}
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm text-muted-foreground">
                          {subject.totalClasses} classes
                        </span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteSubject(subject.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}