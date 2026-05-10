'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

const NAV = [
  { href: '/dashboard',  icon: '⊞',  label: 'Dashboard' },
  { href: '/jobs',       icon: '🔍', label: 'Browse Jobs' },
  { href: '/resume',     icon: '📄', label: 'My Resume' },
  { href: '/analytics',  icon: '📊', label: 'Analytics' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  const isAuth = pathname === '/auth' || pathname === '/'

  if (isAuth) return null

  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, bottom: 0, width: '240px',
      backgroundColor: '#0c0b18',
      borderRight: '1px solid #1a1928',
      display: 'flex', flexDirection: 'column',
      zIndex: 50, padding: '0',
    }}>
      {/* Logo */}
      <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid #1a1928' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', fontFamily: 'Syne, sans-serif', letterSpacing: '-0.5px' }}>
            Career<span style={{ color: '#7c5cfc' }}>Copilot</span>
          </div>
          <div style={{ fontSize: '11px', color: '#444', marginTop: '3px', fontWeight: 500 }}>AI Job Search Assistant</div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ fontSize: '10px', color: '#333', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', padding: '0 12px', marginBottom: '8px' }}>
          Main Menu
        </div>
        {NAV.map(({ href, icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 12px', borderRadius: '10px', textDecoration: 'none',
              backgroundColor: active ? 'rgba(124,92,252,0.15)' : 'transparent',
              border: active ? '1px solid rgba(124,92,252,0.2)' : '1px solid transparent',
              color: active ? '#fff' : '#555',
              fontSize: '14px', fontWeight: active ? 700 : 500,
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#aaa' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#555' } }}
            >
              <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>{icon}</span>
              {label}
              {active && <span style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#7c5cfc' }} />}
            </Link>
          )
        })}

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: '#1a1928', margin: '12px 0' }} />

        <div style={{ fontSize: '10px', color: '#333', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', padding: '0 12px', marginBottom: '8px' }}>
          Tools
        </div>
        <Link href="/jobs" style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '10px 12px', borderRadius: '10px', textDecoration: 'none',
          color: '#555', fontSize: '14px', fontWeight: 500, border: '1px solid transparent',
        }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#aaa' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#555' }}
        >
          <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>✉️</span>
          Cover Letter AI
        </Link>
        <Link href="/jobs" style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '10px 12px', borderRadius: '10px', textDecoration: 'none',
          color: '#555', fontSize: '14px', fontWeight: 500, border: '1px solid transparent',
        }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#aaa' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#555' }}
        >
          <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>🔬</span>
          Skill Gap Analyzer
        </Link>
      </nav>

      {/* Bottom */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid #1a1928' }}>
        <Link href="/auth" style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 12px', borderRadius: '10px', textDecoration: 'none',
          background: 'linear-gradient(135deg, rgba(240,165,0,0.15), rgba(240,165,0,0.05))',
          border: '1px solid rgba(240,165,0,0.2)',
          marginBottom: '8px',
        }}>
          <span style={{ fontSize: '14px' }}>✨</span>
          <span style={{ color: '#f0a500', fontSize: '13px', fontWeight: 700 }}>Upgrade to Pro</span>
        </Link>
        <button onClick={handleLogout} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
          padding: '10px 12px', borderRadius: '10px',
          backgroundColor: 'transparent', border: '1px solid transparent',
          color: '#444', fontSize: '14px', fontWeight: 500, cursor: 'pointer',
        }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(248,113,113,0.08)'; e.currentTarget.style.color = '#f87171' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#444' }}
        >
          <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>→</span>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
