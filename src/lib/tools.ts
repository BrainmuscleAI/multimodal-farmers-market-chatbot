interface Tool {
  name: string
  description: string
  parameters: {
    type: string
    properties: Record<string, any>
    required?: string[]
  }
}

// Start with just the calculator tool
export const tools: Tool[] = [
  {
    name: 'calculator',
    description: 'A calculator tool that can perform basic arithmetic operations',
    parameters: {
      type: 'object',
      properties: {
        operation: {
          type: 'string',
          enum: ['add', 'subtract', 'multiply', 'divide'],
          description: 'The arithmetic operation to perform'
        },
        a: {
          type: 'number',
          description: 'The first number'
        },
        b: {
          type: 'number',
          description: 'The second number'
        }
      },
      required: ['operation', 'a', 'b']
    }
  }
]

// Tool implementation
export async function calculate({ operation, a, b }: { operation: string; a: number; b: number }) {
  switch (operation) {
    case 'add':
      return a + b
    case 'subtract':
      return a - b
    case 'multiply':
      return a * b
    case 'divide':
      if (b === 0) throw new Error('Cannot divide by zero')
      return a / b
    default:
      throw new Error('Invalid operation')
  }
}
