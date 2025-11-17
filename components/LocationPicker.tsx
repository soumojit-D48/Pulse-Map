

// // components/LocationPicker.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // Fix Leaflet default icon issue with Next.js
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// interface LocationPickerProps {
//   onLocationSelect: (location: {
//     lat: number;
//     lng: number;
//     city: string;
//     state: string;
//     country: string;
//   }) => void;
//   defaultCenter?: [number, number];
// }

// function LocationMarker({ onLocationSelect }: { onLocationSelect: any }) {
//   const [position, setPosition] = useState<[number, number] | null>(null);

//   const map = useMapEvents({
//     click(e) {
//       const { lat, lng } = e.latlng;
//       setPosition([lat, lng]);
      
//       // Reverse geocoding using Nominatim
//       fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
//         .then((res) => res.json())
//         .then((data) => {
//           onLocationSelect({
//             lat,
//             lng,
//             city: data.address.city || data.address.town || data.address.village || '',
//             state: data.address.state || '',
//             country: data.address.country || '',
//           });
//         })
//         .catch((err) => {
//           console.error('Geocoding error:', err);
//           onLocationSelect({
//             lat,
//             lng,
//             city: '',
//             state: '',
//             country: '',
//           });
//         });
//     },
//   });

//   return position ? <Marker position={position} /> : null;
// }

// export default function LocationPicker({ onLocationSelect, defaultCenter }: LocationPickerProps) {
//   const [center, setCenter] = useState<[number, number]>(defaultCenter || [22.5726, 88.3639]); // Kolkata
//   const [loading, setLoading] = useState(false);

//   const getCurrentLocation = () => {
//     setLoading(true);
//     if ('geolocation' in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setCenter([latitude, longitude]);
          
//           // Auto-select current location
//           fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
//             .then((res) => res.json())
//             .then((data) => {
//               onLocationSelect({
//                 lat: latitude,
//                 lng: longitude,
//                 city: data.address.city || data.address.town || data.address.village || '',
//                 state: data.address.state || '',
//                 country: data.address.country || '',
//               });
//             })
//             .finally(() => setLoading(false));
//         },
//         (error) => {
//           console.error('Geolocation error:', error);
//           setLoading(false);
//           alert('Unable to get your location. Please click on the map to select manually.');
//         }
//       );
//     } else {
//       setLoading(false);
//       alert('Geolocation is not supported by your browser.');
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <p className="text-sm text-gray-600">Click on the map to select your location</p>
//         <button
//           type="button"
//           onClick={getCurrentLocation}
//           disabled={loading}
//           className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
//         >
//           {loading ? 'Detecting...' : 'Use My Location'}
//         </button>
//       </div>

//       <div className="h-64 rounded-lg overflow-hidden border border-gray-300">
//         <MapContainer
//           center={center}
//           zoom={13}
//           style={{ height: '100%', width: '100%' }}
//           scrollWheelZoom={true}
//         >
//           <TileLayer
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />
//           <LocationMarker onLocationSelect={onLocationSelect} />
//         </MapContainer>
//       </div>
//     </div>
//   );
// }


















// components/LocationPicker.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerProps {
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    locationName: string;
  }) => void;
  defaultCenter?: [number, number];
}

// Component to update map view
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

// Component to handle map clicks
function MapClickHandler({ onLocationSelect, setPosition }: any) {
  useMap().on('click', async (e) => {
    const { lat, lng } = e.latlng;
    setPosition([lat, lng]);
    
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      
      const locationName = [
        data.address.road,
        data.address.suburb || data.address.neighbourhood,
        data.address.city || data.address.town || data.address.village,
        data.address.state,
        data.address.country
      ].filter(Boolean).join(', ');
      
      onLocationSelect({ lat, lng, locationName });
    } catch (err) {
      console.error('Geocoding error:', err);
      onLocationSelect({ lat, lng, locationName: `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
    }
  });
  
  return null;
}

export default function LocationPicker({ onLocationSelect, defaultCenter }: LocationPickerProps) {
  const [center, setCenter] = useState<[number, number]>(defaultCenter || [22.5726, 88.3639]);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
//   const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  // Auto-detect current location
  const getCurrentLocation = () => {
    setLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const newPos: [number, number] = [latitude, longitude];
          
          setCenter(newPos);
          setPosition(newPos);
          
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            
            const locationName = [
              data.address.road,
              data.address.suburb || data.address.neighbourhood,
              data.address.city || data.address.town || data.address.village,
              data.address.state,
              data.address.country
            ].filter(Boolean).join(', ');
            
            setSearchQuery(locationName);
            onLocationSelect({ lat: latitude, lng: longitude, locationName });
          } catch (err) {
            console.error('Reverse geocoding error:', err);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLoading(false);
          alert('Unable to get your location. Please search or click on the map.');
        }
      );
    } else {
      setLoading(false);
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Search for address
  const searchAddress = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearching(false);
    }
  };

  // Debounced search
  const handleSearchInput = (value: string) => {
    setSearchQuery(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      searchAddress(value);
    }, 500);
  };

  // Select from suggestions
  const selectSuggestion = (suggestion: any) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    const newPos: [number, number] = [lat, lng];
    
    setCenter(newPos);
    setPosition(newPos);
    setSearchQuery(suggestion.display_name);
    setSuggestions([]);
    
    onLocationSelect({
      lat,
      lng,
      locationName: suggestion.display_name,
    });
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchInput(e.target.value)}
          placeholder="Search for an address or place..."
          className="w-full px-4 py-2 pr-32 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? '📍...' : '📍 My Location'}
        </button>

        {/* Search Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.place_id}
                type="button"
                onClick={() => selectSuggestion(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 border-b last:border-b-0"
              >
                <p className="text-sm font-medium text-gray-900 truncate">
                  {suggestion.display_name}
                </p>
              </button>
            ))}
          </div>
        )}
        
        {searching && (
          <div className="absolute right-36 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            Searching...
          </div>
        )}
      </div>

      {/* Info Text */}
      <p className="text-sm text-gray-600">
        🔍 Search above, 📍 use your location, or click on the map
      </p>

      {/* Map Container */}
      <div className="h-64 rounded-lg overflow-hidden border border-gray-300">
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeView center={center} />
          <MapClickHandler onLocationSelect={onLocationSelect} setPosition={setPosition} />
          {position && <Marker position={position} />}
        </MapContainer>
      </div>

      {/* Selected Location Display */}
      {position && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800">
            ✅ <strong>Selected:</strong> {searchQuery || `${position[0].toFixed(4)}, ${position[1].toFixed(4)}`}
          </p>
        </div>
      )}
    </div>
  );
}