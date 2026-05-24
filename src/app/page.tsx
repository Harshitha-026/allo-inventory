'use client'

import { useEffect, useState } from 'react'

export default function HomePage() {
  const [products, setProducts] =
    useState<any[]>([])

  const [error, setError] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const res = await fetch('/api/products')

    const data = await res.json()

    setProducts(data)
  }

  async function reserve(
    inventoryId: string,
  ) {
    setError('')

    const res = await fetch(
      '/api/reservations',
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify({
          inventoryId,
          quantity: 1,
        }),
      },
    )

    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      return
    }

    alert('Reservation created')
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Inventory Reservation
      </h1>

      {error && (
        <p className="text-red-500 mb-4">
          {error}
        </p>
      )}

      <div className="space-y-4">
        {products.map((item) => (
          <div
            key={item.inventoryId}
            className="border p-4 rounded"
          >
            <h2 className="font-bold text-xl">
              {item.product}
            </h2>

            <p>
              Warehouse:
              {' '}{item.warehouse}
            </p>

            <p>
              Available:
              {' '}{item.available}
            </p>

            <button
              className="bg-black text-white px-4 py-2 mt-2 rounded"
              onClick={() =>
                reserve(item.inventoryId)
              }
            >
              Reserve
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}