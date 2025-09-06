import { NextResponse } from 'next/server';

// This route is marked as static for static exports
export const dynamic = 'force-static';

// Sample data for demo purposes
const sampleAvailabilities = [
  {
    id: '1',
    teacherId: '1',
    teacher: { 
      id: '1', 
      name: 'John Smith', 
      email: 'john@example.com', 
      department: 'Mathematics' 
    },
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '11:00'
  },
  {
    id: '2',
    teacherId: '1',
    teacher: { 
      id: '1', 
      name: 'John Smith', 
      email: 'john@example.com', 
      department: 'Mathematics' 
    },
    dayOfWeek: 3,
    startTime: '13:00',
    endTime: '15:00'
  }
];

export async function GET() {
  try {
    // Return the sample data
    return NextResponse.json(sampleAvailabilities);
  } catch (error) {
    console.error('Error in availability API:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// For static exports, we need to provide a default export
export default function handler() {
  return NextResponse.json({ 
    message: 'This is a static endpoint for demo purposes.',
    note: 'In a production app, implement proper API endpoints with a backend.'
  });
}

// Note: POST, PUT, DELETE operations are not supported in static exports
// These would need to be implemented with a proper backend service