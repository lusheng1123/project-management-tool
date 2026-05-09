import React from 'react'
import Modal from '../components/Modal'
import Table from '../components/Table'
import { getFields } from '../models'
import { ds } from '../services/DataAdapter'
import { useToast } from '../components/Toast'

const TABLE = 'pm_userstory'

export default function UserStories(){
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
    if(editRecord && editRecord.id){ await ds.update(TABLE, editRecord.id, vals); toast('User Story updated!') }
    else { await ds.create(TABLE, vals); toast('User Story created!') }
    setModalOpen(false); load()
  }

  async function handleDelete(rec:any){ if(!confirm('Delete story?')) return; await ds.delete(TABLE, rec.id); toast('Deleted'); load() }

  const columns = [ { field: 'pm_detail', label: 'Detail' }, { field: 'pm_epicid', label: 'Epic' } ]

  const actions = (r:any)=>[
    { id: 'edit', label: 'Edit', onClick: ()=>openEdit(r) },
    { id: 'delete', label: 'Delete', onClick: ()=>handleDelete(r) }
  ]

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2>User Stories</h2>
        <div><button className="btn" onClick={openNew}>+ New Story</button></div>
      </div>
      {loading ? (<div>Loading...</div>) : (<Table columns={columns} data={data} actions={actions} />)}
      {modalOpen && <Modal title={editRecord ? 'Edit Story' : 'New Story'} fields={getFields('pm_userstory')} data={editRecord||{}} onClose={()=>setModalOpen(false)} onSave={handleSave} />}
      {node}
    </div>
  )
}
