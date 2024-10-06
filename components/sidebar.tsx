'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Home, Calendar, BookOpen, Target, Briefcase } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { name: 'Home', icon: Home },
  { name: 'Tasks', icon: Calendar },
  { name: 'Journal', icon: BookOpen },
  { name: 'Goals', icon: Target },
  { name: 'Projects', icon: Briefcase }
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`h-full border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="sticky top-0 bg-background">
        <div className="flex items-center justify-between p-4">
          <div className={`flex items-center space-x-2 ${isCollapsed ? 'hidden' : ''}`}>
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <span className="font-semibold">LifeOS</span>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded hover:bg-gray-100"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
        <nav className="p-2">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link href={`/${item.name.toLowerCase()}`} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
                  <item.icon className="w-4 h-4" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}