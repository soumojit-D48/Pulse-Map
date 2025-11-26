

// app/(dashboard)/find-requests/MapView.tsx
'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import L from 'leaflet';

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface BloodRequest {
  id: string;
  patientName: string;
  bloodGroup: string;
  unitsNeeded: number;
  urgency: string;
  hospitalName?: string | null;
  patientLocationName: string;
  patientLatitude: number;
  patientLongitude: number;
  distance: number;
}

interface MapViewProps {
  userLocation: UserLocation;
  requests: BloodRequest[];
  radius: number;
  bloodGroupLabels: { [key: string]: string };
}

// Setup Leaflet icons
const setupLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

// Custom marker icons for requests
const createRequestIcon = (bloodGroup: string, urgency: string) => {
  let color;
  if (urgency === 'CRITICAL') color = '#ef4444';
  else if (urgency === 'HIGH') color = '#f97316';
  else if (urgency === 'MEDIUM') color = '#f59e0b';
  else color = '#10b981';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-weight: bold;
        font-size: 11px;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        white-space: nowrap;
      ">
        ${bloodGroup}
      </div>
    `,
    iconSize: [40, 20],
    iconAnchor: [20, 10],
  });
};

const createUserIcon = () => {
  return L.divIcon({
    className: 'user-marker',
    html: `
      <div style="
        background-color: #3b82f6;
        color: white;
        padding: 8px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

export default function MapView({ userLocation, requests, radius, bloodGroupLabels }: MapViewProps) {
  useEffect(() => {
    setupLeafletIcons();
  }, []);

  return (
    <MapContainer
      center={[userLocation.latitude, userLocation.longitude]}
      zoom={11}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Radius Circle */}
      <Circle
        center={[userLocation.latitude, userLocation.longitude]}
        radius={radius * 1000}
        pathOptions={{
          color: '#ef4444',
          fillColor: '#ef4444',
          fillOpacity: 0.1,
          weight: 2,
        }}
      />

      {/* User Location Marker */}
      <Marker
        position={[userLocation.latitude, userLocation.longitude]}
        icon={createUserIcon()}
      >
        <Popup>
          <div className="text-center">
            <p className="font-semibold">Your Location</p>
          </div>
        </Popup>
      </Marker>

      {/* Request Markers */}
      {requests.map((request) => (
        <Marker
          key={request.id}
          position={[request.patientLatitude, request.patientLongitude]}
          icon={createRequestIcon(
            bloodGroupLabels[request.bloodGroup],
            request.urgency
          )}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold text-gray-900">{request.patientName}</p>
              <p className="text-gray-600">{bloodGroupLabels[request.bloodGroup]} • {request.unitsNeeded} units</p>
              <p className="text-gray-500">{request.distance.toFixed(1)} km away</p>
              <p className="text-xs text-gray-400">{request.hospitalName || request.patientLocationName}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}