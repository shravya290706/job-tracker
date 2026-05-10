'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function ResumePage() {
  const [resumeText, setResumeText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth'); return }
    const res = await fetch('/api/resume', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText, userId: user.id })
    })
    const data = await res.json()
    setResult(data.extracted)
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0e0d1a', paddingLeft: '240px' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #1e1d2e', padding: '32px 48px 28px', background: 'linear-gradient(180deg, rgba(124,92,252,0.05) 0%, transparent 100%)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', fontFamily: 'Syne, sans-serif', marginBottom: '4px' }}>My Resume</h1>
          <p style={{ color: '#666', fontSize: '14px' }}>Paste your resume and AI will extract your skills and experience</p>
        </div>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '36px 48px' }}>
        {/* Form Card */}
        <div style={{ background: 'linear-gradient(135deg, #1a1830, #16152a)', border: '1px solid #1e1d2e', borderRadius: '16px', padding: '32px', marginBottom: '24px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ color: '#888', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '10px' }}>
                Resume Text
              </label>
              <textarea
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                placeholder="Paste your full resume here — work experience, skills, education, projects..."
                rows={14} required
                style={{
                  width: '100%', padding: '16px', borderRadius: '10px',
                  border: '1px solid #1e1d2e', backgroundColor: '#0e0d1a',
                  color: '#e2e8f0', fontSize: '14px', resize: 'vertical',
                  outline: 'none', lineHeight: 1.7,
                }}
                onFocus={e => e.target.style.borderColor = '#7c5cfc'}
                onBlur={e => e.target.style.borderColor = '#1e1d2e'}
              />
            </div>
            <button type="submit" disabled={loading} style={{
              background: loading ? '#2a2840' : 'linear-gradient(135deg, #7c5cfc, #6344e0)',
              color: '#fff', padding: '14px', borderRadius: '10px',
              fontWeight: 700, fontSize: '15px', border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(124,92,252,0.35)',
              transition: 'all 0.2s',
            }}>
              {loading ? '🤖 Analysing your resume...' : '🤖 Analyse My Resume'}
            </button>
          </form>
        </div>

        {/* Result */}
        {result && (
          <div style={{ background: 'linear-gradient(135deg, #0d1f14, #0e1a12)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: '16px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #34d399, transparent)' }} />
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#34d399', marginBottom: '16px', fontFamily: 'Syne, sans-serif' }}>
              ✅ Profile Extracted
            </h2>
            <p style={{ color: '#a7f3d0', whiteSpace: 'pre-line', lineHeight: 1.8, fontSize: '14px' }}>{result}</p>
            <button onClick={() => router.push('/jobs')} style={{
              marginTop: '24px', background: 'linear-gradient(135deg, #f0a500, #e09000)',
              color: '#000', padding: '12px 28px', borderRadius: '10px',
              fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(240,165,0,0.3)',
            }}>
              Browse Matching Jobs →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
