export interface Market {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  schedule?: string
  products?: string[]
  image?: string
  phone?: string
  email?: string
  website?: string
  description?: string
  rating?: number
  reviews?: number
  isOpen?: boolean
  distance?: number
}
