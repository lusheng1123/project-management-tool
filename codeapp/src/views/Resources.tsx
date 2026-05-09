import React from 'react'
import Modal from '../components/Modal'
import Table from '../components/Table'
import DataAdapter, { ds } from '../services/DataAdapter'
import { getFields } from '../models'
import { useToast } from '../components/Toast'

const TABLE = 'pm_resource'

export default function Resources(){
  const [data,setData] = React.useState<any[]>([])
  const [loading,setLoading] = React.useState(true)
  const [modalOpen,setModalOpen] = React.useState(false)
  const [editRecord,setEditRecord] = React.useState<any|null>(null)
  const { toast, node } = useToast()

  async function load(){
    setLoading(true)
    const all = await ds.getAll(TABLE)
    setData(all)
    setLoading(false)
  }

  React.useEffect(()=>{ load() },[])

  function openNew(){ setEditRecord(null); setModalOpen(true) }
  function openEdit(rec:any){ setEditRecord(rec); setModalOpen(true) }

  async function handleSave(vals:any){
    if(editRecord && editRecord.id){
      await ds.update(TABLE, editRecord.id, vals)
      toast('Resource updated!')
    } else {
      await ds.create(TABLE, vals)
      toast('Resource created!')
    }
    setModalOpen(false)
    load()
  }

  async function handleDelete(rec:any){
    if(!confirm('Delete this resource?')) return
    await ds.delete(TABLE, rec.id)
    toast('Resource deleted')
    load()
  }

  const columns = [
    { field: 'pm_name', label: 'Name' },
    { field: 'pm_role', label: 'Role' },
    { field: 'pm_department', label: 'Department' },
    { field: 'pm_team', label: 'Team' },
    { field: 'pm_status', label: 'Status', format: 'badge' }
  ]

  const actions = (r:any)=>[
    { id: 'edit', label: 'Edit', onClick: ()=>openEdit(r) },
    { id: 'delete', label: 'Delete', onClick: ()=>handleDelete(r) }
  ]

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2>Resources</h2>
        <div>
          <button className="btn" onClick={openNew}>+ New Resource</button>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card"><div className="stat-number">{data.length}</div><div className="stat-label">Total Resources</div></div>
      </div>

      {loading ? (<div>Loading...</div>) : (<Table columns={columns} data={data} actions={actions} />)}

      {modalOpen && (
        <Modal title={editRecord ? 'Edit Resource' : 'New Resource'} fields={getFields('pm_resource')} data={editRecord||{}} onClose={()=>setModalOpen(false)} onSave={handleSave} />
      )}

      {node}
    </div>
  )
}
