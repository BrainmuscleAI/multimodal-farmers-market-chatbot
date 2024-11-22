'use client'

import { createElement } from 'react'
import { ProductList } from './ProductList'
import { List } from './List'
import { Product } from '@/types/products'

interface StreamableComponentProps {
  name: string
  props: any
}

const components = {
  ProductList,
  List,
} as const

type ComponentName = keyof typeof components

export function StreamableUI({ name, props }: { name: ComponentName; props: any }) {
  const Component = components[name]
  if (!Component) {
    return <div>Component {name} not found</div>
  }
  return createElement(Component, props)
}

export function parseStreamableComponent(text: string): StreamableComponentProps | null {
  try {
    const match = text.match(/<component\s+name="([^"]+)"\s+props='([^']+)'\s*\/>/)
    if (!match) return null

    const [_, name, propsString] = match
    const props = JSON.parse(propsString)
    return { name, props }
  } catch (error) {
    console.error('Error parsing component:', error)
    return null
  }
}
