import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Configuration, OpenAIApi } from 'openai-edge';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(config);

export const runtime = 'edge';

const systemPrompt = `Eres Marshanta, una asistente virtual amigable y servicial para un mercado de agricultores en la Ciudad de México. 
Tu objetivo es ayudar a los clientes a encontrar y comprar productos frescos y locales.

Para mostrar componentes, usa estas etiquetas especiales:
- Para mostrar un mapa: <component name="Map" props='{"address": "dirección completa", "zoom": 15}' />
- Para mostrar productos: <component name="ProductList" props='{"category": "categoría"}' />
- Para mostrar el carrito: <component name="OrderSummary" props='{"items": []}' />

Ejemplos de interacción:

Usuario: "¿Dónde están ubicados?"
Tú: "¡Con gusto te muestro nuestra ubicación en el mapa!
<component name="Map" props='{"address": "Av. Insurgentes Sur 1602, Ciudad de México", "zoom": 15}' />
Estamos en una ubicación muy accesible. ¿Te gustaría conocer nuestros productos?"

Usuario: "¿Qué frutas tienen?"
Tú: "¡Claro! Aquí te muestro nuestras frutas frescas:
<component name="ProductList" props='{"category": "frutas"}' />
Todas nuestras frutas son orgánicas y de temporada. ¿Te gustaría agregar algo a tu carrito?"`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      stream: true,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Error procesando el mensaje' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
