import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import {
  Phone,
  Delete,
  User,
  Hash,
  Clock,
  Search,
  PhoneCall,
  UserX,
  Loader2,
  PhoneMissed,
} from 'lucide-react'

interface Contact {
  id: string
  name: string
  phone: string
  created_at: string
}

const KEYS = [
  { label: '1', sub: '' },
  { label: '2', sub: 'ABC' },
  { label: '3', sub: 'DEF' },
  { label: '4', sub: 'GHI' },
  { label: '5', sub: 'JKL' },
  { label: '6', sub: 'MNO' },
  { label: '7', sub: 'PQRS' },
  { label: '8', sub: 'TUV' },
  { label: '9', sub: 'WXYZ' },
  { label: '*', sub: '' },
  { label: '0', sub: '+' },
  { label: '#', sub: '' },
]

export function ContactDialer() {
  const [number, setNumber] = useState('')
  const [contact, setContact] = useState<Contact | null>(null)
  const [suggestions, setSuggestions] = useState<Contact[]>([])
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [allContacts, setAllContacts] = useState<Contact[]>([])
  const [calling, setCalling] = useState(false)

  // Load all contacts on mount for suggestions
  useEffect(() => {
    supabase
      .from('contacts')
      .select('*')
      .order('name')
      .then(({ data }) => {
        if (data) setAllContacts(data)
      })
  }, [])

  const searchContact = useCallback(
    async (num: string) => {
      if (!num) {
        setContact(null)
        setSuggestions([])
        setNotFound(false)
        return
      }

      setLoading(true)
      setNotFound(false)
      setContact(null)

      // Exact match
      const { data: exact } = await supabase
        .from('contacts')
        .select('*')
        .eq('phone', num)
        .single()

      if (exact) {
        setContact(exact)
        setSuggestions([])
        setLoading(false)
        return
      }

      // Partial match (starts with typed number)
      const partial = allContacts.filter((c) => c.phone.startsWith(num))
      setSuggestions(partial)

      if (partial.length === 0 && num.length >= 5) {
        setNotFound(true)
      }

      setLoading(false)
    },
    [allContacts]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      searchContact(number)
    }, 300)
    return () => clearTimeout(timer)
  }, [number, searchContact])

  const pressKey = (key: string) => {
    if (number.length >= 15) return
    setNumber((prev) => prev + key)
  }

  const deleteKey = () => {
    setNumber((prev) => prev.slice(0, -1))
    setContact(null)
    setNotFound(false)
  }

  const clearAll = () => {
    setNumber('')
    setContact(null)
    setSuggestions([])
    setNotFound(false)
  }

  const selectSuggestion = (c: Contact) => {
    setNumber(c.phone)
    setContact(c)
    setSuggestions([])
  }

  const simulateCall = () => {
    if (!contact) return
    setCalling(true)
    setTimeout(() => setCalling(false), 2500)
  }

  const formatPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '')
    if (digits.length <= 5) return digits
    if (digits.length <= 10) return `${digits.slice(0, 5)}-${digits.slice(5)}`
    return `${digits.slice(0, 5)}-${digits.slice(5, 10)}`
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

  const initials = contact
    ? contact.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : null

  return (
    <div className="dialer-page">
      {/* Header */}
      <header className="dialer-header">
        <div className="dialer-brand">
          <PhoneCall size={22} />
          <span>Contact Finder</span>
        </div>
        <div className="dialer-badge">
          <span>{allContacts.length} Contacts</span>
        </div>
      </header>

      <div className="dialer-layout">
        {/* LEFT: Dialer */}
        <div className="dialer-card">
          {/* Display */}
          <div className="dialer-display">
            <div className="dialer-number-row">
              {number ? (
                <span className="dialer-number">{formatPhone(number)}</span>
              ) : (
                <span className="dialer-placeholder">Number dalein...</span>
              )}
              {loading && <Loader2 className="dialer-spinner" size={18} />}
            </div>
            {number && (
              <button className="clear-btn" onClick={clearAll} title="Clear all">
                <Search size={14} />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Keypad */}
          <div className="keypad-grid">
            {KEYS.map((k) => (
              <button
                key={k.label}
                className="key-btn"
                onClick={() => pressKey(k.label)}
              >
                <span className="key-main">{k.label}</span>
                {k.sub && <span className="key-sub">{k.sub}</span>}
              </button>
            ))}
          </div>

          {/* Bottom row: empty | Call | Delete */}
          <div className="dialer-actions">
            <div />
            <button
              className={`call-btn ${calling ? 'calling' : ''} ${!contact ? 'disabled-call' : ''}`}
              onClick={simulateCall}
              disabled={!contact}
              title={contact ? `Call ${contact.name}` : 'Contact nahi mila'}
            >
              {calling ? (
                <Loader2 className="spinner" size={26} />
              ) : (
                <Phone size={26} />
              )}
            </button>
            <button
              className="delete-btn"
              onClick={deleteKey}
              disabled={!number}
              onDoubleClick={clearAll}
              title="Delete (Double-click to clear)"
            >
              <Delete size={22} />
            </button>
          </div>

          {calling && contact && (
            <div className="calling-indicator">
              <span>📞 Calling {contact.name}...</span>
            </div>
          )}
        </div>

        {/* RIGHT: Result Panel */}
        <div className="result-panel">
          {/* Contact found */}
          {contact && (
            <div className="contact-card found">
              <div className="contact-avatar">{initials}</div>
              <h2 className="contact-name">{contact.name}</h2>
              <p className="contact-phone-display">
                <Phone size={15} /> {contact.phone}
              </p>

              <div className="contact-details-grid">
                <div className="detail-item">
                  <div className="detail-icon">
                    <User size={18} />
                  </div>
                  <div>
                    <span className="detail-label">Full Name</span>
                    <span className="detail-value">{contact.name}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="detail-label">Phone Number</span>
                    <span className="detail-value">{contact.phone}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <Hash size={18} />
                  </div>
                  <div>
                    <span className="detail-label">Contact ID</span>
                    <span className="detail-value code-val">{contact.id.slice(0, 16)}...</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <Clock size={18} />
                  </div>
                  <div>
                    <span className="detail-label">Added On</span>
                    <span className="detail-value">{formatDate(contact.created_at)}</span>
                  </div>
                </div>
              </div>

              <button
                className="call-contact-btn"
                onClick={simulateCall}
                disabled={calling}
              >
                {calling ? (
                  <><Loader2 className="spinner" size={16} /> Calling...</>
                ) : (
                  <><Phone size={16} /> Call {contact.name}</>
                )}
              </button>
            </div>
          )}

          {/* Suggestions */}
          {!contact && suggestions.length > 0 && (
            <div className="suggestions-box">
              <p className="suggestions-title">
                <Search size={15} /> {suggestions.length} match{suggestions.length > 1 ? 'es' : ''} mila
              </p>
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  className="suggestion-item"
                  onClick={() => selectSuggestion(s)}
                >
                  <div className="sug-avatar">
                    {s.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div className="sug-info">
                    <span className="sug-name">{s.name}</span>
                    <span className="sug-phone">{s.phone}</span>
                  </div>
                  <Phone size={16} className="sug-call-icon" />
                </button>
              ))}
            </div>
          )}

          {/* Not found */}
          {notFound && !contact && (
            <div className="not-found-box">
              <PhoneMissed size={48} className="not-found-icon" />
              <h3>Contact Nahi Mila</h3>
              <p>
                <strong>{number}</strong> number se koi contact nahi mila.
              </p>
            </div>
          )}

          {/* Empty state */}
          {!contact && !notFound && suggestions.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon-wrap">
                <UserX size={52} />
              </div>
              <h3>Number Dalein</h3>
              <p>Left side ka keypad use karke number type karein. Contact match hote hi details yahan dikhenge.</p>
              <div className="all-contacts-mini">
                <p className="mini-title">All Contacts ({allContacts.length})</p>
                {allContacts.map((c) => (
                  <button
                    key={c.id}
                    className="mini-contact"
                    onClick={() => selectSuggestion(c)}
                  >
                    <span className="mini-avatar">
                      {c.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                    <span className="mini-name">{c.name}</span>
                    <span className="mini-phone">{c.phone}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
