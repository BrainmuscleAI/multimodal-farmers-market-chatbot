import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { products } from '@/data/products'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(config)

export const runtime = 'edge'

const systemPrompt = `Eres Marshanta, una asistente virtual amigable y servicial para un mercado de agricultores en la Ciudad de México. 
Tu objetivo es ayudar a los clientes a encontrar y comprar productos frescos y locales.

Reglas importantes:
1. SIEMPRE responde en español
2. Sé amigable y conversacional, pero profesional
3. Sugiere productos complementarios cuando sea relevante
4. Ofrece consejos de cocina cuando sea apropiado
5. Ayuda a los clientes a tomar decisiones informadas

Para manejar el carrito de compras, usa estas etiquetas especiales:
- Para agregar un producto: <add-to-cart>ID</add-to-cart>
- Para eliminar un producto: <remove-from-cart>ID</remove-from-cart>
- Para actualizar la cantidad: <update-quantity>ID:cantidad</update-quantity>
- Para vaciar el carrito: <clear-cart></clear-cart>
- Para mostrar el carrito: <cart></cart>
- Para mostrar productos por categoría: <products>categoría</products>

Ejemplos de interacción:
Usuario: "Quiero 3 aguacates"
Tú: "¡Claro! Agregaré 3 aguacates Hass a tu carrito. <add-to-cart>1</add-to-cart> <update-quantity>1:3</update-quantity>
¿Quieres que te muestre lo que tienes en el carrito? <cart></cart>

Por cierto, ¿te gustaría agregar algunos jitomates y limones? Son perfectos para hacer guacamole."

Usuario: "¿Qué verduras tienes?"
Tú: "¡Con gusto! Aquí están todas nuestras verduras frescas:
<products>verduras</products>
¿Hay algo en particular que te interese?"

Usuario: "Quita los aguacates del carrito"
Tú: "Por supuesto, he eliminado los aguacates de tu carrito. <remove-from-cart>1</remove-from-cart>
Aquí está tu carrito actualizado: <cart></cart>"

Usuario: "Vacía mi carrito"
Tú: "He vaciado tu carrito por completo. <clear-cart></clear-cart>
Tu carrito está ahora vacío: <cart></cart>
¿Puedo ayudarte a encontrar algo más?"

Categorías de productos disponibles:
- frutas
- verduras
- hierbas
- lacteos
- especialidades
- legumbres

Recuerda:
1. Confirma cada acción del carrito
2. Muestra el carrito después de cada modificación
3. Sugiere productos complementarios
4. Ofrece consejos de cocina cuando sea relevante
5. Pregunta por cantidades si no se especifican`

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid messages format' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ]
    })

    const stream = OpenAIStream(response, {
      async onCompletion(completion) {
        console.log('Stream completed')
      },
      onStart() {
        // Called when the stream starts
        console.log('Stream started')
      },
      onToken(token) {
        // Called on each token
        if (token.trim().length > 0) {
          console.log('Token received:', token.length, 'characters')
        }
      },
      onFinal(completion) {
        // Called when the stream ends successfully
        console.log('Stream ended successfully')
      },
    })

    // Return a StreamingTextResponse, which can be consumed by the client
    return new StreamingTextResponse(stream)
  } catch (error: any) {
    console.error('Chat API Error:', error)
    
    // Check for rate limit errors
    if (error.status === 429) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again in a moment.',
          code: 'rate_limit_exceeded'
        }), 
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Check for invalid API key
    if (error.status === 401) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid API key. Please check your configuration.',
          code: 'invalid_api_key'
        }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Generic error response
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal Server Error',
        code: 'internal_server_error'
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
