'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddEntryFormProps {
  onAddEntry: (entry: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    subjectName: string;
    teacherName: string;
    room: string;
  }) => void;
  className?: string;
}

export const AddEntryForm = ({ onAddEntry, className = '' }: AddEntryFormProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    dayOfWeek: 1, // Monday by default
    startTime: '09:00',
    endTime: '10:00',
    subjectName: '',
    teacherName: '',
    room: ''
  });
  
  // Track the selected day as string for the Select component
  const [selectedDay, setSelectedDay] = useState('1');

  const daysOfWeek = [
    { value: '1', label: 'Monday' },
    { value: '2', label: 'Tuesday' },
    { value: '3', label: 'Wednesday' },
    { value: '4', label: 'Thursday' },
    { value: '5', label: 'Friday' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEntry({
      ...formData,
      dayOfWeek: Number(selectedDay) // Use the selectedDay string converted to number
    });
    setOpen(false);
    // Reset form
    setFormData({
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '10:00',
      subjectName: '',
      teacherName: '',
      room: ''
    });
    setSelectedDay('1');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          <Plus className="h-4 w-4 mr-2" />
          Add Manual Entry
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Timetable Entry</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="day">Day</Label>
              <Select 
                value={selectedDay}
                onValueChange={(value) => {
                  setSelectedDay(value);
                  setFormData({...formData, dayOfWeek: Number(value)});
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map(day => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="room">Room</Label>
              <Input 
                id="room" 
                placeholder="Room number" 
                value={formData.room}
                onChange={(e) => setFormData({...formData, room: e.target.value})}
                required 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input 
                id="startTime" 
                type="time" 
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input 
                id="endTime" 
                type="time" 
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                required 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subjectName">Subject</Label>
            <Input 
              id="subjectName" 
              placeholder="Subject name" 
              value={formData.subjectName}
              onChange={(e) => setFormData({...formData, subjectName: e.target.value})}
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="teacherName">Teacher</Label>
            <Input 
              id="teacherName" 
              placeholder="Teacher's name" 
              value={formData.teacherName}
              onChange={(e) => setFormData({...formData, teacherName: e.target.value})}
              required 
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Entry</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
