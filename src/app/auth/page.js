'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push('/dashboard')
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else router.push('/dashboard')
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '13px 16px', borderRadius: '10px',
    border: '1px solid #1e1d2e', backgroundColor: '#0c0b18',
    color: '#fff', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s',
  }

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      backgroundColor: '#0e0d1a', display: 'flex',
      backgroundImage: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(124,92,252,0.12) 0%, transparent 60%)',
    }}>
      {/* Left Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 80px', borderRight: '1px solid #1a1928' }}>
        <Link href="/" style={{ fontSize: '22px', fontWeight: 800, color: '#fff', fontFamily: 'Syne, sans-serif', marginBottom: '60px', display: 'block' }}>
          Career<span style={{ color: '#7c5cfc' }}>Copilot</span>
        </Link>
        <h2 style={{ fontSize: '40px', fontWeight: 800, color: '#fff', fontFamily: 'Syne, sans-serif', marginBottom: '16px', lineHeight: 1.1 }}>
          {isLogin ? 'Welcome back' : 'Get started today'}
        </h2>
        <p style={{ color: '#444', fontSize: '16px', marginBottom: '40px', lineHeight: 1.6 }}>
          {isLogin ? 'Sign in to continue your AI-powered job search.' : 'Create your account and start landing more interviews.'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '400px' }}>
          <div>
            <label style={{ color: '#444', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '8px' }}>Email</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} required
              onFocus={e => e.target.style.borderColor = '#7c5cfc'}
              onBlur={e => e.target.style.borderColor = '#1e1d2e'}
            />
          </div>
          <div>
            <label style={{ color: '#444', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '8px' }}>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} required
              onFocus={e => e.target.style.borderColor = '#7c5cfc'}
              onBlur={e => e.target.style.borderColor = '#1e1d2e'}
            />
          </div>
          {error && (
            <div style={{ backgroundColor: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '8px', padding: '10px 14px' }}>
              <p style={{ color: '#f87171', fontSize: '13px' }}>{error}</p>
            </div>
          )}
          <button type="submit" disabled={loading} style={{
            background: 'linear-gradient(135deg, #7c5cfc, #6344e0)',
            color: '#fff', padding: '14px', borderRadius: '10px',
            fontWeight: 700, fontSize: '15px', border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
            boxShadow: '0 4px 24px rgba(124,92,252,0.35)', marginTop: '4px',
          }}>
            {loading ? 'Please wait...' : isLogin ? 'Sign In →' : 'Create Account →'}
          </button>
        </form>

        <p style={{ color: '#444', fontSize: '14px', marginTop: '24px' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setIsLogin(!isLogin)} style={{ color: '#f0a500', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '14px' }}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 80px', background: 'linear-gradient(135deg, #0c0b18, #0e0d1a)' }}>
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, fontFamily: 'Syne, sans-serif', marginBottom: '8px' }}>Everything you need to get hired</h3>
          <p style={{ color: '#444', fontSize: '14px' }}>Trusted by 2,400+ job seekers</p>
        </div>
        {[
          { icon: '⚡', title: 'AI Fit Scoring', desc: 'Know exactly how well you match any job before applying' },
          { icon: '✉️', title: 'Cover Letter Generator', desc: 'Tailored cover letters written by AI in seconds' },
          { icon: '🔍', title: 'Skill Gap Analysis', desc: 'See what skills you\'re missing and how to close the gap' },
          { icon: '📊', title: 'Application Tracker', desc: 'Track every application and never miss a follow-up' },
        ].map(f => (
          <div key={f.title} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(124,92,252,0.1)', border: '1px solid rgba(124,92,252,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
              {f.icon}
            </div>
            <div>
              <div style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 700, marginBottom: '3px' }}>{f.title}</div>
              <div style={{ color: '#444', fontSize: '13px', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
