import { Market } from '@/types/market'

export const markets: Market[] = [
  {
    id: '1',
    name: 'Mercado de Coyoacán',
    address: 'Ignacio Allende s/n, Del Carmen, Coyoacán, 04100 Ciudad de México, CDMX',
    latitude: 19.3500,
    longitude: -99.1627,
    schedule: 'Lunes a Domingo: 7:00 - 18:00',
    description: 'Mercado tradicional con una gran variedad de productos frescos y comida preparada.',
    rating: 4.7,
    reviews: 1250,
    isOpen: true
  },
  {
    id: '2',
    name: 'Mercado de San Juan',
    address: 'Ernesto Pugibet 21, Colonia Centro, Centro, Cuauhtémoc, 06000 Ciudad de México, CDMX',
    latitude: 19.4321,
    longitude: -99.1397,
    schedule: 'Lunes a Sábado: 7:00 - 17:00',
    description: 'Famoso por sus productos gourmet y especialidades.',
    rating: 4.8,
    reviews: 980,
    isOpen: true
  },
  {
    id: '3',
    name: 'Mercado de Jamaica',
    address: 'Guillermo Prieto 45, Jamaica, Venustiano Carranza, 15800 Ciudad de México, CDMX',
    latitude: 19.4082,
    longitude: -99.1219,
    schedule: 'Lunes a Domingo: 6:00 - 18:00',
    description: 'El mercado de flores más grande de la ciudad.',
    rating: 4.6,
    reviews: 750,
    isOpen: true
  },
  {
    id: '4',
    name: 'Mercado de la Merced',
    address: 'Rosario 156, Centro, Venustiano Carranza, 15810 Ciudad de México, CDMX',
    latitude: 19.4242,
    longitude: -99.1241,
    schedule: 'Lunes a Domingo: 5:00 - 18:00',
    description: 'El mercado más grande y tradicional de la Ciudad de México.',
    rating: 4.5,
    reviews: 1500,
    isOpen: true
  }
]
