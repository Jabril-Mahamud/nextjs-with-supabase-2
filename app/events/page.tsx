// app/goals/page.tsx

import React from 'react';
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from 'lucide-react';
import { redirect } from "next/navigation";

export default async function GoalsPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: goals, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id)
    .order('progress', { ascending: false });

  return (
    <ScrollArea className="h-full">
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-4xl font-bold mb-6">Goals</h1>
        
        <Button variant="outline" className="mb-4">
          <Plus className="w-4 h-4 mr-2" />
          Add New Goal
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>My Goals</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-destructive">Error loading goals</p>
            ) : goals && goals.length > 0 ? (
              <ul>
                {goals.map(goal => (
                  <li key={goal.id} className="flex justify-between mb-2">
                    <span>{goal.title}</span>
                    <span>{goal.progress}%</span>
                    {/* Add Edit/Delete buttons here */}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No goals available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
