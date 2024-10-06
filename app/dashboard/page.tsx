import React from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Target, MoreHorizontal, InfoIcon, FolderKanban, FileText, Calendar } from 'lucide-react'
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function Dashboard() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/sign-in")
  }

  // Fetch tasks with project data
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('*, projects(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Fetch projects
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  // Fetch notes
  const { data: notes, error: notesError } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(3)

  // Fetch goals
  const { data: goals, error: goalsError } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id)
    .order('progress', { ascending: false })
    .limit(3)

  // Fetch upcoming events
  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', user.id)
    .gte('start_time', new Date().toISOString()) // Get only upcoming events
    .order('start_time', { ascending: true })

  return (
    <ScrollArea className="h-full">
      <div className="max-w-2xl mx-auto py-4">
        <h1 className="text-3xl font-semibold mb-4">Dashboard</h1>
        
        {/* User Info */}
        <div className="w-full mb-6">
          <div className="bg-gray-100 text-xs p-2 px-4 rounded-md text-gray-800 flex gap-2 items-center">
            <InfoIcon size="14" strokeWidth={1.5} />
            Welcome back, {user.email}!
          </div>
        </div>

        {/* Quick Add */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Quick Add</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        {/* Projects and Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Projects Card */}
          <Card className="border border-gray-200 hover:border-gray-300 shadow-sm transition">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Active Projects</CardTitle>
              <FolderKanban className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {projectsError ? (
                <p className="text-sm text-destructive">Error loading projects</p>
              ) : projects && projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="p-3 bg-accent rounded-lg">
                      <h3 className="text-lg font-semibold">{project.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">Created on: {new Date(project.created_at).toLocaleDateString()}</p>
                      <div className="space-y-2">
                        {tasksError ? (
                          <p className="text-sm text-destructive">Error loading tasks</p>
                        ) : tasks && tasks.length > 0 ? (
                          tasks.filter(task => task.project_id === project.id).map((task) => (
                            <div key={task.id} className="flex items-center space-x-2">
                              <Checkbox id={`task-${task.id}`} />
                              <label htmlFor={`task-${task.id}`} className="text-sm">
                                {task.title} <span className="text-xs text-muted-foreground">(Due: {new Date(task.due_date).toLocaleDateString()})</span>
                              </label>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No tasks for this project</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No active projects</p>
              )}
            </CardContent>
          </Card>
          
          {/* Recent Notes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Recent Notes</CardTitle>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {notesError ? (
                <p className="text-sm text-destructive">Error loading notes</p>
              ) : notes && notes.length > 0 ? (
                <div className="space-y-2">
                  {notes.map((note) => (
                    <div key={note.id} className="flex items-center justify-between p-2 bg-accent rounded-lg">
                      <span className="text-sm">{note.title}</span>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No notes available</p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {eventsError ? (
                <p className="text-sm text-destructive">Error loading events</p>
              ) : events && events.length > 0 ? (
                <div className="space-y-2">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-2 bg-accent rounded-lg">
                      <span className="text-sm">{event.title} <span className="text-xs text-muted-foreground">(Starts: {new Date(event.start_time).toLocaleDateString()})</span></span>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No upcoming events</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  )
}
