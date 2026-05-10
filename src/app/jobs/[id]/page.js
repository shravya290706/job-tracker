'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

const TABS = [
  { id: 'fit',    label: '⚡ Fit Score' },
  { id: 'skills', label: '🔍 Skill Gap' },
  { id: 'cover',  label: '✉️ Cover Letter' },
]

export default function JobDetailPage() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [resumeText, setResumeText] = useState('')
  const [activeTab, setActiveTab] = useState('fit')

  const [fitScore, setFitScore] = useState(null)
  const [explanation, setExplanation] = useState('')
  const [scoring, setScoring] = useState(false)

  const [skillGap, setSkillGap] = useState(null)
  const [analyzingSkills, setAnalyzingSkills] = useState(false)

  const [coverLetter, setCoverLetter] = useState('')
  const [generatingCover, setGeneratingCover] = useState(false)
  const [copied, setCopied] = useState(false)

  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function fetchJob() {
      const res = await fetch('/api/jobs')
      const jobs = await res.json()
      const found = jobs.find(j => String(j.id) === String(id))
      setJob(found)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('resume_text').eq('id', user.id).single()
        setResumeText(profile?.resume_text || '')
      }
      setLoading(false)
    }
    fetchJob()
  }, [id])

  async function scoreMyFit() {
    setScoring(true)
    const res = await fetch('/api/fit-score', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText, jobTitle: job.title, jobDescription: job.description })
    })
    const data = await res.json()
    setFitScore(data.score)
    setExplanation(data.explanation)
    setScoring(false)
  }

  async function analyzeSkillGap() {
    setAnalyzingSkills(true)
    const res = await fetch('/api/skill-gap', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText, jobTitle: job.title, jobDescription: job.description })
    })
    const data = await res.json()
    setSkillGap(data)
    setAnalyzingSkills(false)
  }

  async function generateCoverLetter() {
    setGeneratingCover(true)
    const res = await fetch('/api/cover-letter', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText, jobTitle: job.title, jobDescription: job.description, companyName: job.company_name })
    })
    const data = await res.json()
    setCoverLetter(data.coverLetter)
    setGeneratingCover(false)
  }

  async function saveJob() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { alert('You must be logged in'); return }
    const { error } = await supabase.from('jobs').insert({
      user_id: user.id, job_title: job.title, company: job.company_name,
      job_url: job.url, fit_score: fitScore || 0, status: 'Saved'
    })
    if (error) { alert('Error: ' + error.message); return }
    setSaved(true)
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(coverLetter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const scoreColor = fitScore >= 80 ? '#34d399' : fitScore >= 50 ? '#fbbf24' : '#f87171'
  const scoreGlow  = fitScore >= 80 ? 'rgba(52,211,153,0.3)' : fitScore >= 50 ? 'rgba(251,191,36,0.3)' : 'rgba(248,113,113,0.3)'

  const card = { background: 'linear-gradient(135deg, #1a1830, #16152a)', border: '1px solid #1e1d2e', borderRadius: '16px', padding: '32px', marginBottom: '20px' }
  const primaryBtn = (loading) => ({
    background: loading ? '#2a2840' : 'linear-gradient(135deg, #7c5cfc, #6344e0)',
    color: '#fff', padding: '12px 28px', borderRadius: '10px',
    fontWeight: 700, fontSize: '14px', border: 'none',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.6 : 1,
    boxShadow: loading ? 'none' : '0 4px 20px rgba(124,92,252,0.3)',
  })

  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0e0d1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888' }}>Loading job...</p>
    </div>
  )
  if (!job) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0e0d1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888' }}>Job not found.</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0e0d1a' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #1e1d2e', padding: '32px 48px 28px', background: 'linear-gradient(180deg, rgba(124,92,252,0.05) 0%, transparent 100%)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#fff', fontFamily: 'Syne, sans-serif', marginBottom: '6px' }}>{job.title}</h1>
              <p style={{ color: '#7c5cfc', fontWeight: 600, fontSize: '15px' }}>{job.company_name}</p>
              <p style={{ color: '#555', fontSize: '13px', marginTop: '4px' }}>📍 {job.candidate_required_location || 'Remote'}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
              <button onClick={saveJob} disabled={saved} style={{
                backgroundColor: saved ? 'rgba(52,211,153,0.15)' : '#1a1830',
                color: saved ? '#34d399' : '#888',
                border: `1px solid ${saved ? 'rgba(52,211,153,0.3)' : '#1e1d2e'}`,
                padding: '10px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: saved ? 'default' : 'pointer',
              }}>
                {saved ? '✓ Saved' : 'Save to Tracker'}
              </button>
              <a href={job.url} target="_blank" style={{
                border: '1px solid #1e1d2e', color: '#888', padding: '10px 20px',
                borderRadius: '10px', fontWeight: 700, fontSize: '13px', textDecoration: 'none',
              }}>
                Apply ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '36px 48px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', background: '#1a1830', padding: '6px', borderRadius: '12px', border: '1px solid #1e1d2e' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, padding: '10px 16px', borderRadius: '8px', border: 'none',
              cursor: 'pointer', fontWeight: 700, fontSize: '13px',
              background: activeTab === tab.id ? 'linear-gradient(135deg, #7c5cfc, #6344e0)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : '#666',
              boxShadow: activeTab === tab.id ? '0 2px 12px rgba(124,92,252,0.3)' : 'none',
              transition: 'all 0.2s',
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Fit Score Tab */}
        {activeTab === 'fit' && (
          <div style={card}>
            <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 800, marginBottom: '16px', fontFamily: 'Syne, sans-serif' }}>AI Fit Score</h2>
            {!fitScore ? (
              <div>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px', lineHeight: 1.6 }}>
                  Get an AI-powered score showing how well your resume matches this job description.
                </p>
                <button onClick={scoreMyFit} disabled={scoring} style={primaryBtn(scoring)}>
                  {scoring ? 'Analysing...' : '⚡ Score My Fit'}
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '64px', fontWeight: 800, color: scoreColor, fontFamily: 'Syne, sans-serif', lineHeight: 1, textShadow: `0 0 40px ${scoreGlow}` }}>{fitScore}%</div>
                  <div>
                    <div style={{ color: scoreColor, fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
                      {fitScore >= 80 ? 'Excellent Match' : fitScore >= 50 ? 'Good Match' : 'Weak Match'}
                    </div>
                    <div style={{ color: '#555', fontSize: '13px' }}>Based on your resume</div>
                  </div>
                </div>
                <div style={{ backgroundColor: '#0e0d1a', borderRadius: '10px', padding: '20px', border: '1px solid #1e1d2e' }}>
                  <p style={{ color: '#ccc', lineHeight: 1.8, fontSize: '14px', whiteSpace: 'pre-line' }}>{explanation}</p>
                </div>
                <button onClick={scoreMyFit} disabled={scoring} style={{ ...primaryBtn(scoring), marginTop: '16px', padding: '8px 20px', fontSize: '13px' }}>
                  Re-score
                </button>
              </div>
            )}
          </div>
        )}

        {/* Skill Gap Tab */}
        {activeTab === 'skills' && (
          <div style={card}>
            <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 800, marginBottom: '16px', fontFamily: 'Syne, sans-serif' }}>Skill Gap Analysis</h2>
            {!skillGap ? (
              <div>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px', lineHeight: 1.6 }}>
                  See exactly which skills you have and which you're missing for this role.
                </p>
                <button onClick={analyzeSkillGap} disabled={analyzingSkills} style={primaryBtn(analyzingSkills)}>
                  {analyzingSkills ? 'Analyzing...' : '🔍 Analyze Skill Gap'}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <div>
                  <h3 style={{ color: '#34d399', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>✅ You Have These</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {skillGap.matchingSkills.map(s => (
                      <span key={s} style={{ backgroundColor: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)', padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: 600 }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 style={{ color: '#f87171', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>❌ You're Missing These</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {skillGap.missingSkills.map(s => (
                      <span key={s} style={{ backgroundColor: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)', padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: 600 }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 style={{ color: '#fbbf24', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>💡 Recommendations</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {skillGap.recommendations.map((r, i) => (
                      <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <span style={{ color: '#fbbf24', fontWeight: 800, fontSize: '14px', flexShrink: 0 }}>{i + 1}.</span>
                        <p style={{ color: '#ccc', fontSize: '14px', lineHeight: 1.6 }}>{r}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cover Letter Tab */}
        {activeTab === 'cover' && (
          <div style={card}>
            <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 800, marginBottom: '16px', fontFamily: 'Syne, sans-serif' }}>Cover Letter Generator</h2>
            {!coverLetter ? (
              <div>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px', lineHeight: 1.6 }}>
                  AI will write a tailored, professional cover letter based on your resume and this job.
                </p>
                <button onClick={generateCoverLetter} disabled={generatingCover} style={primaryBtn(generatingCover)}>
                  {generatingCover ? 'Writing your cover letter...' : '✉️ Generate Cover Letter'}
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', justifyContent: 'flex-end' }}>
                  <button onClick={copyToClipboard} style={{
                    backgroundColor: copied ? 'rgba(52,211,153,0.15)' : '#2a2840',
                    color: copied ? '#34d399' : '#aaa',
                    border: `1px solid ${copied ? 'rgba(52,211,153,0.3)' : '#1e1d2e'}`,
                    padding: '8px 18px', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer',
                  }}>
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                  <button onClick={generateCoverLetter} disabled={generatingCover} style={{ backgroundColor: '#2a2840', color: '#aaa', border: '1px solid #1e1d2e', padding: '8px 18px', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                    Regenerate
                  </button>
                </div>
                <div style={{ backgroundColor: '#0e0d1a', borderRadius: '10px', padding: '24px', border: '1px solid #1e1d2e' }}>
                  <p style={{ color: '#ccc', lineHeight: 1.9, whiteSpace: 'pre-line', fontSize: '14px' }}>{coverLetter}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Job Description */}
        <div style={card}>
          <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 800, marginBottom: '20px', fontFamily: 'Syne, sans-serif' }}>Job Description</h2>
          <div style={{ color: '#888', lineHeight: 1.8, fontSize: '14px' }} dangerouslySetInnerHTML={{ __html: job.description }} />
        </div>
      </div>
    </div>
  )
}
