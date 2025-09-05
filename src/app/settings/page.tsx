'use client'

import { useState } from 'react'
import Layout from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Settings, Save, RefreshCw, Download, Upload } from 'lucide-react'

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    schoolName: 'HANU School',
    academicYear: '2024-2025',
    timezone: 'UTC+7',
    workingDays: [1, 2, 3, 4, 5], // Monday to Friday
    classDuration: 60, // minutes
    breakDuration: 15, // minutes
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    timetableChanges: true,
    newAssignments: true,
    systemUpdates: false,
  })

  const handleGeneralSettingsChange = (key: string, value: any) => {
    setGeneralSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleNotificationSettingsChange = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = () => {
    // Simulate saving settings
    console.log('Saving settings:', { generalSettings, notificationSettings })
    alert('Settings saved successfully!')
  }

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      // Reset to default values
      setGeneralSettings({
        schoolName: 'HANU School',
        academicYear: '2024-2025',
        timezone: 'UTC+7',
        workingDays: [1, 2, 3, 4, 5],
        classDuration: 60,
        breakDuration: 15,
      })
      setNotificationSettings({
        emailNotifications: true,
        pushNotifications: true,
        timetableChanges: true,
        newAssignments: true,
        systemUpdates: false,
      })
    }
  }

  const handleExportData = () => {
    // Simulate data export
    const data = {
      generalSettings,
      notificationSettings,
      exportDate: new Date().toISOString(),
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'hanu-planner-settings.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Configure your HANU Planner preferences
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={handleResetSettings}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSaveSettings}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>School Information</CardTitle>
                <CardDescription>
                  Basic information about your school
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">School Name</Label>
                    <Input
                      id="schoolName"
                      value={generalSettings.schoolName}
                      onChange={(e) => handleGeneralSettingsChange('schoolName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="academicYear">Academic Year</Label>
                    <Input
                      id="academicYear"
                      value={generalSettings.academicYear}
                      onChange={(e) => handleGeneralSettingsChange('academicYear', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={generalSettings.timezone} onValueChange={(value) => handleGeneralSettingsChange('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC+7">UTC+7 (Vietnam)</SelectItem>
                      <SelectItem value="UTC+0">UTC+0 (GMT)</SelectItem>
                      <SelectItem value="UTC+1">UTC+1 (CET)</SelectItem>
                      <SelectItem value="UTC+8">UTC+8 (China)</SelectItem>
                      <SelectItem value="UTC-5">UTC-5 (EST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schedule Settings</CardTitle>
                <CardDescription>
                  Configure class and break timings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="classDuration">Class Duration (minutes)</Label>
                    <Input
                      id="classDuration"
                      type="number"
                      value={generalSettings.classDuration}
                      onChange={(e) => handleGeneralSettingsChange('classDuration', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
                    <Input
                      id="breakDuration"
                      type="number"
                      value={generalSettings.breakDuration}
                      onChange={(e) => handleGeneralSettingsChange('breakDuration', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationSettingsChange('emailNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications in browser
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => handleNotificationSettingsChange('pushNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Timetable Changes</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when timetable changes
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.timetableChanges}
                    onCheckedChange={(checked) => handleNotificationSettingsChange('timetableChanges', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Assignments</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new teacher assignments
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.newAssignments}
                    onCheckedChange={(checked) => handleNotificationSettingsChange('newAssignments', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>System Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about system updates
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.systemUpdates}
                    onCheckedChange={(checked) => handleNotificationSettingsChange('systemUpdates', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Import, export, and manage your data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Download className="h-6 w-6 mb-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Upload className="h-6 w-6 mb-2" />
                    Import Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
                <CardDescription>
                  Technical details about the system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Version:</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Environment:</span>
                  <span className="font-medium">Development</span>
                </div>
                <div className="flex justify-between">
                  <span>Database:</span>
                  <span className="font-medium">SQLite</span>
                </div>
                <div className="flex justify-between">
                  <span>Framework:</span>
                  <span className="font-medium">Next.js 15</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}