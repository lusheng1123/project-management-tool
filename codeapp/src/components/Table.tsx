import React from 'react'
import { useSearch } from '../contexts/SearchContext'

function getBadgeColor(val: any): string {
  if (val == null) return '#e2e8f0'
  const v = String(val).toLowerCase()
  if (v === 'g' || v === 'green') return '#16a34a'
  if (v === 'a' || v === 'amber') return '#f59e0b'
  if (v === 'r' || v === 'red') return '#dc2626'
  if (v === 'active') return '#16a34a'
  if (v === 'inactive') return '#94a3b8'
  if (v === 'on leave') return '#f59e0b'
  if (v === 'live') return '#16a34a'
  if (v === 'review') return '#f59e0b'
  if (v === 'development phase 1') return '#3b82f6'
  if (v === 'development phase 2') return '#8b5cf6'
  if (v === 'onboarding') return '#94a3b8'
  if (v === 'linked' || v === 'prioritized') return '#3b82f6'
  if (v === 'new') return '#94a3b8'
  if (v === 'approved') return '#16a34a'
  if (v === 'pending') return '#f59e0b'
  if (v === 'rejected') return '#dc2626'
  if (v === 'yes') return '#3b82f6'
  if (v === 'no' || v === 'n/a') return '#94a3b8'
  if (v === 'critical') return '#dc2626'
  if (v === 'high') return '#f59e0b'
  if (v === 'medium') return '#3b82f6'
  if (v === 'low') return '#16a34a'
  if (v === 'identified' || v === 'mitigating') return '#f59e0b'
  if (v === 'realized') return '#dc2626'
  if (v === 'closed' || v === 'resolved' || v === 'mitigated') return '#16a34a'
  return '#e2e8f0'
}

function getBadgeTextColor(bg: string): string {
  return ['#16a34a','#dc2626','#3b82f6','#8b5cf6'].includes(bg) ? '#fff' : '#1e293b'
}

function shouldAutoBadge(field: string, val: any): boolean {
  if (val == null) return false
  const f = field.toLowerCase()
  return ['status','ragstatus','rag','governancestatus','governance','pscapprovalrequired','pscapprovalstatus','department','priority','probability','impact','type','pm_status','pm_ragstatus','pm_governancestatus','pm_pscapprovalrequired','pm_pscapprovalstatus','pm_department'].some(af => f.includes(af))
}

export default function Table({ columns, data, actions }: any){
  const { term } = useSearch()
  const [sortField, setSortField] = React.useState<string | null>(null)
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc')

  const q = (term || '').toLowerCase().trim()

  let filtered = q
    ? data.filter((row:any)=>{ const text = Object.values(row).join(' ').toLowerCase(); return text.includes(q) })
    : [...data]

  if (sortField) {
    filtered.sort((a:any,b:any)=>{
      const va = a[sortField] ?? ''; const vb = b[sortField] ?? ''
      const cmp = String(va).localeCompare(String(vb), undefined, { numeric: true })
      return sortDir === 'asc' ? cmp : -cmp
    })
  }

  function handleSort(field:string){
    if (sortField === field) { setSortDir(d=> d==='asc'?'desc':'asc') }
    else { setSortField(field); setSortDir('asc') }
  }

  if(!filtered || filtered.length===0) return <div className="empty-state">{q ? `No records match "${term}"` : 'No records'}</div>

  return (
    <div>
      {q && <div style={{fontSize:13,color:'#64748b',marginBottom:8}}>Showing {filtered.length} of {data.length} records</div>}
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((c:any)=>(
              <th key={c.field} onClick={()=>handleSort(c.field)} className="sortable-th" title={`Sort by ${c.label}`}>
                {c.label}{sortField===c.field ? <span className="sort-arrow">{sortDir==='asc'?' ▲':' ▼'}</span> : null}
              </th>
            ))}
            {actions ? <th>Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {filtered.map((row:any)=> (
            <tr key={row.id} className="data-row">
              {columns.map((c:any)=>{
                const val = row[c.field]
                const isBadge = c.format==='badge' || shouldAutoBadge(c.field, val)
                if (isBadge) {
                  const bg = getBadgeColor(val); const tc = getBadgeTextColor(bg)
                  return <td key={c.field}><span className="badge" style={{background:bg,color:tc}}>{val??'—'}</span></td>
                }
                return <td key={c.field}>{val??'—'}</td>
              })}
              {actions ? <td className="actions-cell">{(typeof actions==='function'?actions(row):actions).map((a:any)=>(
                <button key={a.id} onClick={()=>a.onClick(row)} className="action-btn">{a.label}</button>
              ))}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
