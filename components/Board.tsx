"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKS = 52
const INITIAL_DATA = Array(DAYS.length).fill(Array(WEEKS).fill(0))

export default function Board() {
  const [data, setData] = useState(INITIAL_DATA)

  const getColor = (value: number) => {
    if (value === 0) return 'bg-gray-800'
    if (value === 1) return 'bg-emerald-900'
    if (value === 2) return 'bg-emerald-700'
    if (value === 3) return 'bg-emerald-500'
    return 'bg-emerald-300'
  }

  const handleCellClick = (dayIndex: number, weekIndex: number) => {
    const newData = data.map((row, i) =>
      i === dayIndex ? row.map((cell:any, j:any) => j === weekIndex ? (cell + 1) % 5 : cell) : row
    )
    setData(newData)
  }

  const handleCheckIn = () => {
    const today = new Date()
    const dayIndex = today.getDay()
    const weekIndex = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))
    handleCellClick(dayIndex, weekIndex)
  }

  return (
    <div className="bg-gray-900 text-gray-300 p-6 rounded-xl max-w-5xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Yearly Contribution Board</h2>
        <div className="bg-gray-700 p-2 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
        </div>
      </div>

      {/* Month Labels */}
      <div className="flex mb-2">
        <div className="w-8"></div> {/* Space for day labels */}
        {MONTHS.map((month, index) => (
          <div key={month} className="text-xs text-center" style={{ width: `${100 / WEEKS}%` }}>
            {index % 2 === 0 ? month : ''} {/* Show every second month */}
          </div>
        ))}
      </div>

      {/* Grid of days and contributions */}
      <div className="grid grid-rows-7 grid-cols-52 gap-1">
        {DAYS.map((day, dayIndex) => (
          <div key={day} className="flex items-center">
            <div className="w-8 text-xs">{day}</div>
            {Array.from({ length: WEEKS }).map((_, weekIndex) => (
              <button
                key={`${dayIndex}-${weekIndex}`}
                className={`w-4 h-4 rounded-sm ${getColor(data[dayIndex][weekIndex])} transition-colors duration-200 hover:opacity-80`}
                onClick={() => handleCellClick(dayIndex, weekIndex)}
                aria-label={`Toggle contribution for ${day}, week ${weekIndex + 1}`}
              ></button>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs">Less</span>
          {[0, 1, 2, 3, 4].map((value) => (
            <div key={value} className={`w-4 h-4 rounded-sm ${getColor(value)}`}></div>
          ))}
          <span className="text-xs">More</span>
        </div>
        <Button className="bg-emerald-700 hover:bg-emerald-600 text-white" onClick={handleCheckIn}>
          CHECK IN
        </Button>
      </div>
    </div>
  )
}
