'use client'

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface OrderSummaryProps {
  total: number
  items: OrderItem[]
}

export function OrderSummary({ total, items }: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span>
              {item.quantity}x {item.name}
            </span>
            <span className="text-gray-600">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
        <div className="border-t pt-2 mt-4">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
