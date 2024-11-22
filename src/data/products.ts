import { Product } from '@/types/products'

export const products: Product[] = [
  {
    id: '1',
    name: 'Organic Tomatoes',
    price: 3.99,
    description: 'Fresh, locally grown organic tomatoes',
    image: '/images/products/tomatoes.jpg',
    unit: 'lb',
    category: 'vegetables'
  },
  {
    id: '2',
    name: 'Fresh Lettuce',
    price: 2.49,
    description: 'Crisp, locally grown lettuce',
    image: '/images/products/lettuce.jpg',
    unit: 'head',
    category: 'vegetables'
  },
  {
    id: '3',
    name: 'Organic Carrots',
    price: 2.99,
    description: 'Sweet, organic carrots from local farms',
    image: '/images/products/carrots.jpg',
    unit: 'lb',
    category: 'vegetables'
  },
  {
    id: '4',
    name: 'Fresh Strawberries',
    price: 4.99,
    description: 'Sweet and juicy locally grown strawberries',
    image: '/images/products/strawberries.jpg',
    unit: 'basket',
    category: 'fruits'
  },
  {
    id: '5',
    name: 'Organic Apples',
    price: 3.49,
    description: 'Crisp and sweet organic apples',
    image: '/images/products/apples.jpg',
    unit: 'lb',
    category: 'fruits'
  }
]
