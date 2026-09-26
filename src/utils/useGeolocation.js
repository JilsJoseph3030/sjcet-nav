import { useState, useEffect } from 'react';

// SJCET Palai - St. Francis Block approximate GPS coordinates
const TARGET_LAT = 9.7288;
const TARGET_LNG = 76.6836;
const GEOFENCE_RADIUS_METERS = 50;

// Haversine formula to calculate physical distance between two GPS points
function getDistanceInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const p1 = lat1 * Math.PI/180;
  const p2 = lat2 * Math.PI/180;
  const dp = (lat2-lat1) * Math.PI/180;
  const dl = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(dp/2) * Math.sin(dp/2) +
          Math.cos(p1) * Math.cos(p2) *
          Math.sin(dl/2) * Math.sin(dl/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

export function useGeolocation() {
  const [isOutside, setIsOutside] = useState(false);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    // Attempt to get user's current GPS location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const distance = getDistanceInMeters(latitude, longitude, TARGET_LAT, TARGET_LNG);
        
        // If they are further than 50 meters from the building, flag them as outside
        if (distance > GEOFENCE_RADIUS_METERS) {
          setIsOutside(true);
        } else {
          setIsOutside(false);
        }
      },
      (error) => {
        setLocationError(error.message);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );
  }, []);

  const openGoogleMaps = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${TARGET_LAT},${TARGET_LNG}`, '_blank');
  };

  return { isOutside, setIsOutside, locationError, openGoogleMaps };
}
