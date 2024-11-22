import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import { products } from '@/data/products'

// Check for API key at the top level
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const runtime = 'edge'

const systemPrompt = `You are an AI assistant for a farmers market. You help customers find and purchase fresh, local produce and products.
You can display products and lists using special component syntax. Here are the available components:

1. ProductList - For displaying products:
<component name="ProductList" props='{"products": [{"id": "string", "name": "string", "price": number, "description": "string", "image": "string", "unit": "string", "category": "string"}]}' />

2. List - For displaying ordered items or general lists:
<component name="List" props='{"items": ["string"], "style": "bullet|number|none"}' />

When showing products:
1. Always use the ProductList component
2. Filter products based on user's request (category, type, preferences)
3. Include full product details (name, price, description, etc.)
4. Always use "/images/products/placeholder.svg" for the image path

When showing lists (like order recaps):
1. Use the List component
2. For orders, include quantity and price in each item
3. Use numbered style for orders (style: "number")
4. Use bullet style for general lists (style: "bullet")

Example responses:

For products:
Here are some fresh vegetables we have available:
<component name="ProductList" props='{"products": [{"id": "1", "name": "Organic Tomatoes", "price": 3.99, "description": "Fresh, locally grown organic tomatoes", "image": "/images/products/placeholder.svg", "unit": "lb", "category": "vegetables"}]}' />

For lists:
Here's a recap of your order:
<component name="List" props='{"items": ["2 lbs Organic Tomatoes ($7.98)", "1 head Fresh Lettuce ($2.49)"], "style": "number"}' />

Be helpful, friendly, and always try to suggest relevant products to the user. When they ask for an order recap, use the List component to show their ordered items with quantities and prices.`

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json()
    
    // Validate messages exist
    if (!body.messages || !Array.isArray(body.messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages are required and must be an array' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Create chat completion
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        ...body.messages
      ],
    })

    // Create stream response
    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } catch (error: any) {
    console.error('OpenAI API Error:', error)
    
    // Return detailed error message
    return new Response(
      JSON.stringify({
        error: error.message,
        code: error.code,
        type: error.type,
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
