'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import JobCard from '@/components/JobCard'

export default function JobsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function fetchJobs() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      const res = await fetch('/api/jobs')
      const data = await res.json()
      setJobs(data)
      setLoading(false)
    }
    fetchJobs()
  }, [])

  const filtered = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company_name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0e0d1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888' }}>Loading jobs...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0e0d1a' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #1e1d2e', padding: '32px 48px 28px', background: 'linear-gradient(180deg, rgba(124,92,252,0.05) 0%, transparent 100%)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', fontFamily: 'Syne, sans-serif', marginBottom: '4px' }}>Live Job Listings</h1>
          <p style={{ color: '#666', fontSize: '14px' }}>{filtered.length} remote jobs available</p>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '36px 48px' }}>
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '32px' }}>
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#555', fontSize: '16px' }}>🔍</span>
          <input
            type="text"
            placeholder="Search by title or company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '14px 16px 14px 44px',
              borderRadius: '12px', border: '1px solid #1e1d2e',
              backgroundColor: '#1a1830', color: '#fff', fontSize: '15px', outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = '#7c5cfc'}
            onBlur={e => e.target.style.borderColor = '#1e1d2e'}
          />
        </div>

        {/* Job Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.map(job => <JobCard key={job.id} job={job} />)}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#555' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
            <p style={{ fontSize: '16px', fontWeight: 600 }}>No jobs found for "{search}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
