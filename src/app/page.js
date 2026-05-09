import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">AI Career Copilot</h1>
      <p className="text-gray-600 mb-8">Track your job applications with AI-powered fit scoring</p>
      <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
        Go to Dashboard
      </Link>
    </main>
  )
}
