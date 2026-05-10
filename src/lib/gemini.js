import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function askGemini(prompt) {
  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
    })
    return response.choices[0].message.content
  } catch (error) {
    console.error('Groq error:', error.message)
    throw new Error(error.message)
  }
}
