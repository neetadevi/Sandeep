import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'
import { Auth } from './components/Auth'
import { Dashboard } from './components/Dashboard'
import { Loader2 } from 'lucide-react'
import './App.css'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check initial active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes (login, logout, token refresh, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="app-loading-screen">
        <Loader2 className="spinner" size={40} />
        <p>Connecting to Supabase...</p>
      </div>
    )
  }

  return (
    <div className="app-root">
      {session ? <Dashboard user={session.user} /> : <Auth />}
    </div>
  )
}
