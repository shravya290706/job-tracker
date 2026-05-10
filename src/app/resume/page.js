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
    if (!user) {
      router.push('/auth')
      return
    }

    const res = await fetch('/api/resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText, userId: user.id })
    })

    const data = await res.json()
    setResult(data.extracted)
    setLoading(false)
  }

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">My Resume</h1>
      <p className="text-gray-500 mb-6">Paste your resume below and AI will extract your skills and experience.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your resume text here..."
          rows={12}
          className="border rounded px-4 py-3 resize-none"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Analysing...' : 'Analyse My Resume'}
        </button>
      </form>

      {result && (
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Extracted Profile</h2>
          <p className="text-gray-700 whitespace-pre-line">{result}</p>
          <button
            onClick={() => router.push('/jobs')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Browse Matching Jobs
          </button>
        </div>
      )}
    </main>
  )
}
