import { askGemini } from '@/lib/gemini'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const { resumeText, jobTitle, jobDescription, companyName } = await req.json()
  const prompt = `Write a professional, personalized cover letter for the following job application.

Candidate Resume:
${resumeText}

Job Title: ${jobTitle}
Company: ${companyName}
Job Description: ${jobDescription}

Write a compelling 3-paragraph cover letter. Be specific, confident, and tailored. Do not use generic filler phrases. Return only the cover letter text, no subject line or extra commentary.`

  const text = await askGemini(prompt)
  return NextResponse.json({ coverLetter: text })
}
