import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { products } from '@/data/products'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API Key')
}

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(config)

export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const { messages } = json
    
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid messages format' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: "system",
          content: `Eres un asistente amable para un mercado mexicano local.

Para mostrar productos usa EXACTAMENTE este formato:
<products>verduras</products>
<products>frutas</products>
<products>hierbas</products>
<products>lacteos</products>

Para mostrar el carrito usa:
<cart></cart>

Catálogo de productos:
${JSON.stringify(products, null, 2)}`
        },
        ...messages
      ],
      temperature: 0.7,
      stream: true
    })

    if (!response.ok) {
      const error = await response.json()
      return new Response(
        JSON.stringify({ error: error.error?.message || 'OpenAI API error' }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)

  } catch (error: any) {
    console.error('Error in chat route:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Error processing request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
