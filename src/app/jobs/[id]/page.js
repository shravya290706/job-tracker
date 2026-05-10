'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function JobDetailPage() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [fitScore, setFitScore] = useState(null)
  const [explanation, setExplanation] = useState('')
  const [loading, setLoading] = useState(true)
  const [scoring, setScoring] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function fetchJob() {
      const res = await fetch('/api/jobs')
      const jobs = await res.json()
      const found = jobs.find(j => String(j.id) === String(id))
      setJob(found)
      setLoading(false)
    }
    fetchJob()
  }, [id])

  async function scoreMyFit() {
    setScoring(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase
      .from('profiles')
      .select('resume_text')
      .eq('id', user.id)
      .single()

    const res = await fetch('/api/fit-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resumeText: profile?.resume_text || '',
        jobTitle: job.title,
        jobDescription: job.description
      })
    })
    const data = await res.json()
    setFitScore(data.score)
    setExplanation(data.explanation)
    setScoring(false)
  }

  async function saveJob() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('You must be logged in to save jobs')
      return
    }
    const { error } = await supabase.from('jobs').insert({
      user_id: user.id,
      job_title: job.title,
      company: job.company_name,
      job_url: job.url,
      fit_score: fitScore || 0,
      status: 'Saved'
    })
    if (error) {
      alert('Error saving job: ' + error.message)
      return
    }
    setSaved(true)
  }

  if (loading) return <p className="p-8">Loading...</p>
  if (!job) return <p className="p-8">Job not found.</p>

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
      <p className="text-gray-500 mb-6">{job.company_name} — {job.candidate_required_location}</p>

      {fitScore && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <p className="text-4xl font-bold text-blue-600 mb-2">{fitScore}% Match</p>
          <p className="text-gray-700 whitespace-pre-line">{explanation}</p>
        </div>
      )}

      <div className="flex gap-4 mb-8">
        <button
          onClick={scoreMyFit}
          disabled={scoring}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {scoring ? 'Scoring...' : 'Score My Fit'}
        </button>
        <button
          onClick={saveJob}
          disabled={saved}
          className="border px-6 py-2 rounded hover:bg-gray-50 disabled:opacity-50"
        >
          {saved ? 'Saved!' : 'Save to Tracker'}
        </button>
        <a href={job.url} target="_blank" className="border px-6 py-2 rounded hover:bg-gray-50">
          Apply Directly
        </a>
      </div>

      <div
        className="prose max-w-none text-gray-700"
        dangerouslySetInnerHTML={{ __html: job.description }}
      />
    </main>
  )
}
