import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { tool, params } = await req.json();

    switch (tool) {
      case 'get_user_location':
        return NextResponse.json({
          type: 'component',
          content: `Por favor, proporciona tu dirección para mostrarte un mapa y encontrar los mercados más cercanos.
<component name="List" props='{"items": ["Calle y número", "Colonia", "Ciudad", "Estado", "Código Postal"]}' />`
        });

      case 'display_map':
        const { address } = params;
        return NextResponse.json({
          type: 'component',
          content: `Aquí está el mapa de tu ubicación:
<component name="Map" props='{"address": "${address}", "zoom": 15}' />`
        });

      default:
        return NextResponse.json(
          { error: 'Herramienta de ubicación no reconocida' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error en la ruta de ubicación:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud de ubicación' },
      { status: 500 }
    );
  }
}
