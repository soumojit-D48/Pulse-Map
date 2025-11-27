


// components/profile/LocationStep.tsx
'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useProfileStore } from '@/store/profileStore';
import { Loader2, MapPin, Navigation } from 'lucide-react';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationData {
  latitude: number;
  longitude: number;
  state: string;
  city: string;
  locationName: string;
}

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FlyToLocation({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13, { duration: 1.5 });
  }, [center, map]);
  return null;
}

export default function LocationStep() {
  const { formData, updateLocation, nextStep } = useProfileStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [error, setError] = useState('');
  
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    formData.location ? [formData.location.latitude, formData.location.longitude] : null
  );
  
  const [locationDetails, setLocationDetails] = useState<LocationData | null>(
    formData.location || null
  );

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.error) {
        throw new Error('Location not found');
      }

      const address = data.address;
      const state = address.state || address.region || '';
      const city = address.city || address.town || address.village || address.county || '';
      const locationName = data.display_name || '';

      const locationData: LocationData = {
        latitude: lat,
        longitude: lng,
        state,
        city,
        locationName,
      };

      setLocationDetails(locationData);
      updateLocation(locationData);
      setError('');
      
      return locationData;
    } catch (err) {
      console.error('Reverse geocoding error:', err);
      setError('Unable to fetch location details. Please try again.');
      return null;
    }
  };

  const handleLocationSelect = async (lat: number, lng: number) => {
    setMarkerPosition([lat, lng]);
    await reverseGeocode(lat, lng);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError('');

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery + ', India'
        )}&limit=1&addressdetails=1`
      );
      const data = await response.json();

      if (data.length === 0) {
        setError('Location not found. Please try another search.');
        return;
      }

      const result = data[0];
      const lat = parseFloat(result.lat);
      const lng = parseFloat(result.lon);

      setMapCenter([lat, lng]);
      setMarkerPosition([lat, lng]);
      await reverseGeocode(lat, lng);
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setMapCenter([lat, lng]);
        setMarkerPosition([lat, lng]);
        await reverseGeocode(lat, lng);
        setIsGettingLocation(false);
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError('Unable to get your location. Please search manually or allow location access.');
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Select Your Location</h2>
        <p className="text-muted-foreground mt-1">
          Search for your city or use current location, then click on the map to pinpoint your exact location
        </p>
      </div>

      {/* Search and Current Location */}
      <div className="space-y-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for your city (e.g., Kolkata, Mumbai)"
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 ring-primary focus:border-transparent"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-muted-foreground" />
            )}
          </div>
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-dark disabled:bg-muted disabled:cursor-not-allowed font-medium flex items-center gap-2 shadow-glow"
          >
            <MapPin className="w-4 h-4" />
            Search
          </button>
        </form>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isGettingLocation}
          className="w-full px-4 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 disabled:bg-muted font-medium flex items-center justify-center gap-2"
        >
          {isGettingLocation ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Getting your location...
            </>
          ) : (
            <>
              <Navigation className="w-5 h-5" />
              Use Current Location
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive">
          {error}
        </div>
      )}

      {/* Map */}
      <div className="border-2 border-border rounded-lg overflow-hidden">
        <MapContainer
          center={mapCenter}
          zoom={5}
          style={{ height: '400px', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onLocationSelect={handleLocationSelect} />
          <FlyToLocation center={mapCenter} />
          {markerPosition && <Marker position={markerPosition} />}
        </MapContainer>
      </div>

      {/* Location Details */}
      {locationDetails && (
        <div className="p-4 bg-success/10 border border-success rounded-lg space-y-2">
          <h3 className="font-semibold text-success flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Selected Location
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">State:</span>
              <p className="font-medium text-foreground">{locationDetails.state}</p>
            </div>
            <div>
              <span className="text-muted-foreground">City:</span>
              <p className="font-medium text-foreground">{locationDetails.city}</p>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Address:</span>
              <p className="font-medium text-foreground">{locationDetails.locationName}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Latitude:</span>
              <p className="font-medium text-foreground">{locationDetails.latitude.toFixed(6)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Longitude:</span>
              <p className="font-medium text-foreground">{locationDetails.longitude.toFixed(6)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="p-4 bg-accent/10 border border-accent rounded-lg">
        <h4 className="font-semibold text-accent mb-2">How to select your location:</h4>
        <ul className="text-sm text-accent space-y-1 list-disc list-inside">
          <li>Search for your city in the search box above, OR</li>
          <li>Click "Use Current Location" to auto-detect, OR</li>
          <li>Click directly on the map to select any location</li>
          <li>The map will automatically extract your state, city, and address</li>
        </ul>
      </div>
    </div>
  );
}





// 'use client';

// import { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import { useProfileStore } from '@/store/profileStore';
// import { Loader2, MapPin, Navigation } from 'lucide-react';

// // Fix Leaflet default icon issue in Next.js
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// interface LocationData {
//   latitude: number;
//   longitude: number;
//   state: string;
//   city: string;
//   locationName: string;
// }

// // Component to handle map clicks and update marker
// function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
//   useMapEvents({
//     click: (e) => {
//       onLocationSelect(e.latlng.lat, e.latlng.lng);
//     },
//   });
//   return null;
// }

// // Component to fly to searched location
// function FlyToLocation({ center }: { center: [number, number] }) {
//   const map = useMap();
//   useEffect(() => {
//     map.flyTo(center, 13, { duration: 1.5 });
//   }, [center, map]);
//   return null;
// }

// export default function LocationStep() {
//   const { formData, updateLocation, nextStep } = useProfileStore();
  
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isSearching, setIsSearching] = useState(false);
//   const [isGettingLocation, setIsGettingLocation] = useState(false);
//   const [error, setError] = useState('');
  
//   // Default center (India)
//   const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]);
//   const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
//     formData.location ? [formData.location.latitude, formData.location.longitude] : null
//   );
  
//   const [locationDetails, setLocationDetails] = useState<LocationData | null>(
//     formData.location || null
//   );

//   // Reverse geocoding - Get address from lat/lng
//   const reverseGeocode = async (lat: number, lng: number) => {
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
//       );
//       const data = await response.json();
      
//       if (data.error) {
//         throw new Error('Location not found');
//       }

//       const address = data.address;
//       const state = address.state || address.region || '';
//       const city = address.city || address.town || address.village || address.county || '';
//       const locationName = data.display_name || '';

//       const locationData: LocationData = {
//         latitude: lat,
//         longitude: lng,
//         state,
//         city,
//         locationName,
//       };

//       setLocationDetails(locationData);
//       updateLocation(locationData);
//       setError('');
      
//       return locationData;
//     } catch (err) {
//       console.error('Reverse geocoding error:', err);
//       setError('Unable to fetch location details. Please try again.');
//       return null;
//     }
//   };

//   // Handle map click
//   const handleLocationSelect = async (lat: number, lng: number) => {
//     setMarkerPosition([lat, lng]);
//     await reverseGeocode(lat, lng);
//   };

//   // Search location by name
//   const handleSearch = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!searchQuery.trim()) return;

//     setIsSearching(true);
//     setError('');

//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//           searchQuery + ', India'
//         )}&limit=1&addressdetails=1`
//       );
//       const data = await response.json();

//       if (data.length === 0) {
//         setError('Location not found. Please try another search.');
//         return;
//       }

//       const result = data[0];
//       const lat = parseFloat(result.lat);
//       const lng = parseFloat(result.lon);

//       setMapCenter([lat, lng]);
//       setMarkerPosition([lat, lng]);
//       await reverseGeocode(lat, lng);
//     } catch (err) {
//       console.error('Search error:', err);
//       setError('Search failed. Please try again.');
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   // Get current location
//   const handleUseCurrentLocation = () => {
//     if (!navigator.geolocation) {
//       setError('Geolocation is not supported by your browser');
//       return;
//     }

//     setIsGettingLocation(true);
//     setError('');

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const lat = position.coords.latitude;
//         const lng = position.coords.longitude;

//         setMapCenter([lat, lng]);
//         setMarkerPosition([lat, lng]);
//         await reverseGeocode(lat, lng);
//         setIsGettingLocation(false);
//       },
//       (err) => {
//         console.error('Geolocation error:', err);
//         setError('Unable to get your location. Please search manually or allow location access.');
//         setIsGettingLocation(false);
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 5000,
//         maximumAge: 0,
//       }
//     );
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-2xl font-bold text-gray-900">Select Your Location</h2>
//         <p className="text-gray-600 mt-1">
//           Search for your city or use current location, then click on the map to pinpoint your exact location
//         </p>
//       </div>

//       {/* Search and Current Location */}
//       <div className="space-y-3">
//         {/* <form id="location-info-form" onSubmit={handleSearch} className="flex gap-2"> */}
//         <form onSubmit={handleSearch} className="flex gap-2">
//           <div className="flex-1 relative">
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search for your city (e.g., Kolkata, Mumbai)"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//             />
//             {isSearching && (
//               <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-gray-400" />
//             )}
//           </div>
//           <button
//             type="submit"
//             disabled={isSearching || !searchQuery.trim()}
//             className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center gap-2"
//           >
//             <MapPin className="w-4 h-4" />
//             Search
//           </button>
//         </form>

//         <button
//           type="button"
//           onClick={handleUseCurrentLocation}
//           disabled={isGettingLocation}
//           className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 font-medium flex items-center justify-center gap-2"
//         >
//           {isGettingLocation ? (
//             <>
//               <Loader2 className="w-5 h-5 animate-spin" />
//               Getting your location...
//             </>
//           ) : (
//             <>
//               <Navigation className="w-5 h-5" />
//               Use Current Location
//             </>
//           )}
//         </button>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
//           {error}
//         </div>
//       )}

//       {/* Map */}
//       <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
//         <MapContainer
//           center={mapCenter}
//           zoom={5}
//           style={{ height: '400px', width: '100%' }}
//           className="z-0"
//         >
//           <TileLayer
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />
//           <MapClickHandler onLocationSelect={handleLocationSelect} />
//           <FlyToLocation center={mapCenter} />
//           {markerPosition && <Marker position={markerPosition} />}
//         </MapContainer>
//       </div>

//       {/* Location Details */}
//       {locationDetails && (
//         <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
//           <h3 className="font-semibold text-green-900 flex items-center gap-2">
//             <MapPin className="w-5 h-5" />
//             Selected Location
//           </h3>
//           <div className="grid grid-cols-2 gap-2 text-sm">
//             <div>
//               <span className="text-gray-600">State:</span>
//               <p className="font-medium text-gray-900">{locationDetails.state}</p>
//             </div>
//             <div>
//               <span className="text-gray-600">City:</span>
//               <p className="font-medium text-gray-900">{locationDetails.city}</p>
//             </div>
//             <div className="col-span-2">
//               <span className="text-gray-600">Address:</span>
//               <p className="font-medium text-gray-900">{locationDetails.locationName}</p>
//             </div>
//             <div>
//               <span className="text-gray-600">Latitude:</span>
//               <p className="font-medium text-gray-900">{locationDetails.latitude.toFixed(6)}</p>
//             </div>
//             <div>
//               <span className="text-gray-600">Longitude:</span>
//               <p className="font-medium text-gray-900">{locationDetails.longitude.toFixed(6)}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Instructions */}
//       <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//         <h4 className="font-semibold text-blue-900 mb-2">How to select your location:</h4>
//         <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
//           <li>Search for your city in the search box above, OR</li>
//           <li>Click "Use Current Location" to auto-detect, OR</li>
//           <li>Click directly on the map to select any location</li>
//           <li>The map will automatically extract your state, city, and address</li>
//         </ul>
//       </div>
//     </div>
//   )
// }