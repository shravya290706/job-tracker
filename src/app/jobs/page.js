'use client'

import { useEffect, useState } from 'react'
import JobCard from '@/components/JobCard'

export default function JobsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchJobs() {
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

  if (loading) return <p className="p-8">Loading jobs...</p>

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Live Job Listings</h1>
      <input
        type="text"
        placeholder="Search by title or company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded px-4 py-2 w-full mb-6"
      />
      <div className="flex flex-col gap-4">
        {filtered.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </main>
  )
}
