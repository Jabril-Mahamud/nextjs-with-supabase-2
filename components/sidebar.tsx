import React from 'react'
import { ChevronDown } from 'lucide-react'

const navItems = ['Home', 'Tasks', 'Journal', 'Goals', 'Projects']

export function Sidebar() {
  return (
    <div className="w-64 border-r border-gray-200 p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
          <span className="font-semibold">LifeOS</span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </div>
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100 cursor-pointer">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}