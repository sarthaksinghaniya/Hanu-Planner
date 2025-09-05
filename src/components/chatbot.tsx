'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Clock,
  Plus,
  Calendar,
  BookOpen,
  Users,
  ChevronLeft,
  ArrowLeft,
  Minimize2,
  Maximize2,
  Trash2
} from 'lucide-react'

interface ChatMessage {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  actions?: ChatAction[]
}

interface ChatAction {
  type: 'add_teacher' | 'add_subject' | 'set_availability' | 'generate_timetable'
  label: string
  data?: any
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your HANU Planner assistant. I can help you add teachers, subjects, set availability, and generate timetables. What would you like to do?',
      timestamp: new Date(),
      actions: [
        { type: 'add_teacher', label: 'Add Teacher' },
        { type: 'add_subject', label: 'Add Subject' },
        { type: 'set_availability', label: 'Set Availability' },
        { type: 'generate_timetable', label: 'Generate Timetable' }
      ]
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (messagesEndRef.current && scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth'
        })
      }
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom()
    }, 150)
    return () => clearTimeout(timer)
  }, [messages, isTyping])

  const clearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Chat cleared! How can I help you today?',
        timestamp: new Date(),
        actions: [
          { type: 'add_teacher', label: 'Add Teacher' },
          { type: 'add_subject', label: 'Add Subject' },
          { type: 'set_availability', label: 'Set Availability' },
          { type: 'generate_timetable', label: 'Generate Timetable' }
        ]
      }
    ])
  }

  const handleAction = async (action: ChatAction) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: action.label,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      const data = await response.json()
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.response || 'I apologize, but I encountered an error.',
        timestamp: new Date(),
        actions: data.actions || []
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Chatbot API error:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'I apologize, but I\'m having trouble connecting to my services. Please try again later.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue }),
      })

      const data = await response.json()
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.response || 'I apologize, but I encountered an error.',
        timestamp: new Date(),
        actions: data.actions || []
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Chatbot API error:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'I apologize, but I\'m having trouble connecting to my services. Please try again later.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (!isOpen) {
    return (
      <>
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-50 rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
          size="lg"
        >
          <MessageSquare className="h-6 w-6 transition-transform group-hover:scale-110" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-600">
            {messages.filter(m => m.type === 'bot' && m.actions?.length).length}
          </Badge>
        </Button>
      </>
    )
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 shadow-xl">
        <Card className="w-80">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Back Button for Minimized State */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0 hover:bg-destructive/10 transition-colors duration-200"
                  title="Go back"
                >
                  <ArrowLeft className="h-3 w-3" />
                </Button>
                
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Bot className="h-4 w-4" />
                  HANU Assistant
                  <Badge variant="secondary" className="text-xs">
                    Online
                  </Badge>
                </CardTitle>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(false)}
                  className="h-6 w-6 p-0"
                >
                  <Maximize2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0"
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 h-[600px] shadow-xl">
      <Card className="h-full flex flex-col border-0 shadow-2xl overflow-hidden">
        {/* Header */}
        <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Back Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 hover:bg-destructive/10 transition-colors duration-200"
                title="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Bot className="h-5 w-5 text-primary" />
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <CardTitle className="text-lg">HANU Assistant</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      Online
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {messages.length} messages
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="h-8 w-8 p-0 hover:bg-destructive/10"
                title="Clear chat"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="h-8 w-8 p-0"
                title="Minimize"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 hover:bg-destructive/10"
                title="Close"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <Separator />
        
        {/* Messages Area */}
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <div className="flex-1 relative overflow-hidden">
            <ScrollArea className="absolute inset-0 h-full" ref={scrollAreaRef}>
              <div className="p-4 space-y-4">
                {/* Date separator */}
                {messages.length > 0 && (
                  <div className="flex items-center gap-2 my-4">
                    <Separator className="flex-1" />
                    <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded">
                      {formatDate(messages[0].timestamp)}
                    </span>
                    <Separator className="flex-1" />
                  </div>
                )}
                
                {messages.map((message, index) => {
                  const showDate = index > 0 && 
                    formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp)
                  
                  return (
                    <div key={message.id}>
                      {showDate && (
                        <div className="flex items-center gap-2 my-4">
                          <Separator className="flex-1" />
                          <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded">
                            {formatDate(message.timestamp)}
                          </span>
                          <Separator className="flex-1" />
                        </div>
                      )}
                      
                      <div
                        className={`flex gap-3 ${
                          message.type === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.type === 'bot' && (
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-sm">
                              <Bot className="h-4 w-4 text-primary-foreground" />
                            </div>
                          </div>
                        )}
                        
                        <div className="max-w-[70%] space-y-2">
                          <div
                            className={`rounded-2xl px-4 py-3 shadow-sm ${
                              message.type === 'user'
                                ? 'bg-primary text-primary-foreground rounded-br-sm'
                                : 'bg-muted/50 rounded-bl-sm'
                            }`}
                          >
                            <div className="text-sm whitespace-pre-wrap break-words leading-relaxed hyphens-auto" style={{wordBreak: 'break-word', overflowWrap: 'break-word'}}>
                              {message.content}
                            </div>
                            
                            {message.actions && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {message.actions.map((action, index) => (
                                  <Button
                                    key={index}
                                    variant={message.type === 'user' ? 'secondary' : 'default'}
                                    size="sm"
                                    onClick={() => handleAction(action)}
                                    className="text-xs h-8 px-3 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                                  >
                                    {action.label}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 px-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                        </div>
                        
                        {message.type === 'user' && (
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center shadow-sm">
                              <User className="h-4 w-4 text-secondary-foreground" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
                
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-sm">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} className="h-4" />
              </div>
            </ScrollArea>
          </div>
          
          <Separator />
          
          {/* Input Area */}
          <div className="p-4 bg-background/50 backdrop-blur-sm border-t flex-shrink-0">
            <div className="flex gap-2 mb-3">
              {/* Prominent Back Button at Bottom */}
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 h-9 px-4 border-2 hover:bg-destructive/10 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                disabled={isTyping}
                className="flex-1 shadow-sm focus:shadow-md transition-shadow duration-200 resize-none"
                maxLength={500}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                size="sm"
                className="h-10 w-10 p-0 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction({ type: 'add_teacher', label: 'Add Teacher' })}
                className="text-xs h-7 px-3 rounded-full whitespace-nowrap flex-shrink-0"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Teacher
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction({ type: 'add_subject', label: 'Add Subject' })}
                className="text-xs h-7 px-3 rounded-full whitespace-nowrap flex-shrink-0"
              >
                <BookOpen className="h-3 w-3 mr-1" />
                Add Subject
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction({ type: 'set_availability', label: 'Set Availability' })}
                className="text-xs h-7 px-3 rounded-full whitespace-nowrap flex-shrink-0"
              >
                <Calendar className="h-3 w-3 mr-1" />
                Set Availability
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction({ type: 'generate_timetable', label: 'Generate Timetable' })}
                className="text-xs h-7 px-3 rounded-full whitespace-nowrap flex-shrink-0"
              >
                <Calendar className="h-3 w-3 mr-1" />
                Generate Timetable
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}