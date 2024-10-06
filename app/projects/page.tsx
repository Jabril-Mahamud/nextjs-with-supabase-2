import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const Projects: React.FC = async () => {
  const supabase = createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to sign-in if no user is authenticated
  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch projects for the logged-in user
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  return (
    <ScrollArea className="h-full">
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-4xl font-bold mb-6">Projects</h1>

        {/* Quick Add Button */}
        <div className="mb-8">
          <Button variant="outline" size="sm">
            New Project
          </Button>
        </div>

        {/* Projects Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Your Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Error Handling for Projects Fetching */}
            {projectsError ? (
              <p className="text-sm text-destructive">Error loading projects</p>
            ) : projects && projects.length > 0 ? (
              projects.map((project) => (
                <div key={project.id} className="text-sm mb-2">
                  {project.name}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No projects available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default Projects;
