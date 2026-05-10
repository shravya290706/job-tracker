import { askGemini } from '@/lib/gemini'

export async function POST(request) {
  const { resumeText, jobTitle, jobDescription } = await request.json()

  const prompt = `
You are a career coach. Given the resume and job description below, score how well the candidate fits the job.

Resume:
${resumeText}

Job Title: ${jobTitle}
Job Description: ${jobDescription}

Respond in this exact format:
SCORE: [number between 0 and 100]
EXPLANATION: [3-4 sentences explaining the score, what matches well, and what is missing]
`

  const response = await askGemini(prompt)

  const scoreMatch = response.match(/SCORE:\s*(\d+)/)
  const explanationMatch = response.match(/EXPLANATION:\s*([\s\S]+)/)

  const score = scoreMatch ? parseInt(scoreMatch[1]) : 0
  const explanation = explanationMatch ? explanationMatch[1].trim() : response

  return Response.json({ score, explanation })
}
