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
import { Users, Plus, Edit, Trash2, Search, Mail, Building } from 'lucide-react'

interface Teacher {
  id: string
  name: string
  email: string
  department: string
  subjects: string[]
  totalClasses: number
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@hanu.edu',
      department: 'Mathematics',
      subjects: ['Calculus', 'Algebra', 'Statistics'],
      totalClasses: 15
    },
    {
      id: '2',
      name: 'Prof. Michael Chen',
      email: 'michael.chen@hanu.edu',
      department: 'Physics',
      subjects: ['Mechanics', 'Thermodynamics', 'Quantum Physics'],
      totalClasses: 12
    },
    {
      id: '3',
      name: 'Dr. Emily Davis',
      email: 'emily.davis@hanu.edu',
      department: 'Chemistry',
      subjects: ['Organic Chemistry', 'Inorganic Chemistry', 'Biochemistry'],
      totalClasses: 18
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)

  const departments = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'English',
    'History',
    'Geography'
  ]

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddTeacher = (formData: FormData) => {
    const newTeacher: Teacher = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      department: formData.get('department') as string,
      subjects: [],
      totalClasses: 0
    }
    setTeachers([...teachers, newTeacher])
    setIsAddDialogOpen(false)
  }

  const handleEditTeacher = (formData: FormData) => {
    if (!editingTeacher) return
    
    const updatedTeacher = {
      ...editingTeacher,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      department: formData.get('department') as string
    }
    
    setTeachers(teachers.map(t => t.id === editingTeacher.id ? updatedTeacher : t))
    setEditingTeacher(null)
  }

  const handleDeleteTeacher = (id: string) => {
    setTeachers(teachers.filter(t => t.id !== id))
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Teachers</h1>
            <p className="text-muted-foreground">
              Manage teachers and their assignments
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Teacher</DialogTitle>
                <DialogDescription>
                  Create a new teacher profile in the system.
                </DialogDescription>
              </DialogHeader>
              <form action={handleAddTeacher}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" name="name" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input id="email" name="email" type="email" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="department" className="text-right">
                      Department
                    </Label>
                    <Select name="department" required>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add Teacher</Button>
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
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>All Teachers</CardTitle>
                <CardDescription>
                  A list of all teachers in the system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Subjects</TableHead>
                      <TableHead>Classes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell className="font-medium">{teacher.name}</TableCell>
                        <TableCell>{teacher.email}</TableCell>
                        <TableCell>{teacher.department}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {teacher.subjects.slice(0, 2).map((subject, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {subject}
                              </Badge>
                            ))}
                            {teacher.subjects.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{teacher.subjects.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{teacher.totalClasses}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingTeacher(teacher)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Edit Teacher</DialogTitle>
                                  <DialogDescription>
                                    Update teacher information.
                                  </DialogDescription>
                                </DialogHeader>
                                <form action={handleEditTeacher}>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="edit-name" className="text-right">
                                        Name
                                      </Label>
                                      <Input
                                        id="edit-name"
                                        name="name"
                                        defaultValue={editingTeacher?.name}
                                        className="col-span-3"
                                        required
                                      />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="edit-email" className="text-right">
                                        Email
                                      </Label>
                                      <Input
                                        id="edit-email"
                                        name="email"
                                        type="email"
                                        defaultValue={editingTeacher?.email}
                                        className="col-span-3"
                                        required
                                      />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="edit-department" className="text-right">
                                        Department
                                      </Label>
                                      <Select name="department" defaultValue={editingTeacher?.department} required>
                                        <SelectTrigger className="col-span-3">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {departments.map(dept => (
                                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
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
                              onClick={() => handleDeleteTeacher(teacher.id)}
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
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTeachers.map((teacher) => (
                <Card key={teacher.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {teacher.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      {teacher.department}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4" />
                        {teacher.email}
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Subjects</p>
                        <div className="flex flex-wrap gap-1">
                          {teacher.subjects.map((subject, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm text-muted-foreground">
                          {teacher.totalClasses} classes
                        </span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTeacher(teacher.id)}
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