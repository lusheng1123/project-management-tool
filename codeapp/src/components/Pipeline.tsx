import React from 'react'
import { ds } from '../services/DataAdapter'

type Props = { productId: string, onClose: ()=>void }

const STAGES = ['Onboarding','Development Phase 1','Development Phase 2','Review','Live']

export default function Pipeline({ productId, onClose }: Props){
  const [columns, setColumns] = React.useState<Record<string,any[]>>({})

  React.useEffect(()=>{
    (async ()=>{
      const all = await ds.getAll('pm_project')
      const projects = all.filter(p=> p.pm_productname === productId)
      const map:Record<string,any[]> = {}
      STAGES.forEach(s=> map[s]=projects.filter(p=>p.pm_status===s))
      setColumns(map)
    })()
  },[productId])

  function handleDragStart(e:React.DragEvent, projId:string){
    e.dataTransfer.setData('text/plain', projId)
  }

  async function handleDrop(e:React.DragEvent, targetStage:string){
    e.preventDefault()
    const projId = e.dataTransfer.getData('text/plain')
    if(!projId) return
    // update data store
    await ds.update('pm_project', projId, { pm_status: targetStage })
    // refresh columns
    const all = await ds.getAll('pm_project')
    const projects = all.filter(p=> p.pm_productname === productId)
    const map:Record<string,any[]> = {}
    STAGES.forEach(s=> map[s]=projects.filter(p=>p.pm_status===s))
    setColumns(map)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{margin:0}}>📊 Product Pipeline</h3>
          <button onClick={onClose} className="btn" style={{background:'#e2e8f0',color:'#1e293b',padding:'4px 10px'}}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{display:'flex',gap:12,minHeight:200,maxHeight:'65vh',overflowX:'auto',overflowY:'auto',padding:'4px 0'}}>
            {STAGES.map(stage=> {
              const cards = columns[stage]||[]
              return (
                <div key={stage} onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>handleDrop(e, stage)}
                  style={{minWidth:260,maxWidth:300,flex:'0 0 260px',display:'flex',flexDirection:'column',background:'#f8fafc',borderRadius:8,padding:10}}>
                  <div style={{fontWeight:600,marginBottom:10,display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0}}>
                    <span>{stage}</span>
                    <span style={{background:'#eef2ff',color:'#4338ca',padding:'2px 8px',borderRadius:99,fontSize:12,fontWeight:600}}>{cards.length}</span>
                  </div>
                  <div style={{overflowY:'auto',flex:1,minHeight:40}}>
                    {cards.length===0 && <div style={{color:'#94a3b8',fontSize:13,textAlign:'center',padding:16}}>Drop projects here</div>}
                    {cards.map(p=> (
                      <div key={p.id} draggable onDragStart={(e)=>handleDragStart(e,p.id)}
                        style={{background:'#fff',padding:10,borderRadius:6,marginBottom:8,boxShadow:'0 1px 3px rgba(0,0,0,0.06)',cursor:'grab',border:'1px solid #e2e8f0',transition:'box-shadow 0.15s'}}>
                        <div style={{fontWeight:600,fontSize:14,marginBottom:4}}>{p.pm_name}</div>
                        <div style={{fontSize:12,color:'#6b7280'}}>{p.pm_overallcompletion||0}%</div>
                        <div style={{fontSize:11,color:'#94a3b8',marginTop:2}}>{p.pm_startdate||'?'} → {p.pm_targetdeliverydate||'?'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
