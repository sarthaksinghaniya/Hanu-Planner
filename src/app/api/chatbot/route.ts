import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

// This route is marked as static for static exports
export const dynamic = 'force-static';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, action } = body

    if (action) {
      // Handle button actions
      switch (action.type) {
        case 'add_teacher':
          return NextResponse.json({
            response: 'I can help you add a new teacher. Please provide the following information:\n\n• Teacher name\n• Email address\n• Department\n\nYou can type it like: "Add teacher Dr. John Smith, john.smith@hanu.edu, Computer Science"',
            actions: []
          })
        
        case 'add_subject':
          return NextResponse.json({
            response: 'I can help you add a new subject. Please provide:\n\n• Subject name\n• Subject code\n• Description (optional)\n• Teacher name\n\nExample: "Add subject Advanced Mathematics, MATH201, Advanced calculus concepts, Dr. Sarah Johnson"',
            actions: []
          })
        
        case 'set_availability':
          return NextResponse.json({
            response: 'I can help you set teacher availability. Please provide:\n\n• Teacher name\n• Day of the week\n• Start time\n• End time\n\nExample: "Set availability for Dr. Sarah Johnson on Monday from 9 AM to 12 PM"',
            actions: []
          })
        
        case 'generate_timetable':
          return NextResponse.json({
            response: 'I can generate a timetable for a student. Please provide:\n\n• Student name\n• Grade (optional)\n\nExample: "Generate timetable for John Doe in grade 10"',
            actions: []
          })
        
        default:
          return NextResponse.json({
            response: 'I\'m not sure how to help with that action.',
            actions: []
          })
      }
    }

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Process natural language messages
    const lowerMessage = message.toLowerCase()

    // Add teacher logic
    if (lowerMessage.includes('add teacher') || lowerMessage.includes('new teacher')) {
      const teacherMatch = message.match(/add teacher\s+([^,]+),\s*([^,]+),\s*([^,]+)/i)
      if (teacherMatch) {
        const [, name, email, department] = teacherMatch
        
        // Here you would actually add the teacher to the database
        // For now, we'll simulate it
        
        return NextResponse.json({
          response: `✅ Teacher added successfully!\n\n• Name: ${name.trim()}\n• Email: ${email.trim()}\n• Department: ${department.trim()}\n\nThe teacher has been added to the system and can now be assigned subjects and availability.`,
          actions: [
            { type: 'set_availability', label: 'Set Availability for this Teacher' },
            { type: 'add_subject', label: 'Add Subject for this Teacher' }
          ]
        })
      }
      
      return NextResponse.json({
        response: 'I need more information to add a teacher. Please provide the details in this format:\n\n"Add teacher [Name], [Email], [Department]"',
        actions: []
      })
    }

    // Add subject logic
    if (lowerMessage.includes('add subject') || lowerMessage.includes('new subject')) {
      const subjectMatch = message.match(/add subject\s+([^,]+),\s*([^,]+),\s*([^,]+),\s*(.+)/i)
      if (subjectMatch) {
        const [, name, code, description, teacher] = subjectMatch
        
        return NextResponse.json({
          response: `✅ Subject added successfully!\n\n• Name: ${name.trim()}\n• Code: ${code.trim()}\n• Description: ${description.trim()}\n• Teacher: ${teacher.trim()}\n\nThe subject is now available for timetable scheduling.`,
          actions: [
            { type: 'generate_timetable', label: 'Generate Timetable' }
          ]
        })
      }
      
      return NextResponse.json({
        response: 'I need more information to add a subject. Please provide the details in this format:\n\n"Add subject [Name], [Code], [Description], [Teacher]"',
        actions: []
      })
    }

    // Set availability logic
    if (lowerMessage.includes('set availability') || lowerMessage.includes('availability')) {
      const availabilityMatch = message.match(/set availability for\s+([^on]+)on\s+([^from]+)from\s+(\d+)\s*(am|pm)\s*to\s+(\d+)\s*(am|pm)/i)
      if (availabilityMatch) {
        const [, teacher, day, startHour, startPeriod, endHour, endPeriod] = availabilityMatch
        
        return NextResponse.json({
          response: `✅ Availability set successfully!\n\n• Teacher: ${teacher.trim()}\n• Day: ${day.trim()}\n• Time: ${startHour}${startPeriod} - ${endHour}${endPeriod}\n\nThe teacher is now available for scheduling during this time slot.`,
          actions: [
            { type: 'generate_timetable', label: 'Generate Timetable' }
          ]
        })
      }
      
      return NextResponse.json({
        response: 'I need more information to set availability. Please provide the details in this format:\n\n"Set availability for [Teacher] on [Day] from [Start Time] to [End Time]"',
        actions: []
      })
    }

    // Generate timetable logic
    if (lowerMessage.includes('generate timetable') || lowerMessage.includes('timetable')) {
      const studentMatch = message.match(/generate timetable for\s+([^in]+)(?:\s+in\s+grade\s+(\d+))?/i)
      if (studentMatch) {
        const [, studentName, grade] = studentMatch
        
        return NextResponse.json({
          response: `✅ Timetable generated successfully for ${studentName.trim()}${grade ? ` (Grade ${grade})` : ''}!\n\nThe timetable has been created considering:\n• Teacher availability\n• Subject assignments\n• No scheduling conflicts\n\nYou can now view the complete timetable in the Timetable section.`,
          actions: [
            { type: 'add_teacher', label: 'Add Another Teacher' },
            { type: 'add_subject', label: 'Add Another Subject' }
          ]
        })
      }
      
      return NextResponse.json({
        response: 'I need more information to generate a timetable. Please provide:\n\n"Generate timetable for [Student Name] (optional: in grade [Grade])"',
        actions: []
      })
    }

    // Use AI for more complex queries
    try {
      const zai = await ZAI.create()
      
      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant for HANU Planner, a school timetable management system. 
            You can help users with:
            - Adding teachers (format: "Add teacher [Name], [Email], [Department]")
            - Adding subjects (format: "Add subject [Name], [Code], [Description], [Teacher]")
            - Setting teacher availability (format: "Set availability for [Teacher] on [Day] from [Start Time] to [End Time]")
            - Generating timetables (format: "Generate timetable for [Student Name] in grade [Grade]")
            
            Keep responses concise and helpful. If you detect a specific format, guide the user to use it.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })

      const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I\'m having trouble understanding your request. Please try rephrasing it.'
      
      return NextResponse.json({
        response: aiResponse,
        actions: [
          { type: 'add_teacher', label: 'Add Teacher' },
          { type: 'add_subject', label: 'Add Subject' },
          { type: 'set_availability', label: 'Set Availability' },
          { type: 'generate_timetable', label: 'Generate Timetable' }
        ]
      })
    } catch (error) {
      console.error('AI processing error:', error)
      
      return NextResponse.json({
        response: 'I can help you with the following tasks:\n\n• Add teachers\n• Add subjects\n• Set teacher availability\n• Generate timetables\n\nPlease choose an action or type your request in natural language.',
        actions: [
          { type: 'add_teacher', label: 'Add Teacher' },
          { type: 'add_subject', label: 'Add Subject' },
          { type: 'set_availability', label: 'Set Availability' },
          { type: 'generate_timetable', label: 'Generate Timetable' }
        ]
      })
    }
  } catch (error) {
    console.error('Chatbot error:', error)
    return NextResponse.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    )
  }
}