import Link from 'next/link'

export default function JobCard({ job }) {
  return (
    <div className="bg-white border rounded-lg p-6 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
          <p className="text-gray-500 mt-1">{job.company_name}</p>
          <p className="text-gray-400 text-sm mt-1">{job.candidate_required_location}</p>
        </div>
        <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
          {job.job_type}
        </span>
      </div>
      <div className="mt-4 flex gap-4">
        <Link
          href={`/jobs/${job.id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          View & Score My Fit
        </Link>
        <a
          href={job.url}
          target="_blank"
          className="border px-4 py-2 rounded text-sm hover:bg-gray-50"
        >
          Apply Directly
        </a>
      </div>
    </div>
  )
}
