'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const STATUS_META = {
  Saved:     { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)',  border: 'rgba(148,163,184,0.2)' },
  Applied:   { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',   border: 'rgba(96,165,250,0.2)' },
  Interview: { color: '#a78bfa', bg: 'rgba(167,139,250,0.1)',  border: 'rgba(167,139,250,0.2)' },
  Offer:     { color: '#34d399', bg: 'rgba(52,211,153,0.1)',   border: 'rgba(52,211,153,0.2)' },
  Rejected:  { color: '#f87171', bg: 'rgba(248,113,113,0.1)',  border: 'rgba(248,113,113,0.2)' },
}

export default function Dashboard() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchJobs() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      setUser(user)
      const { data } = await supabase.from('jobs').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      setJobs(data || [])
      setLoading(false)
    }
    fetchJobs()
  }, [])

  async function updateStatus(jobId, newStatus) {
    await supabase.from('jobs').update({ status: newStatus }).eq('id', jobId)
    setJobs(jobs.map(j => j.id === jobId ? { ...j, status: newStatus } : j))
  }

  const totalApplied  = jobs.filter(j => j.status === 'Applied').length
  const interviews    = jobs.filter(j => j.status === 'Interview').length
  const offers        = jobs.filter(j => j.status === 'Offer').length
  const rejected      = jobs.filter(j => j.status === 'Rejected').length
  const responses     = jobs.filter(j => ['Interview', 'Offer', 'Rejected'].includes(j.status)).length
  const offerRate     = totalApplied > 0 ? Math.round((offers / totalApplied) * 100) : 0
  const responseRate  = totalApplied > 0 ? Math.round((responses / totalApplied) * 100) : 0
  const avgFit        = jobs.length > 0 ? Math.round(jobs.reduce((s, j) => s + (j.fit_score || 0), 0) / jobs.length) : 0

  function fitBadge(score) {
    if (score >= 80) return { bg: 'rgba(52,211,153,0.1)', color: '#34d399', border: 'rgba(52,211,153,0.25)' }
    if (score >= 50) return { bg: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: 'rgba(251,191,36,0.25)' }
    return { bg: 'rgba(248,113,113,0.1)', color: '#f87171', border: 'rgba(248,113,113,0.25)' }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#555' }}>Loading...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0e0d1a' }}>
      {/* Page Header */}
      <div style={{ padding: '36px 40px 28px', borderBottom: '1px solid #1a1928', background: 'linear-gradient(180deg, rgba(124,92,252,0.04) 0%, transparent 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: '#555', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
              👋 Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}
            </p>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', fontFamily: 'Syne, sans-serif', marginBottom: '4px' }}>Job Tracker</h1>
            <p style={{ color: '#444', fontSize: '13px' }}>{jobs.length} application{jobs.length !== 1 ? 's' : ''} in your pipeline</p>
          </div>
          <Link href="/jobs" style={{
            background: 'linear-gradient(135deg, #f0a500, #e09000)',
            color: '#000', padding: '11px 22px', borderRadius: '10px',
            fontWeight: 700, fontSize: '13px', textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(240,165,0,0.25)',
          }}>
            + Browse & Add Jobs
          </Link>
        </div>
      </div>

      <div style={{ padding: '32px 40px' }}>
        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Total Saved',   value: jobs.length,    color: '#7c5cfc', icon: '📁' },
            { label: 'Applied',       value: totalApplied,   color: '#60a5fa', icon: '📤' },
            { label: 'Interviews',    value: interviews,     color: '#a78bfa', icon: '🎙️' },
            { label: 'Offers',        value: offers,         color: '#34d399', icon: '🎉' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'linear-gradient(135deg, #1a1830, #16152a)',
              border: '1px solid #1a1928', borderRadius: '14px', padding: '22px 20px',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${s.color}88, transparent)` }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '36px', fontWeight: 800, color: s.color, fontFamily: 'Syne, sans-serif', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ color: '#444', fontSize: '12px', fontWeight: 600, marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                </div>
                <span style={{ fontSize: '22px', opacity: 0.4 }}>{s.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Avg Fit Score', value: `${avgFit}%`,      color: '#fbbf24', desc: 'Across all saved jobs' },
            { label: 'Response Rate', value: `${responseRate}%`, color: '#34d399', desc: 'Applied → Response' },
            { label: 'Offer Rate',    value: `${offerRate}%`,    color: '#a78bfa', desc: 'Applied → Offer' },
          ].map(s => (
            <div key={s.label} style={{ background: 'linear-gradient(135deg, #1a1830, #16152a)', border: '1px solid #1a1928', borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: s.color, fontFamily: 'Syne, sans-serif', minWidth: '70px' }}>{s.value}</div>
              <div>
                <div style={{ color: '#ccc', fontSize: '14px', fontWeight: 600 }}>{s.label}</div>
                <div style={{ color: '#444', fontSize: '12px', marginTop: '2px' }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        {jobs.length === 0 ? (
          <div style={{ background: 'linear-gradient(135deg, #1a1830, #16152a)', border: '1px solid #1a1928', borderRadius: '16px', padding: '80px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
            <p style={{ color: '#fff', fontSize: '18px', fontWeight: 700, marginBottom: '8px', fontFamily: 'Syne, sans-serif' }}>Your tracker is empty</p>
            <p style={{ color: '#444', marginBottom: '28px', fontSize: '14px' }}>Browse jobs, score your fit, and save the ones you want to apply to</p>
            <Link href="/jobs" style={{ background: 'linear-gradient(135deg, #7c5cfc, #6344e0)', color: '#fff', padding: '12px 28px', borderRadius: '10px', fontWeight: 700, textDecoration: 'none', fontSize: '14px' }}>
              Browse Jobs →
            </Link>
          </div>
        ) : (
          <div style={{ background: 'linear-gradient(135deg, #1a1830, #16152a)', border: '1px solid #1a1928', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #1a1928', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ color: '#fff', fontSize: '15px', fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>All Applications</h2>
              <span style={{ color: '#444', fontSize: '13px' }}>{jobs.length} total</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1a1928' }}>
                  {['Job Title', 'Company', 'Fit Score', 'Status', 'Action'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 24px', color: '#333', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, i) => {
                  const fit = fitBadge(job.fit_score)
                  const st = STATUS_META[job.status] || STATUS_META.Saved
                  return (
                    <tr key={job.id}
                      style={{ borderBottom: i < jobs.length - 1 ? '1px solid #13121f' : 'none', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,92,252,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '16px 24px', color: '#e2e8f0', fontWeight: 600, fontSize: '14px', maxWidth: '220px' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.job_title}</div>
                      </td>
                      <td style={{ padding: '16px 24px', color: '#555', fontSize: '14px' }}>{job.company}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ backgroundColor: fit.bg, color: fit.color, border: `1px solid ${fit.border}`, padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 }}>
                          {job.fit_score}%
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <select value={job.status} onChange={e => updateStatus(job.id, e.target.value)} style={{
                          backgroundColor: st.bg, color: st.color, border: `1px solid ${st.border}`,
                          padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700,
                          cursor: 'pointer', outline: 'none',
                        }}>
                          {Object.keys(STATUS_META).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <a href={job.job_url} target="_blank" style={{
                          background: 'linear-gradient(135deg, #7c5cfc, #6344e0)',
                          color: '#fff', padding: '6px 16px', borderRadius: '8px',
                          fontWeight: 600, fontSize: '12px', textDecoration: 'none',
                        }}>
                          View ↗
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
