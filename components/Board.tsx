"use client";

import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"

// Utility to get the number of days in a month
const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate()

// Utility to get the first day of the month (0 = Sun, 6 = Sat)
const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay()

interface HabitBoardProps {
  habitName: string
  month: number // Month as a 0-based index (0 for Jan, 11 for Dec)
  year: number
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Board({ habitName, month, year }: HabitBoardProps) {
  const [data, setData] = useState<number[][]>([])

  const getColor = (value: number) => {
    if (value === 0) return 'bg-gray-800'
    if (value === 1) return 'bg-emerald-700'
    if (value === 2) return 'bg-emerald-600'
    return 'bg-emerald-500'
  }

  const generateData = (daysInMonth: number, firstDayOfMonth: number) => {
    const totalSlots = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7
    const dataArray: number[][] = []
    let dayCounter = 1

    for (let i = 0; i < totalSlots; i++) {
      const weekIndex = Math.floor(i / 7)
      const dayOfWeek = i % 7

      if (!dataArray[weekIndex]) {
        dataArray[weekIndex] = []
      }

      // If it's before the first day of the month, or after the last day, fill with placeholder (-1)
      if (i < firstDayOfMonth || dayCounter > daysInMonth) {
        dataArray[weekIndex][dayOfWeek] = -1
      } else {
        dataArray[weekIndex][dayOfWeek] = 0 // Default value for not checked-in
        dayCounter++
      }
    }

    return dataArray
  }

  useEffect(() => {
    const daysInMonth = getDaysInMonth(month, year)
    const firstDayOfMonth = getFirstDayOfMonth(month, year)
    setData(generateData(daysInMonth, firstDayOfMonth))
  }, [month, year])

  const handleCheckIn = () => {
    const today = new Date()
    
    // Ensure it's the correct month and year
    if (today.getMonth() !== month || today.getFullYear() !== year) {
      alert('You cannot check in for this month.')
      return
    }

    const dayOfMonth = today.getDate()
    const firstDayOfMonth = getFirstDayOfMonth(month, year)

    // Calculate the row and column index for the current date
    const dayIndex = dayOfMonth + firstDayOfMonth - 1
    const weekIndex = Math.floor(dayIndex / 7)
    const dayOfWeek = dayIndex % 7

    // Update the corresponding day in the grid
    setData((prevData) => {
      const newData = [...prevData]
      newData[weekIndex][dayOfWeek] = 1 // Set it as 'checked in'
      return newData
    })
  }

  const monthName = new Date(year, month).toLocaleString('default', { month: 'long' })

  return (
    <div className="bg-gray-900 text-gray-300 p-6 rounded-xl max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{habitName}</h2>
        <div className="bg-gray-700 p-2 rounded-full">
          <span>{`${monthName} ${year}`}</span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {DAYS.map((day, i) => (
          <div key={i} className="w-8 h-8 flex items-center justify-center font-bold">{day}</div>
        ))}
        {data.map((week, i) => (
          <React.Fragment key={i}>
            {week.map((value, j) => (
              <div
                key={`${i}-${j}`}
                className={`w-8 h-8 rounded-sm flex items-center justify-center ${value === -1 ? 'bg-transparent' : getColor(value)}`}
              >
                {value !== -1 && i * 7 + j - getFirstDayOfMonth(month, year) + 1}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      <Button onClick={handleCheckIn} className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white">
        CHECK IN
      </Button>
    </div>
  )
}
