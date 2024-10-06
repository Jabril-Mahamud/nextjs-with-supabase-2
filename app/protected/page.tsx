import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const userDetails = [
    { label: "Email", value: user.email },
    { label: "Confirmed At", value: user.email_confirmed_at },
    { label: "Last Sign In", value: user.last_sign_in_at },
    { label: "Role", value: user.role },
  ];

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto gap-8 p-6">
      {/* Header */}
      <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
        <InfoIcon size="16" strokeWidth={2} />
        This is a protected page visible only to authenticated users.
      </div>

      {/* User Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          {userDetails.map((detail) => (
            <div key={detail.label} className="flex justify-between">
              <span className="font-medium">{detail.label}:</span>
              <span>{detail.value || "N/A"}</span>
            </div>
          ))}
        </CardContent>
      </Card>
      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="outline">Edit Profile</Button>
        <Button variant="destructive">Log Out</Button>
      </div>
    </div>
  );
}
