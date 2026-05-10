export async function GET() {
  const res = await fetch('https://remotive.com/api/remote-jobs?limit=20')
  const data = await res.json()
  return Response.json(data.jobs)
}
