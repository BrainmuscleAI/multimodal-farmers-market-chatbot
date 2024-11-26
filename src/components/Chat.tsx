'use client';

import React from 'react';
import { useChat } from 'ai/react';
import { useRef, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Product } from '@/types/products';
import dynamic from 'next/dynamic';

interface ChatProps {
  initialProducts: Product[];
  chatId: string;
}

const Map = dynamic(() => import('./ui/Map'), { ssr: false });
const ProductList = dynamic(() => import('./ui/ProductList'), { ssr: false });
const OrderSummary = dynamic(() => import('./ui/OrderSummary'), { ssr: false });

const ComponentMap = {
  Map,
  ProductList,
  OrderSummary,
} as const;

type ComponentName = keyof typeof ComponentMap;

const parseComponents = (content: string) => {
  const componentRegex = /<component\s+name="([^"]+)"\s+props='([^']+)'\s*\/>/g;
  const parts = content.split(componentRegex);
  const result = [];
  
  for (let i = 0; i < parts.length; i++) {
    if (i % 3 === 0) {
      if (parts[i]) result.push({ type: 'text', content: parts[i] });
    } else if (i % 3 === 1) {
      const name = parts[i] as ComponentName;
      try {
        const props = JSON.parse(parts[i + 1].replace(/\n/g, '').trim());
        result.push({ type: 'component', name, props });
      } catch (error) {
        console.error('Error parsing component props:', error);
        console.log('Problematic JSON string:', parts[i + 1]);
        result.push({ type: 'text', content: parts[i + 1] });
      }
    }
  }
  
  return result;
};

export function Chat({ initialProducts, chatId }: ChatProps) {
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    id: chatId,
    body: {
      chatId,
      initialProducts
    },
    onResponse(response) {
      setError(null);
      if (response.status === 200) {
        console.log('Streaming started successfully');
      } else {
        response.json().then((data) => {
          if (data.error) {
            setError(data.error);
          }
        });
      }
    },
    onError(error) {
      console.error('Chat error:', error);
      setError('Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.');
    }
  });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const renderMessagePart = (part: any, index: number) => {
    if (part.type === 'text') {
      return <ReactMarkdown key={`text-${index}`}>{part.content}</ReactMarkdown>;
    } else if (part.type === 'component') {
      const Component = ComponentMap[part.name];
      return Component ? (
        <div key={`component-${part.name}-${index}`} className="my-2">
          <Component {...part.props} />
        </div>
      ) : null;
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, messageIndex) => {
          const parts = parseComponents(message.content);
          return (
            <div
              key={`message-${message.id || messageIndex}`}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`rounded-lg p-4 max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-zinc-800'
                }`}
              >
                {parts.map((part, partIndex) => (
                  <div key={`part-${messageIndex}-${partIndex}`}>
                    {renderMessagePart(part, partIndex)}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t bg-white dark:bg-zinc-900">
        <div className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (input.trim()) {
                  handleSubmit(e as any);
                }
              }
            }}
            placeholder="Escribe un mensaje..."
            className="flex-1 p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            Enviar
          </button>
        </div>
        {error && (
          <p className="mt-2 text-red-500">{error}</p>
        )}
      </form>
    </div>
  );
}