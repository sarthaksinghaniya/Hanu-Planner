'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { generateDemoData, generateTeachers } from '@/lib/demoData';

interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  subjects: string[];
  availability: Array<{
    dayOfWeek: number;
    startTime: number;
    endTime: number;
  }>;
}

interface Class {
  id: string;
  name: string;
  grade: number;
  section: string;
  capacity: number;
}

interface TimetableSlot {
  dayOfWeek: number;
  startTime: number;
  endTime: number;
  period: number;
}

interface CourseAssignment {
  id: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  classId: string;
  className: string;
  hoursPerWeek: number;
}

interface DataContextType {
  teachers: Teacher[];
  classes: Class[];
  timetableSlots: TimetableSlot[];
  courseAssignments: CourseAssignment[];
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Generate initial demo data
  const [data, setData] = React.useState(generateDemoData());

  const refreshData = () => {
    setData(generateDemoData());
  };

  return (
    <DataContext.Provider value={{ ...data, refreshData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Helper function to get teacher availability
export const useTeacherAvailability = (teacherId: string) => {
  const { teachers } = useData();
  const teacher = teachers.find(t => t.id === teacherId);
  return teacher ? teacher.availability : [];
};

// Helper function to get classes for a teacher
export const useTeacherClasses = (teacherId: string) => {
  const { courseAssignments } = useData();
  return courseAssignments
    .filter(ca => ca.teacherId === teacherId)
    .map(ca => ({
      classId: ca.classId,
      className: ca.className,
      subject: ca.subject
    }));
};

// Helper function to get teachers for a class
export const useClassTeachers = (classId: string) => {
  const { courseAssignments, teachers } = useData();
  const teacherIds = new Set(
    courseAssignments
      .filter(ca => ca.classId === classId)
      .map(ca => ca.teacherId)
  );
  
  return teachers.filter(teacher => teacherIds.has(teacher.id));
};
