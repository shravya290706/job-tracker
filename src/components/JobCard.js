import Link from 'next/link'

export default function JobCard({ job }) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1a1830 0%, #16152a 100%)',
        border: '1px solid #1e1d2e', borderRadius: '14px', padding: '24px',
        transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(124,92,252,0.4)'
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(124,92,252,0.1)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#1e1d2e'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#e2e8f0', marginBottom: '6px', fontFamily: 'Syne, sans-serif' }}>{job.title}</h2>
          <p style={{ color: '#7c5cfc', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{job.company_name}</p>
          <p style={{ color: '#555', fontSize: '13px' }}>📍 {job.candidate_required_location || 'Remote'}</p>
        </div>
        {job.job_type && (
          <span style={{
            backgroundColor: 'rgba(124,92,252,0.12)', color: '#a78bfa',
            border: '1px solid rgba(124,92,252,0.25)',
            fontSize: '11px', padding: '4px 12px', borderRadius: '999px', fontWeight: 700,
            whiteSpace: 'nowrap', marginLeft: '12px',
          }}>
            {job.job_type}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Link href={`/jobs/${job.id}`} style={{
          background: 'linear-gradient(135deg, #7c5cfc, #6344e0)',
          color: '#fff', padding: '9px 20px', borderRadius: '8px',
          fontWeight: 700, fontSize: '13px', textDecoration: 'none',
          boxShadow: '0 2px 12px rgba(124,92,252,0.3)',
        }}>
          View & Score Fit
        </Link>
        <a href={job.url} target="_blank" style={{
          border: '1px solid #1e1d2e', color: '#888', padding: '9px 20px',
          borderRadius: '8px', fontWeight: 600, fontSize: '13px', textDecoration: 'none',
        }}>
          Apply ↗
        </a>
      </div>
    </div>
  )
}
