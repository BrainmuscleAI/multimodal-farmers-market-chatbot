'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';

interface OrderSummaryProps {
  items?: any[];
}

export default function OrderSummary({ items }: OrderSummaryProps) {
  const { items: cartItems, getTotal, removeFromCart } = useCart();
  const displayItems = items || cartItems;
  const total = getTotal();

  if (!displayItems.length) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        El carrito está vacío
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 border">
      <h3 className="font-medium text-lg mb-4">Resumen del pedido</h3>
      <div className="space-y-3">
        {displayItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-600">
                {item.quantity}x ${item.price} = ${item.quantity * item.price}
              </p>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 hover:text-red-600"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between font-medium">
          <span>Total:</span>
          <span>${total}</span>
        </div>
      </div>
    </div>
  );
}
