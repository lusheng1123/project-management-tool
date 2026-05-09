import React from 'react'
import { FieldDef } from '../models'

type Props = {
  title: string
  fields?: FieldDef[]
  data?: any
  onClose: ()=>void
  onSave: (vals:any)=>void
}

export default function Modal({ title, fields=[], data={}, onClose, onSave }:Props){
  const [form, setForm] = React.useState(() => {
    const init:any = {}
    fields.forEach(f=>{ init[f.name] = (data && data[f.name]) || '' })
    return init
  })

  React.useEffect(()=>{
    const init:any = {}
    fields.forEach(f=>{ init[f.name] = (data && data[f.name]) || '' })
    setForm(init)
  },[data])

  function setVal(name:string,val:any){ setForm(prev=>({ ...prev, [name]: val })) }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {fields.map(f=>{
            if(f.type==='multiline'){
              return (
                <div key={f.name}>
                  <label>{f.label}</label>
                  <textarea value={form[f.name]||''} onChange={e=>setVal(f.name,e.target.value)} />
                </div>
              )
            }
            if(f.type==='choice'){
              return (
                <div key={f.name}>
                  <label>{f.label}</label>
                  <select value={form[f.name]||''} onChange={e=>setVal(f.name,e.target.value)}>
                    <option value="">--</option>
                    {f.choices && f.choices.map(c=> <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )
            }
            return (
              <div key={f.name}>
                <label>{f.label}</label>
                <input value={form[f.name]||''} onChange={e=>setVal(f.name,e.target.value)} />
              </div>
            )
          })}
        </div>
        <div className="modal-footer" style={{display:'flex',justifyContent:'flex-end',gap:8}}>
          <button className="btn" onClick={()=>onSave(form)}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
