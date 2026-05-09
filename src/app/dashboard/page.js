'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchJobs() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }
      const { data } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setJobs(data || [])
      setLoading(false)
    }
    fetchJobs()
  }, [])

  async function updateStatus(jobId, newStatus) {
    await supabase.from('jobs').update({ status: newStatus }).eq('id', jobId)
    setJobs(jobs.map(job => job.id === jobId ? { ...job, status: newStatus } : job))
  }

  if (loading) return <p className="p-8">Loading...</p>

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">My Job Tracker</h1>
      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs saved yet. <a href="/jobs" className="text-blue-600">Browse jobs</a></p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Job Title</th>
              <th className="p-3 border">Company</th>
              <th className="p-3 border">Fit Score</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Link</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="p-3 border">{job.job_title}</td>
                <td className="p-3 border">{job.company}</td>
                <td className="p-3 border font-bold text-blue-600">{job.fit_score}%</td>
                <td className="p-3 border">
                  <select
                    value={job.status}
                    onChange={(e) => updateStatus(job.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option>Saved</option>
                    <option>Applied</option>
                    <option>Interview</option>
                    <option>Offer</option>
                    <option>Rejected</option>
                  </select>
                </td>
                <td className="p-3 border">
                  <a href={job.job_url} target="_blank" className="text-blue-600 hover:underline">View</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
