'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Market } from '@/types/market'

interface MarketMapProps {
  markets: Market[]
  selectedMarket?: Market
  onMarketSelect?: (market: Market) => void
  className?: string
}

export function MarketMap({ markets, selectedMarket, onMarketSelect, className = '' }: MarketMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<L.Map | null>(null)
  const markersRef = useRef<{ [key: string]: L.Marker }>({})

  useEffect(() => {
    if (!mapRef.current || map) return

    // Create map instance
    const instance = L.map(mapRef.current).setView([19.4326, -99.1332], 11) // Default to CDMX

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(instance)

    setMap(instance)

    // Cleanup
    return () => {
      instance.remove()
    }
  }, [map])

  // Handle markers
  useEffect(() => {
    if (!map) return

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove())
    markersRef.current = {}

    // Create custom icon
    const icon = L.divIcon({
      className: 'bg-green-500 w-4 h-4 rounded-full border-2 border-white shadow-lg',
      iconSize: [16, 16]
    })

    // Add markers for each market
    markets.forEach(market => {
      const marker = L.marker([market.latitude, market.longitude], { icon })
        .addTo(map)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-bold">${market.name}</h3>
            <p class="text-sm">${market.address}</p>
            ${market.schedule ? `<p class="text-sm mt-1">🕒 ${market.schedule}</p>` : ''}
          </div>
        `)

      if (onMarketSelect) {
        marker.on('click', () => onMarketSelect(market))
      }

      markersRef.current[market.id] = marker
    })

    // If there's a selected market, focus on it
    if (selectedMarket) {
      const marker = markersRef.current[selectedMarket.id]
      if (marker) {
        map.setView(marker.getLatLng(), 14)
        marker.openPopup()
      }
    }
    // If no market is selected, fit bounds to show all markets
    else if (markets.length > 0) {
      const bounds = L.latLngBounds(markets.map(m => [m.latitude, m.longitude]))
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [map, markets, selectedMarket, onMarketSelect])

  return (
    <div className={`relative rounded-xl overflow-hidden ${className}`}>
      <div ref={mapRef} className="w-full h-full min-h-[300px]" />
    </div>
  )
}
