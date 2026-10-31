import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../supabaseClient'
import {
  LogOut,
  User as UserIcon,
  Mail,
  Shield,
  Calendar,
  Database,
  ExternalLink,
  CheckCircle,
  Loader2,
} from 'lucide-react'

interface DashboardProps {
  user: User
}

export function Dashboard({ user }: DashboardProps) {
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    try {
      setSigningOut(true)
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setSigningOut(false)
    }
  }

  const displayName =
    user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const formattedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A'

  return (
    <div className="dashboard-container">
      {/* Top Navbar */}
      <header className="dashboard-nav">
        <div className="brand-group">
          <div className="brand-badge">
            <Database size={20} />
          </div>
          <span className="brand-name">Supabase Auth App</span>
        </div>

        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="signout-btn"
        >
          {signingOut ? (
            <Loader2 className="spinner" size={16} />
          ) : (
            <LogOut size={16} />
          )}
          <span>{signingOut ? 'Signing out...' : 'Sign Out'}</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        <div className="welcome-banner">
          <div className="avatar-circle">{initials}</div>
          <div className="welcome-text">
            <h2>Welcome, {displayName}! 👋</h2>
            <p>You have successfully authenticated via Supabase.</p>
          </div>
        </div>

        <div className="info-grid">
          {/* Account Profile Card */}
          <div className="card">
            <div className="card-header">
              <UserIcon size={20} className="card-icon" />
              <h3>User Details</h3>
            </div>
            <div className="card-body">
              <div className="data-row">
                <span className="data-label">
                  <Mail size={15} /> Email
                </span>
                <span className="data-val">{user.email}</span>
              </div>
              <div className="data-row">
                <span className="data-label">
                  <UserIcon size={15} /> Full Name
                </span>
                <span className="data-val">{displayName}</span>
              </div>
              <div className="data-row">
                <span className="data-label">
                  <Calendar size={15} /> Member Since
                </span>
                <span className="data-val">{formattedDate}</span>
              </div>
              <div className="data-row">
                <span className="data-label">
                  <Shield size={15} /> User ID
                </span>
                <span className="data-val code-val">{user.id}</span>
              </div>
            </div>
          </div>

          {/* Supabase Connection Card */}
          <div className="card">
            <div className="card-header">
              <Database size={20} className="card-icon" />
              <h3>Supabase Backend</h3>
            </div>
            <div className="card-body">
              <div className="status-badge active">
                <CheckCircle size={16} />
                <span>Supabase Auth Connected</span>
              </div>
              <div className="data-row" style={{ marginTop: '1rem' }}>
                <span className="data-label">Project Ref</span>
                <span className="data-val code-val">blcawafnjzbebbdzvevw</span>
              </div>
              <div className="data-row">
                <span className="data-label">Auth Provider</span>
                <span className="data-val">
                  {user.app_metadata?.provider || 'email'}
                </span>
              </div>
              <div className="data-row">
                <span className="data-label">Session Status</span>
                <span className="data-val text-success">Active & Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action / Next steps card */}
        <div className="card full-width">
          <div className="card-header">
            <Shield size={20} className="card-icon" />
            <h3>Security & Next Steps</h3>
          </div>
          <div className="card-body">
            <p className="description-text">
              Your session is securely managed with JSON Web Tokens (JWT) stored
              in localStorage and refreshed automatically by the Supabase client.
            </p>
            <div className="quick-links">
              <a
                href="https://supabase.com/docs/guides/auth"
                target="_blank"
                rel="noreferrer"
                className="chip-link"
              >
                <span>Supabase Auth Docs</span>
                <ExternalLink size={14} />
              </a>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="chip-link"
              >
                <span>Supabase Dashboard</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

