import React from 'react'

export function useToast(){
  const [msg,setMsg] = React.useState<string| null>(null)
  React.useEffect(()=>{ if(msg){ const t = setTimeout(()=>setMsg(null),3000); return ()=>clearTimeout(t) } },[msg])
  return { toast: (m:string)=>setMsg(m), node: msg ? <div className="toast">{msg}</div> : null }
}
