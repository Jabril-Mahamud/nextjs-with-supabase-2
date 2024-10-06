// app/notes/page.tsx

import React from 'react';
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from 'lucide-react';
import { redirect } from "next/navigation";

export default async function NotesPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: notes, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  return (
    <ScrollArea className="h-full">
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-4xl font-bold mb-6">Notes</h1>
        
        <Button variant="outline" className="mb-4">
          <Plus className="w-4 h-4 mr-2" />
          Add New Note
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>My Notes</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-destructive">Error loading notes</p>
            ) : notes && notes.length > 0 ? (
              <ul>
                {notes.map(note => (
                  <li key={note.id} className="flex justify-between mb-2">
                    <span>{note.title}</span>
                    {/* Add Edit/Delete buttons here */}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No notes available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
