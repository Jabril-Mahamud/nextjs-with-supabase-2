import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Tasks() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch tasks
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <ScrollArea className="h-full">
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-4xl font-bold mb-6">Tasks</h1>

        {/* Quick Add */}
        <div className="mb-8">
          <Button variant="outline" size="sm">
            New Task
          </Button>
        </div>

        {/* Tasks Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Your Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {tasksError ? (
              <p className="text-sm text-destructive">Error loading tasks</p>
            ) : tasks && tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-2">
                  <Checkbox id={`task-${task.id}`} />
                  <label htmlFor={`task-${task.id}`} className="text-sm">
                    {task.title}
                  </label>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No tasks available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
