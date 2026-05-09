import React from 'react'
import Modal from '../components/Modal'
import Table from '../components/Table'
import { getFields } from '../models'
import { ds } from '../services/DataAdapter'
import { useToast } from '../components/Toast'
import Pipeline from '../components/Pipeline'

const TABLE = 'pm_product'

export default function Products(){
  const [data,setData] = React.useState<any[]>([])
  const [loading,setLoading] = React.useState(true)
  const [modalOpen,setModalOpen] = React.useState(false)
  const [editRecord,setEditRecord] = React.useState<any|null>(null)
  const [pipelineOpen,setPipelineOpen] = React.useState(false)
  const [pipelineProduct,setPipelineProduct] = React.useState<any|null>(null)
  const { toast, node } = useToast()

  async function load(){ setLoading(true); const all = await ds.getAll(TABLE); setData(all); setLoading(false) }
  React.useEffect(()=>{ load() },[])

  function openNew(){ setEditRecord(null); setModalOpen(true) }
  function openEdit(rec:any){ setEditRecord(rec); setModalOpen(true) }
  function openPipeline(rec:any){ setPipelineProduct(rec); setPipelineOpen(true) }

  async function handleSave(vals:any){
    if(editRecord && editRecord.id){ await ds.update(TABLE, editRecord.id, vals); toast('Product updated!') }
    else { await ds.create(TABLE, vals); toast('Product created!') }
    setModalOpen(false); load()
  }

  async function handleDelete(rec:any){ if(!confirm('Delete product?')) return; await ds.delete(TABLE, rec.id); toast('Deleted'); load() }

  const columns = [ { field: 'pm_name', label: 'Name' }, { field: 'pm_journeyname', label: 'Journey' }, { field: 'pm_shortname', label: 'Short' }, { field: 'pm_governancestatus', label: 'Governance' } ]

  const actions = (r:any)=>[
    { id: 'edit', label: 'Edit', onClick: ()=>openEdit(r) },
    { id: 'pipeline', label: '📊 Pipeline', onClick: ()=>openPipeline(r) },
    { id: 'delete', label: 'Delete', onClick: ()=>handleDelete(r) }
  ]

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2>Products</h2>
        <div><button className="btn" onClick={openNew}>+ New Product</button></div>
      </div>
      {loading ? (<div>Loading...</div>) : (<Table columns={columns} data={data} actions={actions} />)}
      {modalOpen && <Modal title={editRecord ? 'Edit Product' : 'New Product'} fields={getFields('pm_product')} data={editRecord||{}} onClose={()=>setModalOpen(false)} onSave={handleSave} />}
      {pipelineOpen && pipelineProduct && (
        <Pipeline productId={pipelineProduct.id} onClose={()=>{ setPipelineOpen(false); setPipelineProduct(null) }} />
      )}
      {node}
    </div>
  )
}
