import React from 'react'

type SearchContextType = { term: string; setTerm: (t:string)=>void }

export const SearchContext = React.createContext<SearchContextType>({ term: '', setTerm: ()=>{} })

export function SearchProvider({ children }: { children: React.ReactNode }){
  const [term, setTerm] = React.useState('')
  return (
    <SearchContext.Provider value={{ term, setTerm }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch(){ return React.useContext(SearchContext) }
