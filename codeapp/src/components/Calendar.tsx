import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { ds } from '../services/DataAdapter'
import { useSearch } from '../contexts/SearchContext'

function getStatusColor(status:string):string{
  const m:Record<string,string>={'Onboarding':'#94a3b8','Development Phase 1':'#3b82f6','Development Phase 2':'#8b5cf6','Review':'#f59e0b','Live':'#10b981'}
  return m[status]||'#64748b'
}
const STATUS_LABELS=[{label:'Onboarding',key:'Onboarding'},{label:'Dev Phase 1',key:'Development Phase 1'},{label:'Dev Phase 2',key:'Development Phase 2'},{label:'Review',key:'Review'},{label:'Live',key:'Live'}]

export default function CalendarView(){
  const [events,setEvents]=React.useState<any[]>([])
  const { term } = useSearch()

  React.useEffect(()=>{(async()=>{
    const projects=await ds.getAll('pm_project')
    const ev=projects.map((p:any)=>({
      id:p.id,title:p.pm_name,
      start:p.pm_startdate||null,end:p.pm_targetdeliverydate||null,
      extendedProps:{status:p.pm_status,completion:p.pm_overallcompletion,product:p.pm_productname},
      backgroundColor:getStatusColor(p.pm_status),borderColor:getStatusColor(p.pm_status),textColor:'#fff'
    }))
    setEvents(ev)
  })()},[])

  const q=(term||'').toLowerCase().trim()
  const filtered=q?events.filter(e=>{const t=((e.title||'')+' '+(e.extendedProps?.status||'')+' '+(e.extendedProps?.product||'')).toLowerCase();return t.includes(q)}):events

  async function handleEventDrop(info:any){
    const id=info.event.id
    await ds.update('pm_project',id,{pm_startdate:info.event.startStr||null,pm_targetdeliverydate:info.event.endStr||null})
  }

  function renderEventContent(info:any){
    const {status,completion}=info.event.extendedProps||{}
    return <div style={{padding:'2px 4px',fontSize:12,lineHeight:1.3}}><div style={{fontWeight:600,whiteSpace:'normal'}}>{info.event.title}</div><div style={{fontSize:11,opacity:0.9}}>{status||'—'}{completion!=null?` • ${completion}%`:''}</div></div>
  }

  return (
    <div>
      <div className="calendar-legend">
        {STATUS_LABELS.map(s=><span key={s.key} style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:12,fontWeight:500,color:'#475569'}}><span style={{width:12,height:12,borderRadius:3,background:getStatusColor(s.key),display:'inline-block'}}/>{s.label}</span>)}
        {q&&<span style={{fontSize:12,color:'#64748b',marginLeft:'auto'}}>Showing {filtered.length} of {events.length} projects</span>}
      </div>
      <FullCalendar
        plugins={[dayGridPlugin,timeGridPlugin,interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{left:'prev,next today',center:'title',right:'dayGridMonth,timeGridWeek,timeGridDay'}}
        events={filtered}
        editable={true} selectable={true}
        eventDrop={handleEventDrop}
        height={650}
        eventContent={renderEventContent}
        eventDidMount={(info:any)=>{const p=info.event.extendedProps;if(!p)return;info.el.setAttribute('title',`${info.event.title} — ${p.status||'?'} | ${p.completion||0}% | ${p.product||'?'}`)}}
      />
    </div>
  )
}
