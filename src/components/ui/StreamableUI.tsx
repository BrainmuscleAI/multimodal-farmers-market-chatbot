'use client'

import { useState, useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { ProductList } from './ProductList'

interface StreamableUIProps {
  content: string
}

interface ComponentData {
  name: string
  props: Record<string, any>
}

export function StreamableUI({ content }: StreamableUIProps) {
  const { components, textContent } = useMemo(() => {
    try {
      const componentRegex = /<component[^>]*name="([^"]*)"[^>]*props='([^']*)'[^>]*>/g
      const foundComponents: ComponentData[] = []
      let remainingContent = content

      let match
      while ((match = componentRegex.exec(content)) !== null) {
        foundComponents.push({
          name: match[1],
          props: JSON.parse(match[2])
        })
        remainingContent = remainingContent.replace(match[0], '')
      }

      return {
        components: foundComponents,
        textContent: remainingContent.trim()
      }
    } catch (error) {
      console.error('Error processing content:', error)
      return {
        components: [],
        textContent: content
      }
    }
  }, [content])

  const markdownComponents = {
    ul: ({ children }: { children: React.ReactNode }) => (
      <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>
    ),
    li: ({ children }: { children: React.ReactNode }) => (
      <li className="text-gray-800">{children}</li>
    ),
    p: ({ children }: { children: React.ReactNode }) => (
      <p className="mb-2 text-gray-800">{children}</p>
    ),
    strong: ({ children }: { children: React.ReactNode }) => (
      <strong className="font-bold text-gray-900">{children}</strong>
    )
  }

  return (
    <div className="space-y-4">
      {textContent && (
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown components={markdownComponents}>
            {textContent}
          </ReactMarkdown>
        </div>
      )}
      {components.map((component, index) => {
        switch (component.name) {
          case 'ProductList':
            return <ProductList key={`component-${index}`} {...component.props} />
          default:
            return null
        }
      })}
    </div>
  )
}
