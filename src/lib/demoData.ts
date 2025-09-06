// Demo data for HANU Planner

// List of common first names for teachers
const firstNames = [
  'John', 'Sarah', 'Michael', 'Emily', 'David', 'Jennifer', 'James', 'Lisa',
  'Robert', 'Michelle', 'William', 'Amanda', 'Richard', 'Jessica', 'Joseph',
  'Melissa', 'Thomas', 'Rebecca', 'Daniel', 'Laura', 'Matthew', 'Stephanie',
  'Christopher', 'Kimberly', 'Andrew', 'Nicole', 'Brian', 'Elizabeth', 'Kevin', 'Heather'
];

// List of common last names
const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia',
  'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez',
  'Moore', 'Martin', 'Jackson', 'Thompson', 'White', 'Lopez', 'Lee', 'Gonzalez',
  'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Perez', 'Hall'
];

// List of subjects (40 unique subjects)
const subjects = [
  'Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History',
  'Geography', 'Computer Science', 'Economics', 'Business Studies',
  'Accounting', 'Art', 'Music', 'Physical Education', 'Psychology',
  'Sociology', 'Political Science', 'Environmental Science', 'Statistics',
  'Calculus', 'Algebra', 'Geometry', 'Trigonometry', 'Literature', 'Composition',
  'Creative Writing', 'World History', 'US History', 'European History',
  'Physical Science', 'Earth Science', 'Astronomy', 'Meteorology', 'Geology',
  'Oceanography', 'Robotics', 'Web Development', 'Mobile App Development',
  'Data Structures', 'Algorithms', 'Artificial Intelligence'
];

// Generate random teacher data
export const generateTeachers = () => {
  const teachers = [];
  const usedSubjects = new Set();
  
  // Ensure we have enough subjects for all teachers
  const teacherSubjects = [...subjects];
  
  for (let i = 1; i <= 80; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    // Each teacher teaches 1-2 subjects
    const numSubjects = Math.random() > 0.7 ? 2 : 1;
    const teacherSubjects = [];
    
    for (let j = 0; j < numSubjects; j++) {
      let subject;
      do {
        subject = subjects[Math.floor(Math.random() * subjects.length)];
      } while (teacherSubjects.includes(subject));
      
      teacherSubjects.push(subject);
    }
    
    // Generate availability (9:00-17:00 with some breaks)
    const availability = [];
    for (let day = 1; day <= 5; day++) { // Weekdays only
      const startHour = 9 + Math.floor(Math.random() * 4); // Start between 9:00-12:00
      const endHour = 13 + Math.floor(Math.random() * 4); // End between 13:00-16:00
      
      availability.push({
        dayOfWeek: day,
        startTime: startHour,
        endTime: endHour
      });
    }
    
    teachers.push({
      id: `T${i.toString().padStart(3, '0')}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@hanu.edu`,
      department: teacherSubjects[0],
      subjects: teacherSubjects,
      availability: availability
    });
  }
  
  return teachers;
};

// Generate class data
export const generateClasses = () => {
  const classes = [];
  const grades = [9, 10, 11, 12];
  const sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  
  let classCount = 1;
  for (const grade of grades) {
    for (const section of sections) {
      if (classCount > 34) break;
      
      classes.push({
        id: `C${classCount.toString().padStart(3, '0')}`,
        name: `Class ${grade}${section}`,
        grade: grade,
        section: section,
        capacity: 30 + Math.floor(Math.random() * 10) // 30-40 students
      });
      
      classCount++;
    }
  }
  
  return classes;
};

// Generate timetable slots
export const generateTimetableSlots = () => {
  const slots = [];
  const daysOfWeek = [1, 2, 3, 4, 5]; // Monday to Friday
  const startHour = 9;
  const endHour = 17;
  const periodLength = 1; // 1 hour per period
  
  for (const day of daysOfWeek) {
    for (let hour = startHour; hour < endHour; hour += periodLength) {
      // Skip lunch break (12:00-13:00)
      if (hour === 12) continue;
      
      slots.push({
        dayOfWeek: day,
        startTime: hour,
        endTime: hour + periodLength,
        period: Math.floor((hour - startHour) / periodLength) + 1 - (hour > 12 ? 1 : 0)
      });
    }
  }
  
  return slots;
};

// Generate course assignments (which teacher teaches which subject to which class)
export const generateCourseAssignments = (teachers: any[], classes: any[]) => {
  const assignments = [];
  const subjectsPerClass = 6; // Number of subjects per class
  
  for (const classItem of classes) {
    const grade = classItem.grade;
    const availableSubjects = getGradeLevelSubjects(grade);
    
    // Assign subjects to this class
    const selectedSubjects = [];
    const selectedSubjectIndices = new Set<number>();
    
    // Ensure we don't select more subjects than available
    const numSubjects = Math.min(subjectsPerClass, availableSubjects.length);
    
    while (selectedSubjectIndices.size < numSubjects) {
      const randomIndex = Math.floor(Math.random() * availableSubjects.length);
      selectedSubjectIndices.add(randomIndex);
    }
    
    // Get the actual subject names
    for (const index of selectedSubjectIndices) {
      selectedSubjects.push(availableSubjects[index]);
    }
    
    // Find teachers for each subject
    for (const subject of selectedSubjects) {
      // Find teachers who teach this subject
      const availableTeachers = teachers.filter(teacher => 
        teacher.subjects.includes(subject)
      );
      
      if (availableTeachers.length > 0) {
        const teacher = availableTeachers[Math.floor(Math.random() * availableTeachers.length)];
        
        assignments.push({
          id: `A${assignments.length + 1}`.padStart(4, '0'),
          teacherId: teacher.id,
          teacherName: teacher.name,
          subject: subject,
          classId: classItem.id,
          className: classItem.name,
          hoursPerWeek: 5 // Each subject meets 5 times per week
        });
      }
    }
  }
  
  return assignments;
};

// Helper function to get subjects for each grade level
const getGradeLevelSubjects = (grade: number) => {
  const coreSubjects = [
    'Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History',
    'Geography', 'Computer Science', 'Economics', 'Business Studies'
  ];
  
  const electiveSubjects = [
    'Art', 'Music', 'Physical Education', 'Psychology', 'Sociology',
    'Political Science', 'Environmental Science', 'Statistics', 'Calculus',
    'Algebra', 'Geometry', 'Trigonometry', 'Literature', 'Composition',
    'Creative Writing', 'World History', 'US History', 'European History',
    'Physical Science', 'Earth Science', 'Astronomy', 'Meteorology',
    'Geology', 'Oceanography', 'Robotics', 'Web Development',
    'Mobile App Development', 'Data Structures', 'Algorithms',
    'Artificial Intelligence'
  ];
  
  // Higher grades get more specialized subjects
  const specializationFactor = (grade - 9) / 3; // 0 for 9th grade, 1 for 12th grade
  const numElectives = 2 + Math.floor(specializationFactor * 3); // 2-5 electives
  
  const selectedSubjects = [...coreSubjects];
  
  // Add electives
  const shuffledElectives = [...electiveSubjects].sort(() => 0.5 - Math.random());
  selectedSubjects.push(...shuffledElectives.slice(0, numElectives));
  
  return selectedSubjects;
};

// Generate all demo data
export const generateDemoData = () => {
  const teachers = generateTeachers();
  const classes = generateClasses();
  const timetableSlots = generateTimetableSlots();
  const courseAssignments = generateCourseAssignments(teachers, classes);
  
  return {
    teachers,
    classes,
    timetableSlots,
    courseAssignments
  };
};

export default generateDemoData;
