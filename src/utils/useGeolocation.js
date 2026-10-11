import { useState, useEffect } from 'react';

// SJCET Palai - St. Francis Block approximate GPS coordinates
const TARGET_LAT = 9.7288;
const TARGET_LNG = 76.6836;
const GEOFENCE_RADIUS_METERS = 80;

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
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);

  useEffect(() => {
    // 1. Guard against environments where geolocation is unavailable
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser or environment.");
      return;
    }

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          try {
            if (!position || !position.coords) return;
            const { latitude, longitude } = position.coords;
            const distance = getDistanceInMeters(latitude, longitude, TARGET_LAT, TARGET_LNG);
            
            // Only trigger outside warning if genuinely far and coordinates are valid
            if (!isNaN(distance) && distance > GEOFENCE_RADIUS_METERS) {
              setIsOutside(true);
            } else {
              setIsOutside(false);
            }
            setLocationError(null);
            setIsPermissionDenied(false);
          } catch (err) {
            console.warn("Error computing GPS distance:", err);
          }
        },
        (error) => {
          // Graceful fallback: If GPS denied or timed out, do NOT lock the user out!
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setIsPermissionDenied(true);
              setLocationError("Location permission denied. Defaulting to indoor navigation mode.");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError("GPS position unavailable indoors. Continuing in local map mode.");
              break;
            case error.TIMEOUT:
              setLocationError("GPS request timed out. Continuing in local map mode.");
              break;
            default:
              setLocationError(error.message);
          }
          // Do not lock out user if GPS fails or is denied indoors
          setIsOutside(false);
        },
        { enableHighAccuracy: false, maximumAge: 60000, timeout: 6000 }
      );
    } catch (err) {
      console.warn("Geolocation invocation failed:", err);
      setLocationError("Unable to query location.");
      setIsOutside(false);
    }
  }, []);

  const openGoogleMaps = () => {
    try {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${TARGET_LAT},${TARGET_LNG}`, '_blank');
    } catch {
      window.location.href = `https://www.google.com/maps/dir/?api=1&destination=${TARGET_LAT},${TARGET_LNG}`;
    }
  };

  return { isOutside, setIsOutside, locationError, isPermissionDenied, openGoogleMaps };
}
