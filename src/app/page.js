'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) router.push('/dashboard')
    }
    checkUser()
  }, [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0e0d1a', marginLeft: '-240px' }}>

      {/* Top Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 60px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(14,13,26,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #1a1928' }}>
        <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', fontFamily: 'Syne, sans-serif' }}>
          Career<span style={{ color: '#7c5cfc' }}>Copilot</span>
        </div>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {['Features', 'How it works', 'Pricing'].map(l => (
            <span key={l} style={{ color: '#555', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/auth" style={{ color: '#888', fontSize: '14px', fontWeight: 600, padding: '9px 20px', borderRadius: '8px', border: '1px solid #1e1d2e', textDecoration: 'none' }}>Sign In</Link>
          <Link href="/auth" style={{ background: 'linear-gradient(135deg, #7c5cfc, #6344e0)', color: '#fff', fontSize: '14px', fontWeight: 700, padding: '9px 20px', borderRadius: '8px', textDecoration: 'none', boxShadow: '0 4px 20px rgba(124,92,252,0.3)' }}>Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ paddingTop: '140px', paddingBottom: '100px', paddingLeft: '60px', paddingRight: '60px', textAlign: 'center', backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,92,252,0.2) 0%, transparent 60%)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(124,92,252,0.1)', border: '1px solid rgba(124,92,252,0.25)', borderRadius: '999px', padding: '6px 16px', marginBottom: '28px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#7c5cfc', display: 'inline-block' }} />
          <span style={{ color: '#a78bfa', fontSize: '13px', fontWeight: 600 }}>AI-Powered Job Search — Now in Beta</span>
        </div>
        <h1 style={{ fontSize: '72px', fontWeight: 800, color: '#fff', fontFamily: 'Syne, sans-serif', lineHeight: 1.05, marginBottom: '24px', letterSpacing: '-2px' }}>
          Land your dream job<br />
          <span style={{ background: 'linear-gradient(135deg, #7c5cfc, #f0a500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>10x faster with AI</span>
        </h1>
        <p style={{ fontSize: '20px', color: '#555', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.7 }}>
          Upload your resume, get AI fit scores for thousands of jobs, generate cover letters, and track every application — all in one place.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginBottom: '60px' }}>
          <Link href="/auth" style={{ background: 'linear-gradient(135deg, #7c5cfc, #6344e0)', color: '#fff', padding: '16px 36px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', textDecoration: 'none', boxShadow: '0 8px 32px rgba(124,92,252,0.4)' }}>
            Start for Free →
          </Link>
          <Link href="/auth" style={{ backgroundColor: '#1a1830', color: '#aaa', padding: '16px 36px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', textDecoration: 'none', border: '1px solid #1e1d2e' }}>
            See Demo
          </Link>
        </div>
        {/* Social proof */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#444', fontSize: '13px' }}>
          <div style={{ display: 'flex' }}>
            {['#7c5cfc','#f0a500','#34d399','#60a5fa'].map((c, i) => (
              <div key={i} style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: c, border: '2px solid #0e0d1a', marginLeft: i > 0 ? '-8px' : '0' }} />
            ))}
          </div>
          <span>Trusted by <strong style={{ color: '#666' }}>2,400+</strong> job seekers</span>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ borderTop: '1px solid #1a1928', borderBottom: '1px solid #1a1928', backgroundColor: '#0c0b18', padding: '32px 60px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0', textAlign: 'center' }}>
          {[
            { value: '50K+', label: 'Live Job Listings', color: '#7c5cfc' },
            { value: '95%',  label: 'Match Accuracy',   color: '#f0a500' },
            { value: '3min', label: 'Avg Time to Score', color: '#34d399' },
            { value: '10K+', label: 'Cover Letters Generated', color: '#60a5fa' },
          ].map((s, i) => (
            <div key={s.label} style={{ padding: '0 24px', borderRight: i < 3 ? '1px solid #1a1928' : 'none' }}>
              <div style={{ fontSize: '36px', fontWeight: 800, color: s.color, fontFamily: 'Syne, sans-serif', marginBottom: '6px' }}>{s.value}</div>
              <div style={{ color: '#444', fontSize: '13px', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: '100px 60px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: '48px', fontWeight: 800, color: '#fff', fontFamily: 'Syne, sans-serif', marginBottom: '16px', letterSpacing: '-1px' }}>
            Everything you need to<br />get hired faster
          </h2>
          <p style={{ color: '#555', fontSize: '18px' }}>One platform. All the AI tools your job search needs.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {[
            { icon: '⚡', title: 'AI Fit Scoring', desc: 'Instantly know how well you match any job. Our AI compares your resume against job descriptions and gives you a precise match score with detailed feedback.', color: '#7c5cfc', glow: 'rgba(124,92,252,0.15)' },
            { icon: '🔍', title: 'Skill Gap Analysis', desc: 'See exactly which skills you have and which you\'re missing. Get actionable recommendations to close the gap and become a stronger candidate.', color: '#f0a500', glow: 'rgba(240,165,0,0.15)' },
            { icon: '✉️', title: 'Cover Letter AI', desc: 'Generate tailored, professional cover letters in seconds. Each letter is uniquely crafted for the specific job and company — no generic templates.', color: '#34d399', glow: 'rgba(52,211,153,0.15)' },
            { icon: '📊', title: 'Application Tracker', desc: 'Track every application in one place. Update statuses, monitor your pipeline, and never lose track of where you stand with each company.', color: '#60a5fa', glow: 'rgba(96,165,250,0.15)' },
            { icon: '📈', title: 'Analytics Dashboard', desc: 'Visualize your job search performance. See your response rates, offer rates, and fit score trends to optimize your strategy over time.', color: '#a78bfa', glow: 'rgba(167,139,250,0.15)' },
            { icon: '📄', title: 'Resume Intelligence', desc: 'Upload your resume once and let AI extract your skills, experience, and strengths. Your profile powers all AI features across the platform.', color: '#fb923c', glow: 'rgba(251,146,60,0.15)' },
          ].map(f => (
            <div key={f.title} style={{
              background: 'linear-gradient(135deg, #1a1830, #16152a)',
              border: '1px solid #1e1d2e', borderRadius: '16px', padding: '32px',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = f.color + '44'; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1d2e'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: f.glow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '20px', border: `1px solid ${f.color}33` }}>
                {f.icon}
              </div>
              <h3 style={{ color: '#fff', fontSize: '17px', fontWeight: 700, marginBottom: '10px', fontFamily: 'Syne, sans-serif' }}>{f.title}</h3>
              <p style={{ color: '#555', fontSize: '14px', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ margin: '0 60px 100px', borderRadius: '24px', background: 'linear-gradient(135deg, #1a1830, #16152a)', border: '1px solid #1e1d2e', padding: '80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', width: '400px', height: '200px', background: 'radial-gradient(ellipse, rgba(124,92,252,0.2), transparent)', pointerEvents: 'none' }} />
        <h2 style={{ fontSize: '48px', fontWeight: 800, color: '#fff', fontFamily: 'Syne, sans-serif', marginBottom: '16px', letterSpacing: '-1px' }}>
          Ready to get hired?
        </h2>
        <p style={{ color: '#555', fontSize: '18px', marginBottom: '36px' }}>Join thousands of job seekers using AI to land their dream role.</p>
        <Link href="/auth" style={{ background: 'linear-gradient(135deg, #7c5cfc, #6344e0)', color: '#fff', padding: '16px 40px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', textDecoration: 'none', boxShadow: '0 8px 32px rgba(124,92,252,0.4)' }}>
          Start for Free — No Credit Card
        </Link>
      </div>
    </div>
  )
}
