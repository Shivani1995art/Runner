// hooks/useUserLocation.ts - Updated with immediate mode
import { useState, useEffect, useRef } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { useAppPermissions } from './useAppPermissions';


interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface UseUserLocationReturn {
  location: LocationCoords | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<LocationCoords | null>; 
}

export const useUserLocation = (autoFetch = false): UseUserLocationReturn => {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);
  
  const { checkLocationPermission, requestLocationPermission } = useAppPermissions();

  const getCurrentLocationRef = useRef<() => Promise<LocationCoords | null>>(() => Promise.resolve(null));

  getCurrentLocationRef.current = async (): Promise<LocationCoords | null> => {
    if (!isMounted.current) return null;
    
    setLoading(true);
    setError(null);

    try {
      const hasPermission = await checkLocationPermission();
      if (!hasPermission) {
        setError('Location permission not granted');
        setLoading(false);
        return null;
        // Don't request permission here - let the permission flow handle it
        // const granted = await requestLocationPermission();
        // if (!granted) {
        //   setError('Location permission denied');
        //   setLoading(false);
        //   return null;
        // }
      }
      // Return a Promise that resolves with coordinates
      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (position) => {
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            
            if (isMounted.current) {
              setLocation(coords);
              setLoading(false);
            }
            resolve(coords); // Return immediately
          },
          (err) => {
            if (isMounted.current) {
              setError(err.message || 'Failed to get location');
              setLoading(false);
            }
            reject(err);
          },
          {
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 0,
          }
        );
      });
    } catch (err) {
      if (isMounted.current) {
        setError('Failed to get location');
        setLoading(false);
      }
      return null;
    }
  };

  const refetch = async () => {
    return await getCurrentLocationRef.current?.() || null;
  };

  useEffect(() => {
    isMounted.current = true;
    
    if (autoFetch) {
      getCurrentLocationRef.current?.();
    }

    return () => {
      isMounted.current = false;
    };
  }, []);

  return {
    location,
    loading,
    error,
    refetch,
  };
};

