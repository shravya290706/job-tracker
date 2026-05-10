import { askGemini } from '@/lib/gemini'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request) {
  try {
    const { resumeText, userId } = await request.json()
    const prompt = `
You are a resume parser. Extract the following from this resume:

Resume:
${resumeText}

Respond in this exact format:
SKILLS: [comma separated list of skills]
EXPERIENCE: [brief summary of experience in 2-3 sentences]
TARGET_ROLE: [the most suitable job title for this person]
`
    const response = await askGemini(prompt)

    await supabase.from('profiles').upsert({
      id: userId,
      resume_text: resumeText,
      extracted_skills: response,
      updated_at: new Date()
    })

    return Response.json({ success: true, extracted: response })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
