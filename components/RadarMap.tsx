import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { LatLng, FlightStatus } from '../types';

interface RadarMapProps {
  userLocation: LatLng;
  santaStatus: FlightStatus | null;
  zoomPreset: number;
}

// Custom Icons as simple HTML to avoid asset loading issues
const SantaIcon = L.divIcon({
  html: `<div style="font-size: 32px; color: white; filter: drop-shadow(0 0 8px white); line-height: 1;">❄️</div>`,
  className: 'bg-transparent',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const HomeIcon = L.divIcon({
  html: `<div style="width: 14px; height: 14px; background-color: #ef4444; border-radius: 50%; box-shadow: 0 0 10px #ef4444; border: 2px solid rgba(255, 255, 255, 0.2);"></div>`,
  className: 'bg-transparent',
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

// Component to handle map view updates
const MapController: React.FC<{ center: LatLng, zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
};

export const RadarMap: React.FC<RadarMapProps> = ({ userLocation, santaStatus, zoomPreset }) => {
  // Center map on Santa if available, otherwise User
  const mapCenter = santaStatus ? santaStatus.position : userLocation;

  return (
    <div className="relative w-full h-full bg-black">
      <MapContainer 
        center={userLocation} 
        zoom={3} 
        // WICHTIG: Wir nutzen jetzt 'style' statt 'className' für die Größe
        // 100vh = 100% der Bildschirmhöhe (View Height)
        style={{ height: '100dvh', width: '100vw', background: '#051105' }}
        zoomControl={false}
        attributionControl={false}
      >
        {/* Dark Matter / Matrix style map tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          opacity={0.6}
        />
        
        {/* Map Effects Overlay (Grids/CRT) implemented in CSS, but here is the logic */}
        <MapController center={mapCenter} zoom={zoomPreset} />

        {/* User Marker */}
        <Marker position={userLocation} icon={HomeIcon} />

        {/* Santa Marker */}
        {santaStatus && (
          <Marker position={santaStatus.position} icon={SantaIcon} />
        )}
      </MapContainer>

      {/* Radar Sweep Overlay - Pure CSS over the map container */}
      <div className="absolute inset-0 pointer-events-none z-[400] overflow-hidden">
        {/* The rotating sweep */}
        <div className="absolute inset-[-50%] w-[200%] h-[200%] radar-sweep">
           <div className="w-full h-full" style={{
             background: 'conic-gradient(from 0deg, transparent 0deg, transparent 280deg, rgba(0, 255, 0, 0.1) 360deg)'
           }}></div>
        </div>
        
        {/* Static Rings */}
        <div className="absolute inset-0 radar-grid opacity-20"></div>
        <div className="absolute inset-0 rounded-full border border-green-500/20 m-12"></div>
        <div className="absolute inset-0 rounded-full border border-green-500/20 m-32"></div>
        <div className="absolute inset-0 rounded-full border border-green-500/20 m-60"></div>
        
        {/* CRT Scanline effect */}
        <div className="absolute inset-0 crt-overlay opacity-30"></div>
        
        {/* Corner HUD Elements */}
        <div className="absolute top-4 left-4 text-green-500/50 font-mono text-xs">
           SYS.READY<br/>
           TRK.ACTIVE<br/>
           ENC.AES-256
        </div>
      </div>
    </div>
  );
};
