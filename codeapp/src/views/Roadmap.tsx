import React from 'react'
import CalendarView from '../components/Calendar'

export default function Roadmap(){
  return (
    <div>
      <h2>Roadmap</h2>
      <p>Interactive calendar (Month/Week/Day). Drag events to reschedule.</p>
      <CalendarView />
    </div>
  )
}
