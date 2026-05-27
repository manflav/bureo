import { createContext, useContext, useState } from 'react'

const FestivalsContext = createContext(null)

export function FestivalsProvider({ children }) {
  const [festivals, setFestivals] = useState([])
  return (
    <FestivalsContext.Provider value={{ festivals, setFestivals }}>
      {children}
    </FestivalsContext.Provider>
  )
}

export const useFestivalsContext = () => useContext(FestivalsContext)