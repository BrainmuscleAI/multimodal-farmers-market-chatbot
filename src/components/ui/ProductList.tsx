'use client';

import React from 'react';
import { Product } from '@/types/products';
import { useCart } from '@/context/CartContext';

interface ProductListProps {
  products?: Product[];
  category?: string;
}

export default function ProductList({ products: propProducts, category }: ProductListProps) {
  const { addToCart } = useCart();
  const defaultProducts = [
    { id: '1', name: 'Aguacate Hass', price: 25, unit: 'pieza', category: 'frutas' },
    { id: '2', name: 'Jitomate', price: 15, unit: 'kg', category: 'verduras' },
    { id: '3', name: 'Manzana', price: 20, unit: 'kg', category: 'frutas' },
    { id: '4', name: 'Limón', price: 10, unit: 'kg', category: 'frutas' },
  ];

  const products = propProducts || defaultProducts;
  const filteredProducts = category 
    ? products.filter(p => p.category.toLowerCase() === category.toLowerCase())
    : products;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {filteredProducts.map((product) => (
        <div
          key={product.id}
          className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="font-medium">{product.name}</h3>
          <p className="text-gray-600">
            ${product.price} por {product.unit}
          </p>
          <button
            onClick={() => addToCart(product)}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Agregar al carrito
          </button>
        </div>
      ))}
    </div>
  );
}
