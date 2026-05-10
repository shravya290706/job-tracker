'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

const links = [
  { href: '/jobs', label: 'Jobs' },
  { href: '/resume', label: 'Resume' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/analytics', label: 'Analytics' },
]

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  return (
    <nav style={{
      width: '100%',
      backgroundColor: 'rgba(14,13,26,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(124,92,252,0.15)',
      padding: '0 48px',
      height: '68px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <Link href="/" style={{ fontSize: '22px', fontWeight: 800, color: '#fff', textDecoration: 'none', fontFamily: 'Syne, sans-serif', letterSpacing: '-0.5px' }}>
        Career<span style={{ color: '#7c5cfc' }}>Copilot</span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        {links.map(({ href, label }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} style={{
              color: active ? '#fff' : '#888',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: active ? 'rgba(124,92,252,0.15)' : 'transparent',
              border: active ? '1px solid rgba(124,92,252,0.3)' : '1px solid transparent',
              transition: 'all 0.2s',
            }}>
              {label}
            </Link>
          )
        })}
        <button onClick={handleLogout} style={{
          color: '#888', background: 'none', border: '1px solid transparent',
          cursor: 'pointer', fontSize: '14px', fontWeight: 600,
          padding: '8px 16px', borderRadius: '8px',
        }}>
          Logout
        </button>
      </div>

      {/* CTA */}
      <Link href="/auth" style={{
        background: 'linear-gradient(135deg, #f0a500, #e09000)',
        color: '#000',
        padding: '10px 24px',
        borderRadius: '10px',
        fontWeight: 700,
        fontSize: '14px',
        textDecoration: 'none',
        boxShadow: '0 4px 20px rgba(240,165,0,0.3)',
        letterSpacing: '0.2px',
      }}>
        Get Started
      </Link>
    </nav>
  )
}
