import { GeistSans } from "geist/font/sans"
import { ThemeProvider } from "next-themes"
import Link from "next/link"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import DeployButton from "@/components/deploy-button"
import { EnvVarWarning } from "@/components/env-var-warning"
import HeaderAuth from "@/components/header-auth"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { hasEnvVars } from "@/utils/supabase/check-env-vars"

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000"

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen flex-col">
            <header className="flex h-16 items-center justify-between border-b border-b-foreground/10 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-4">
                <Link href="/" className="text-lg font-semibold">
                  Life OS
                </Link>
              </div>
              {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
            </header>
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                {children}
              </main>
            </div>
            <footer className="flex items-center justify-between border-t px-4 py-4 text-xs sm:px-6 lg:px-8">
              <p>
                Powered by{" "}
                <a
                  href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                  target="_blank"
                  className="font-bold hover:underline"
                  rel="noreferrer"
                >
                  Supabase
                </a>
              </p>
              <ThemeSwitcher />
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}