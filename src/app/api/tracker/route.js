import { supabase } from '@/lib/supabaseClient'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  const { data } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return Response.json(data)
}

export async function POST(request) {
  const body = await request.json()

  const { data, error } = await supabase
    .from('jobs')
    .insert(body)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function PATCH(request) {
  const { id, status } = await request.json()

  const { data, error } = await supabase
    .from('jobs')
    .update({ status })
    .eq('id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}
