'use client'

import { createElement } from 'react'
import { Product } from '@/types/products'
import { ProductList } from './ui/ProductList'
import { List } from './ui/List'
import { OrderSummary } from './ui/OrderSummary'
import { ProductCard } from './ui/ProductCard'
import { CategoryFilter } from './ui/CategoryFilter'

interface StreamableUIProps {
  content: string
}

interface ComponentMatch {
  name: string
  props: any
}

export const parseStreamableComponent = (content: string): ComponentMatch[] => {
  const componentRegex = /<component\s+name="([^"]+)"\s+props='([^']+)'\s*\/>/g
  const matches: ComponentMatch[] = []
  let match

  while ((match = componentRegex.exec(content)) !== null) {
    try {
      const props = JSON.parse(match[2])
      matches.push({
        name: match[1],
        props,
      })
    } catch (error) {
      console.error('Failed to parse component props:', error)
    }
  }

  return matches
}

const ComponentMap = {
  ProductList,
  List,
  OrderSummary,
  ProductCard,
  CategoryFilter,
}

export function StreamableUI({ content }: StreamableUIProps) {
  const components = parseStreamableComponent(content)
  const textParts = content.split(/<component[^>]+\/>/)

  return (
    <div>
      {textParts.map((text, index) => (
        <div key={index}>
          {text}
          {components[index] && (
            <div className="my-2">
              {ComponentMap[components[index].name as keyof typeof ComponentMap] ? (
                createElement(
                  ComponentMap[components[index].name as keyof typeof ComponentMap],
                  components[index].props
                )
              ) : (
                <div className="text-red-500">
                  Unknown component: {components[index].name}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
