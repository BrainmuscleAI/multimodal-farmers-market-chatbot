export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description?: string
}

export type ProductCategory = 'frutas' | 'verduras' | 'hierbas' | 'lacteos' | 'especialidades' | 'legumbres'
