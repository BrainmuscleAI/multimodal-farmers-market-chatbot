'use client';

import React from 'react';
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
  address: string;
  zoom?: number;
  className?: string;
}

const DEFAULT_ADDRESS = "Av. Insurgentes Sur 1602, Crédito Constructor, Benito Juárez, 03940 Ciudad de México, CDMX";
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

if (!MAPBOX_TOKEN) {
  console.error('Mapbox token not found in environment variables');
}

mapboxgl.accessToken = MAPBOX_TOKEN || '';

export default function Map({ address = DEFAULT_ADDRESS, zoom = 15, className = '' }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !MAPBOX_TOKEN) {
      setError('Map configuration is incomplete');
      return;
    }

    const initializeMap = async () => {
      try {
        // Hardcoded coordinates for Mexico City as fallback
        let lng = -99.1666;
        let lat = 19.4167;

        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
              address
            )}.json?access_token=${MAPBOX_TOKEN}`
          );
          
          if (!response.ok) {
            throw new Error('Failed to geocode address');
          }

          const data = await response.json();

          if (data.features && data.features.length > 0) {
            [lng, lat] = data.features[0].center;
          }
        } catch (error) {
          console.error('Geocoding error:', error);
          // Continue with default coordinates
        }

        if (map.current) {
          map.current.remove();
        }

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [lng, lat],
          zoom: zoom,
        });

        new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map.current);

        map.current.addControl(new mapboxgl.NavigationControl());
        
        setError(null);
      } catch (error) {
        console.error('Error initializing map:', error);
        setError('Error loading map');
      }
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [address, zoom]);

  if (error) {
    return (
      <div className={`w-full h-[400px] rounded-lg bg-gray-100 flex items-center justify-center ${className}`}>
        <p className="text-gray-500">
          {error === 'Map configuration is incomplete' 
            ? 'Map configuration is incomplete. Please check your Mapbox token.'
            : 'Unable to load map. Showing default location.'}
        </p>
      </div>
    );
  }

  return (
    <div 
      ref={mapContainer} 
      className={`w-full h-[400px] rounded-lg ${className}`} 
      style={{ minHeight: '400px' }}
    />
  );
}
