import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'
import { Auth } from './components/Auth'
import { Dashboard } from './components/Dashboard'
import { ContactDialer } from './components/ContactDialer'
import { Loader2, PhoneCall, LogOut } from 'lucide-react'
import './App.css'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'dashboard' | 'dialer'>('dialer')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="app-loading-screen">
        <Loader2 className="spinner" size={40} />
        <p>Loading...</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="app-root">
        <Auth />
      </div>
    )
  }

  return (
    <div className="app-root">
      {/* Top nav with tab switcher */}
      <nav className="app-topnav">
        <div className="topnav-left">
          <button
            className={`topnav-tab ${view === 'dialer' ? 'active' : ''}`}
            onClick={() => setView('dialer')}
          >
            <PhoneCall size={16} />
            <span>Contact Dialer</span>
          </button>
          <button
            className={`topnav-tab ${view === 'dashboard' ? 'active' : ''}`}
            onClick={() => setView('dashboard')}
          >
            <span>Dashboard</span>
          </button>
        </div>
        <button
          className="topnav-signout"
          onClick={() => supabase.auth.signOut()}
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </nav>

      {view === 'dialer' ? <ContactDialer /> : <Dashboard user={session.user} />}
    </div>
  )
}
