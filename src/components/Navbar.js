import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white border-b px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-blue-600">
        AI Career Copilot
      </Link>
      <div className="flex gap-6">
        <Link href="/jobs" className="text-gray-600 hover:text-blue-600">Jobs</Link>
        <Link href="/resume" className="text-gray-600 hover:text-blue-600">Resume</Link>
        <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
      </div>
    </nav>
  )
}
