import { askGemini } from '@/lib/gemini'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const { resumeText, jobTitle, jobDescription } = await req.json()
  const prompt = `You are a career coach. Analyze the resume and job description below.

Return a JSON object with exactly this format:
{
  "missingSkills": ["skill1", "skill2"],
  "matchingSkills": ["skill1", "skill2"],
  "recommendations": ["recommendation1", "recommendation2"]
}

Resume:
${resumeText}

Job Title: ${jobTitle}
Job Description: ${jobDescription}

Return only valid JSON, no extra text.`

  const text = await askGemini(prompt)
  try {
    const json = JSON.parse(text.replace(/```json|```/g, '').trim())
    return NextResponse.json(json)
  } catch {
    return NextResponse.json({ missingSkills: [], matchingSkills: [], recommendations: [] })
  }
}
