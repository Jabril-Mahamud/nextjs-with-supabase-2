import React from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Target, MoreHorizontal, InfoIcon, FolderKanban } from 'lucide-react'
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

  const { data: notes, error: notesError } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(3)

  const { data: goals, error: goalsError } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id)
    .order('progress', { ascending: false })
    .limit(3)

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Projects Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {projectsError ? (
                <p className="text-sm text-destructive">Error loading projects</p>
              ) : projects && projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id}>
                      <h3 className="text-lg font-semibold">{project.name}</h3>
                      <div className="space-y-2">
                        {tasksError ? (
                          <p className="text-sm text-destructive">Error loading tasks</p>
                        ) : tasks && tasks.length > 0 ? (
                          tasks.filter(task => task.project_id === project.id).map((task) => (
                            <div key={task.id} className="flex items-center space-x-2">
                              <Checkbox id={`task-${task.id}`} />
                              <label htmlFor={`task-${task.id}`} className="text-sm">
                                {task.title}
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

          {/* Goals Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Goals Progress</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {goalsError ? (
                <p className="text-sm text-destructive">Error loading goals</p>
              ) : goals && goals.length > 0 ? (
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div key={goal.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{goal.title}</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No goals set</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Notes */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Recent Notes</h2>
          {notesError ? (
            <p className="text-sm text-destructive">Error loading notes</p>
          ) : notes && notes.length > 0 ? (
            <div className="space-y-2">
              {notes.map((note) => (
                <div key={note.id} className="flex items-center justify-between p-2 border border-border rounded">
                  <span className="text-sm">{note.title}</span>
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No notes available</p>
          )}
        </div>
      </div>
    </ScrollArea>
  )
}
