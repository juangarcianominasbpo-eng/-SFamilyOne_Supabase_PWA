import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [emojiEnabled, setEmojiEnabled] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user || null)
    }
    getSession()
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
    return () => { sub.subscription.unsubscribe() }
  }, [])

  return (
    <AppContext.Provider value={{ user, emojiEnabled, setEmojiEnabled }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
