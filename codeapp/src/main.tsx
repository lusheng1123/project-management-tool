import React from 'react'
import { createRoot } from 'react-dom/client'
import App, { AppWithProviders } from './App'
import './index.css'
import { seedAllIfNeeded } from './seed'

seedAllIfNeeded()

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWithProviders />
  </React.StrictMode>
)
