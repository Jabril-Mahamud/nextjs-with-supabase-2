"use client"
import React, { useState } from "react"
import { ChevronLeft, ChevronRight, Home, Calendar, BookOpen, Target, Briefcase } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  { name: "Dashboard", icon: Home },
  { name: "Projects", icon: Briefcase },
  { name: "Tasks", icon: Calendar },
  { name: "Notes", icon: BookOpen },
  { name: "Goals", icon: Target },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  return (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && <span className="font-semibold">LifeOS</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <nav className="flex-1 space-y-2 p-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={`/${item.name.toLowerCase()}`}
            className={cn(
              "flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors duration-300",
              isCollapsed && "justify-center"
            )}
          >
            <item.icon className="h-5 w-5" />
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>
    </div>
  )
}
