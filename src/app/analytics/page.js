'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

const STATUSES = ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected']
const STATUS_COLORS = { Saved: '#94a3b8', Applied: '#60a5fa', Interview: '#a78bfa', Offer: '#34d399', Rejected: '#f87171' }

export default function AnalyticsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchJobs() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      const { data } = await supabase.from('jobs').select('*').eq('user_id', user.id)
      setJobs(data || [])
      setLoading(false)
    }
    fetchJobs()
  }, [])

  const total = jobs.length
  const avgFitScore = total > 0 ? Math.round(jobs.reduce((sum, j) => sum + (j.fit_score || 0), 0) / total) : 0
  const statusCounts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: jobs.filter(j => j.status === s).length }), {})
  const maxCount = Math.max(...Object.values(statusCounts), 1)

  const fitBuckets = [
    { label: '80–100%', count: jobs.filter(j => j.fit_score >= 80).length, color: '#34d399', glow: 'rgba(52,211,153,0.4)' },
    { label: '50–79%', count: jobs.filter(j => j.fit_score >= 50 && j.fit_score < 80).length, color: '#fbbf24', glow: 'rgba(251,191,36,0.4)' },
    { label: '0–49%', count: jobs.filter(j => j.fit_score < 50).length, color: '#f87171', glow: 'rgba(248,113,113,0.4)' },
  ]
  const maxFitCount = Math.max(...fitBuckets.map(b => b.count), 1)

  const topCompanies = Object.entries(
    jobs.reduce((acc, j) => { acc[j.company] = (acc[j.company] || 0) + 1; return acc }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 5)

  const card = {
    background: 'linear-gradient(135deg, #1a1830 0%, #16152a 100%)',
    border: '1px solid #1e1d2e', borderRadius: '16px', padding: '28px',
  }

  const topStats = [
    { label: 'Total Tracked', value: total,           color: '#7c5cfc', glow: 'rgba(124,92,252,0.25)' },
    { label: 'Avg Fit Score', value: `${avgFitScore}%`, color: '#f0a500', glow: 'rgba(240,165,0,0.25)' },
    { label: 'Interviews',    value: statusCounts['Interview'], color: '#a78bfa', glow: 'rgba(167,139,250,0.25)' },
    { label: 'Offers',        value: statusCounts['Offer'],     color: '#34d399', glow: 'rgba(52,211,153,0.25)' },
  ]

  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0e0d1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888' }}>Loading analytics...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0e0d1a', paddingLeft: '240px' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #1e1d2e', padding: '32px 48px 28px', background: 'linear-gradient(180deg, rgba(124,92,252,0.05) 0%, transparent 100%)' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', fontFamily: 'Syne, sans-serif', marginBottom: '4px' }}>Analytics</h1>
          <p style={{ color: '#666', fontSize: '14px' }}>Your job search performance at a glance</p>
        </div>
      </div>

      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '36px 48px' }}>
        {/* Top Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' }}>
          {topStats.map(s => (
            <div key={s.label} style={{ ...card, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${s.color}, transparent)` }} />
              <div style={{ fontSize: '44px', fontWeight: 800, color: s.color, fontFamily: 'Syne, sans-serif', lineHeight: 1, marginBottom: '10px', textShadow: `0 0 40px ${s.glow}` }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: '#666', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>

          {/* Status Bar Chart */}
          <div style={card}>
            <h2 style={{ color: '#fff', fontSize: '16px', fontWeight: 700, marginBottom: '24px', fontFamily: 'Syne, sans-serif' }}>Applications by Status</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {STATUSES.map(status => {
                const pct = Math.round((statusCounts[status] / maxCount) * 100)
                return (
                  <div key={status}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: STATUS_COLORS[status], fontSize: '13px', fontWeight: 700 }}>{status}</span>
                      <span style={{ color: '#555', fontSize: '13px', fontWeight: 600 }}>{statusCounts[status]}</span>
                    </div>
                    <div style={{ backgroundColor: '#0e0d1a', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: '999px', width: `${pct}%`,
                        background: `linear-gradient(90deg, ${STATUS_COLORS[status]}, ${STATUS_COLORS[status]}88)`,
                        boxShadow: `0 0 10px ${STATUS_COLORS[status]}66`,
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Fit Score Bars */}
          <div style={card}>
            <h2 style={{ color: '#fff', fontSize: '16px', fontWeight: 700, marginBottom: '24px', fontFamily: 'Syne, sans-serif' }}>Fit Score Distribution</h2>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', height: '160px' }}>
              {fitBuckets.map(b => (
                <div key={b.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ color: b.color, fontSize: '18px', fontWeight: 800, fontFamily: 'Syne, sans-serif' }}>{b.count}</span>
                  <div style={{
                    width: '100%', borderRadius: '8px 8px 0 0',
                    height: `${Math.max((b.count / maxFitCount) * 120, b.count > 0 ? 8 : 0)}px`,
                    background: `linear-gradient(180deg, ${b.color}, ${b.color}88)`,
                    boxShadow: `0 -4px 20px ${b.glow}`,
                    transition: 'height 0.6s ease',
                  }} />
                  <span style={{ color: '#666', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

          {/* Top Companies */}
          <div style={card}>
            <h2 style={{ color: '#fff', fontSize: '16px', fontWeight: 700, marginBottom: '20px', fontFamily: 'Syne, sans-serif' }}>Top Companies</h2>
            {topCompanies.length === 0 ? (
              <p style={{ color: '#555', fontSize: '14px' }}>No data yet — save some jobs first</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {topCompanies.map(([company, count], i) => (
                  <div key={company} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ color: '#333', fontSize: '12px', fontWeight: 700, width: '20px' }}>#{i + 1}</span>
                      <span style={{ color: '#ccc', fontSize: '14px', fontWeight: 600 }}>{company}</span>
                    </div>
                    <span style={{ backgroundColor: 'rgba(124,92,252,0.15)', color: '#a78bfa', border: '1px solid rgba(124,92,252,0.25)', padding: '3px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 }}>
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Applications */}
          <div style={card}>
            <h2 style={{ color: '#fff', fontSize: '16px', fontWeight: 700, marginBottom: '20px', fontFamily: 'Syne, sans-serif' }}>Recent Applications</h2>
            {jobs.length === 0 ? (
              <p style={{ color: '#555', fontSize: '14px' }}>No applications yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {jobs.slice(0, 5).map(job => {
                  const c = STATUS_COLORS[job.status] || '#888'
                  return (
                    <div key={job.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 600 }}>{job.job_title}</div>
                        <div style={{ color: '#555', fontSize: '12px', marginTop: '2px' }}>{job.company}</div>
                      </div>
                      <span style={{ backgroundColor: `${c}18`, color: c, border: `1px solid ${c}44`, padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700 }}>
                        {job.status}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
