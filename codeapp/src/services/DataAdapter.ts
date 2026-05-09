import { getFields, getTableMeta } from '../models'

const APP_CONFIG = { MODE: (typeof window !== 'undefined' && (window as any).Xrm) ? 'PROD' : 'DEV' }

export type RecordType = { id?: string; [k:string]: any }

function genId(prefix='tbl'){
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2,7)}`
}

export default class DataAdapter {
  mode = APP_CONFIG.MODE

  constructor(){
    // allow runtime override (e.g., set ds.mode='DEV' in the console)
    this.mode = APP_CONFIG.MODE
  }

  async create(table:string, record:RecordType){
    if(this.mode==='DEV') return this._createLocal(table, record)
    return this._createProd(table, record)
  }

  async getAll(table:string){
    if(this.mode==='DEV') return this._getAllLocal(table)
    return this._getAllProd(table)
  }

  async getById(table:string,id:string){
    if(this.mode==='DEV') return this._getByIdLocal(table,id)
    return this._getByIdProd(table,id)
  }

  async update(table:string,id:string,updates:RecordType){
    if(this.mode==='DEV') return this._updateLocal(table,id,updates)
    return this._updateProd(table,id,updates)
  }

  async delete(table:string,id:string){
    if(this.mode==='DEV') return this._deleteLocal(table,id)
    return this._deleteProd(table,id)
  }

  async query(table:string,filters:Record<string,any>={}){
    const all = await this.getAll(table)
    return all.filter((record:RecordType)=>{
      return Object.keys(filters).every(k=>{
        if(!filters[k]) return true
        const val = record[k]
        const filterVal = filters[k]
        if(typeof filterVal==='string') return (val||'').toString().toLowerCase().includes(filterVal.toString().toLowerCase())
        return val === filterVal
      })
    })
  }

  // ===== localStorage implementations =====
  _createLocal(table:string,record:RecordType){
    const data = JSON.parse(localStorage.getItem(table) || '[]')
    const rec = { ...record, id: genId(table) }
    data.push(rec)
    localStorage.setItem(table, JSON.stringify(data))
    return rec
  }

  _getAllLocal(table:string){
    return JSON.parse(localStorage.getItem(table) || '[]')
  }

  _getByIdLocal(table:string,id:string){
    const data = this._getAllLocal(table)
    return data.find((r:any)=>r.id===id) || null
  }

  _updateLocal(table:string,id:string,updates:RecordType){
    const data = this._getAllLocal(table)
    const idx = data.findIndex((r:any)=>r.id===id)
    if(idx===-1) return null
    data[idx] = { ...data[idx], ...updates }
    localStorage.setItem(table, JSON.stringify(data))
    return data[idx]
  }

  _deleteLocal(table:string,id:string){
    const data = this._getAllLocal(table)
    const filtered = data.filter((r:any)=>r.id!==id)
    localStorage.setItem(table, JSON.stringify(filtered))
    return true
  }

  // ===== Dataverse / Xrm.WebApi implementations (PROD) =====
  async _createProd(table:string, record:RecordType){
    const X = (typeof window !== 'undefined') ? (window as any).Xrm : null
    if(!X || !X.WebApi) throw new Error('Xrm.WebApi is not available')
    const meta = getTableMeta(table)
    const fields = getFields(table)
    const payload: RecordType = {}
    for(const f of fields){
      const val = record[f.name]
      if(val == null) continue
      if(f.type === 'lookup' && f.target){
        // expect val to be an id (GUID) or object with id
        const id = typeof val === 'string' ? val : (val.id || val)
        payload[`${f.name}@odata.bind`] = `/${(f.target || meta.entitySet)|| (f.target+'s')}(${id})`
      } else {
        payload[f.name] = val
      }
    }
    const res = await X.WebApi.createRecord(table, payload)
    const id = res && (res.id || res)
    return await this._getByIdProd(table, id)
  }

  async _getAllProd(table:string){
    const X = (typeof window !== 'undefined') ? (window as any).Xrm : null
    if(!X || !X.WebApi) throw new Error('Xrm.WebApi is not available')
    // Build $select from model fields to minimize payload
    const fields = getFields(table).map(f=>f.name)
    const meta = getTableMeta(table)
    const pk = meta.pk || `${table}id`
    const select = Array.from(new Set([pk, ...fields])).join(',')
    const resp = await X.WebApi.retrieveMultipleRecords(table, `?$select=${select}`)
    const vals = resp && resp.value ? resp.value : []
    return vals.map((v:any)=>{
      const id = v[pk] || v.id || v[`${table}id`]
      return { ...v, id }
    })
  }

  async _getByIdProd(table:string,id:string){
    const X = (typeof window !== 'undefined') ? (window as any).Xrm : null
    if(!X || !X.WebApi) throw new Error('Xrm.WebApi is not available')
    const fields = getFields(table).map(f=>f.name)
    const meta = getTableMeta(table)
    const pk = meta.pk || `${table}id`
    const select = Array.from(new Set([pk, ...fields])).join(',')
    const rec = await X.WebApi.retrieveRecord(table, id, `?$select=${select}`)
    const rid = rec[pk] || rec.id || id
    return { ...rec, id: rid }
  }

  async _updateProd(table:string,id:string,updates:RecordType){
    const X = (typeof window !== 'undefined') ? (window as any).Xrm : null
    if(!X || !X.WebApi) throw new Error('Xrm.WebApi is not available')
    const fields = getFields(table)
    const payload: RecordType = {}
    for(const f of fields){
      if(!(f.name in updates)) continue
      const val = updates[f.name]
      if(val == null) continue
      if(f.type === 'lookup' && f.target){
        const id = typeof val === 'string' ? val : (val.id || val)
        payload[`${f.name}@odata.bind`] = `/${(f.target || getTableMeta(table).entitySet)||(f.target+'s')}(${id})`
      } else {
        payload[f.name] = val
      }
    }
    await X.WebApi.updateRecord(table, id, payload)
    return await this._getByIdProd(table, id)
  }

  async _deleteProd(table:string,id:string){
    const X = (typeof window !== 'undefined') ? (window as any).Xrm : null
    if(!X || !X.WebApi) throw new Error('Xrm.WebApi is not available')
    await X.WebApi.deleteRecord(table, id)
    return true
  }
}

export const ds = new DataAdapter()
