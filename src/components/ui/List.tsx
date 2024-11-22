'use client'

interface ListProps {
  items: string[]
  style?: 'bullet' | 'number' | 'none'
}

export function List({ items, style = 'bullet' }: ListProps) {
  if (!items.length) {
    return null
  }

  const listStyle = {
    bullet: 'list-disc',
    number: 'list-decimal',
    none: 'list-none'
  }

  return (
    <ul className={`${listStyle[style]} ml-5 space-y-1 text-gray-700`}>
      {items.map((item, index) => (
        <li key={index} className="pl-1">
          {item}
        </li>
      ))}
    </ul>
  )
}
