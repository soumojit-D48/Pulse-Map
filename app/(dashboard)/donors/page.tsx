

// app/find-donors/page.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2, MapPin, Phone, User, Clock, AlertCircle } from 'lucide-react';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createBloodGroupIcon = (bloodGroup: string, available: boolean) => {
  const color = available ? '#10b981' : '#6b7280';
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

const userIcon = L.divIcon({
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

interface Donor {
  id: string;
  name: string;
  bloodGroup: string;
  available: boolean;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  locationName: string;
  phone: string | null;
  distance: number;
  distanceText: string;
  lastActive: string;
  eligible: boolean;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

const BLOOD_GROUPS = [
  'ALL',
  'A_POSITIVE',
  'A_NEGATIVE',
  'B_POSITIVE',
  'B_NEGATIVE',
  'AB_POSITIVE',
  'AB_NEGATIVE',
  'O_POSITIVE',
  'O_NEGATIVE',
];

const BLOOD_GROUP_LABELS: { [key: string]: string } = {
  ALL: 'All Groups',
  A_POSITIVE: 'A+',
  A_NEGATIVE: 'A-',
  B_POSITIVE: 'B+',
  B_NEGATIVE: 'B-',
  AB_POSITIVE: 'AB+',
  AB_NEGATIVE: 'AB-',
  O_POSITIVE: 'O+',
  O_NEGATIVE: 'O-',
};

export default function FindDonorsPage() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  const [donors, setDonors] = useState<Donor[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [bloodGroup, setBloodGroup] = useState('ALL');
  const [radius, setRadius] = useState(20);
  const [availableOnly, setAvailableOnly] = useState(true);

  // Debounce timer
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/sign-in');
      return;
    }

    if (userId) {
      fetchDonors();
    }
  }, [isLoaded, userId, router, bloodGroup, availableOnly]);

  // Debounced radius change
  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      fetchDonors(newRadius);
    }, 500);

    setDebounceTimer(timer);
  };

  const fetchDonors = async (customRadius?: number) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        bloodGroup,
        radius: String(customRadius ?? radius),
        availableOnly: String(availableOnly),
      });

      const response = await fetch(`/api/donors/nearby?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch donors');
      }

      const data = await response.json();
      setDonors(data.donors);
      setUserLocation(data.userLocation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleContact = (phone: string | null) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  if (loading && !userLocation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Finding donors near you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-foreground">Find Donors</h1>
          <p className="text-muted-foreground">Search for blood donors in your area</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <div className="bg-card rounded-lg shadow-soft border border-border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Blood Group Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {BLOOD_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    {BLOOD_GROUP_LABELS[group]}
                  </option>
                ))}
              </select>
            </div>

            {/* Distance Radius Slider */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Distance Radius: {radius} km
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={radius}
                onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1 km</span>
                <span>50 km</span>
                <span>100 km</span>
              </div>
            </div>
          </div>

          {/* Available Only Toggle */}
          <div className="mt-4 flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              <span className="ml-3 text-sm font-medium text-foreground">
                Available Only
              </span>
            </label>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-muted-foreground">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </span>
            ) : (
              <span className="font-semibold">{donors.length} donor(s) found</span>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-4 mb-6 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <span className="text-red-700 dark:text-red-300">{error}</span>
          </div>
        )}

        {/* Map and List Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map */}
          <div className="bg-card rounded-lg shadow-soft border border-border overflow-hidden h-[600px]">
            {userLocation && (
              <MapContainer
                center={[userLocation.latitude, userLocation.longitude]}
                zoom={11}
                style={{ height: '100%', width: '100%' }}
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
                  icon={userIcon}
                >
                  <Popup>
                    <div className="text-center">
                      <p className="font-semibold">Your Location</p>
                    </div>
                  </Popup>
                </Marker>

                {/* Donor Markers */}
                {donors.map((donor) => (
                  <Marker
                    key={donor.id}
                    position={[donor.latitude, donor.longitude]}
                    icon={createBloodGroupIcon(
                      BLOOD_GROUP_LABELS[donor.bloodGroup],
                      donor.available
                    )}
                  >
                    <Popup>
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900">{donor.name}</p>
                        <p className="text-gray-600">{donor.bloodGroup}</p>
                        <p className="text-gray-500">{donor.distanceText} away</p>
                        <p className="text-xs text-gray-400">{donor.city}, {donor.state}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>

          {/* Donor List */}
          <div className="space-y-4 h-[600px] overflow-y-auto">
            {donors.length === 0 ? (
              <div className="bg-card rounded-lg shadow-soft border border-border p-12 text-center">
                <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium text-foreground">No donors found</h3>
                <p className="mt-2 text-muted-foreground">
                  Try increasing the search radius or changing filters
                </p>
              </div>
            ) : (
              donors.map((donor) => (
                <div key={donor.id} className="bg-card rounded-lg shadow-soft border border-border hover:shadow-glow transition p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{donor.name}</h3>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300">
                          {BLOOD_GROUP_LABELS[donor.bloodGroup]}
                        </span>
                        {donor.available ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-500/10 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-500/20">
                            Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-500/10 text-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-500/20">
                            Unavailable
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {donor.city}, {donor.state} • {donor.distanceText}
                        </p>
                        <p className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {donor.lastActive}
                        </p>
                        {!donor.eligible && (
                          <p className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                            <AlertCircle className="h-4 w-4" />
                            Recently donated (may not be eligible)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {donor.phone && (
                    <button
                      onClick={() => handleContact(donor.phone)}
                      className="mt-4 w-full px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      Contact Donor
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}