import Hero from "@/components/hero";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";

export default async function Index() {
  return (
    <>
      <Hero />
      <main className="flex-1 flex justify-center flex-col gap-6 px-4">
        <h2 className="font-medium text-xl mb-4 text-center">Manage your life easier with the touch of a button</h2>
      </main>
    </>
  );
}
