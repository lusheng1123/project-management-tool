import React from 'react'
import Resources from './views/Resources'
import Products from './views/Products'
import Projects from './views/Projects'
import Capabilities from './views/Capabilities'
import Requirements from './views/Requirements'
import Epics from './views/Epics'
import UserStories from './views/UserStories'
import Risks from './views/Risks'
import Dependencies from './views/Dependencies'
import Roadmap from './views/Roadmap'
import { SearchProvider, useSearch } from './contexts/SearchContext'
import { seedAllIfNeeded } from './seed'

const TABS = [
  { id: 'resources', label: 'Resources' },
  { id: 'products', label: 'Products' },
  { id: 'projects', label: 'Projects' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'epics', label: 'Epics' },
  { id: 'stories', label: 'User Stories' },
  { id: 'risks', label: 'Risks' },
  { id: 'dependencies', label: 'Dependencies' },
  { id: 'roadmap', label: 'Roadmap' }
]

export default function App() {
  const [tab, setTab] = React.useState('resources')

  function handleReset(){
    if(!confirm('Reset all data? This will clear localStorage and re-seed all tables.')) return
    localStorage.clear()
    seedAllIfNeeded()
    window.location.reload()
  }

  function renderTab() {
    switch(tab) {
      case 'resources': return <Resources />
      case 'products': return <Products />
      case 'projects': return <Projects />
      case 'capabilities': return <Capabilities />
      case 'requirements': return <Requirements />
      case 'epics': return <Epics />
      case 'stories': return <UserStories />
      case 'risks': return <Risks />
      case 'dependencies': return <Dependencies />
      case 'roadmap': return <Roadmap />
      default: return <Resources />
    }
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h1 style={{margin:0}}>Project Management — CodeApp (DEV)</h1>
          <button className="btn" onClick={handleReset} style={{background:'#ef4444',fontSize:13}}>🔄 Reset Data</button>
        </div>
      </header>
      <nav style={{padding:12,display:'flex',gap:8,background:'#fff',borderBottom:'1px solid #e6e9ef'}}>
        {TABS.map(t=> (
          <button key={t.id} onClick={()=>setTab(t.id)} className="btn" style={{background: tab===t.id ? undefined : '#64748b'}}>{t.label}</button>
        ))}
      </nav>
      <FilterBar />
      <main className="main-area">
        {renderTab()}
      </main>
    </div>
  )
}

function FilterBar(){
  const { term, setTerm } = useSearch()
  return (
    <div className="filter-bar">
      <div style={{position:'relative',flex:1,maxWidth:420}}>
        <input
          className="filter-input"
          placeholder="🔍  Filter current view..."
          value={term}
          onChange={e=>setTerm(e.target.value)}
        />
        {term && (
          <button
            className="filter-clear"
            onClick={()=>setTerm('')}
            title="Clear filter"
          >✕</button>
        )}
      </div>
      {term && <span className="filter-hint">Filtering by "{term}"</span>}
    </div>
  )
}

// wrap App with SearchProvider at export
export function AppWithProviders(){
  return (
    <SearchProvider>
      <App />
    </SearchProvider>
  )
}
