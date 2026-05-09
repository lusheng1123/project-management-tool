import React from 'react'
import Modal from '../components/Modal'
import Table from '../components/Table'
import { getFields } from '../models'
import { ds } from '../services/DataAdapter'
import { useToast } from '../components/Toast'

const TABLE = 'pm_epic'

export default function Epics(){
  const [data,setData] = React.useState<any[]>([])
  const [loading,setLoading] = React.useState(true)
  const [modalOpen,setModalOpen] = React.useState(false)
  const [editRecord,setEditRecord] = React.useState<any|null>(null)
  const { toast, node } = useToast()

  async function load(){ setLoading(true); const all = await ds.getAll(TABLE); setData(all); setLoading(false) }
  React.useEffect(()=>{ load() },[])

  function openNew(){ setEditRecord(null); setModalOpen(true) }
  function openEdit(rec:any){ setEditRecord(rec); setModalOpen(true) }

  async function handleSave(vals:any){
    if(editRecord && editRecord.id){ await ds.update(TABLE, editRecord.id, vals); toast('Epic updated!') }
    else { await ds.create(TABLE, vals); toast('Epic created!') }
    setModalOpen(false); load()
  }

  async function handleDelete(rec:any){ if(!confirm('Delete epic?')) return; await ds.delete(TABLE, rec.id); toast('Deleted'); load() }

  const columns = [ { field: 'pm_title', label: 'Title' }, { field: 'pm_projectname', label: 'Project' }, { field: 'pm_ragstatus', label: 'RAG' } ]

  const actions = (r:any)=>[
    { id: 'edit', label: 'Edit', onClick: ()=>openEdit(r) },
    { id: 'delete', label: 'Delete', onClick: ()=>handleDelete(r) }
  ]

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2>Epics</h2>
        <div><button className="btn" onClick={openNew}>+ New Epic</button></div>
      </div>
      {loading ? (<div>Loading...</div>) : (<Table columns={columns} data={data} actions={actions} />)}
      {modalOpen && <Modal title={editRecord ? 'Edit Epic' : 'New Epic'} fields={getFields('pm_epic')} data={editRecord||{}} onClose={()=>setModalOpen(false)} onSave={handleSave} />}
      {node}
    </div>
  )
}
