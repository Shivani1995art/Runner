import { useState, useCallback, useMemo, useEffect } from 'react';
import { Platform } from 'react-native';
import LocationService from './LocationModule.android';
import { useUserLocation } from './useUserLocation';
import { getDistanceFromLatLng } from '../utils/distanceUtils';
import { getRoute } from '../services/routing/routing.service';
import { logger } from '../utils/logger';

interface Coords {
  latitude: number;
  longitude: number;
}

interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export const useMapLocation = (
  initialTargetLat?: number | null,
  initialTargetLng?: number | null,
) => {
  const [targetLat, setTargetLat] = useState(initialTargetLat);
  const [targetLng, setTargetLng] = useState(initialTargetLng);
  const [runnerCoords, setRunnerCoords] = useState<Coords | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const { refetch: fetchIOSLocation } = useUserLocation();
  const [routeCoords, setRouteCoords] = useState<Coords[]>([]);
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  useEffect(() => {
    setTargetLat(initialTargetLat);
  }, [initialTargetLat]);

  useEffect(() => {
    setTargetLng(initialTargetLng);
  }, [initialTargetLng]);

  const fetchRunnerLocation = useCallback(async () => {
    try {
      setIsLoadingLocation(true);
      logger.log('fetchRunnerLocation called, platform:', Platform.OS);

      if (Platform.OS === 'android') {
        const loc = await LocationService.getCurrentLocation();
        logger.log('android loc =>', loc);
        if (loc?.latitude && loc?.longitude) {
          setRunnerCoords({ latitude: loc.latitude, longitude: loc.longitude });
        }
      } else {
        const loc = await fetchIOSLocation();
        logger.log('ios loc =>', loc);
        if (loc?.latitude && loc?.longitude) {
          setRunnerCoords({ latitude: loc.latitude, longitude: loc.longitude });
        }
      }
    } catch (e) {
      logger.log('fetchRunnerLocation error', e);
    } finally {
      setIsLoadingLocation(false);
    }
  }, []);

  // ── Fetch route between runner and target ───────
  const fetchRoute = useCallback(async (
    nextTargetLat: number,
    nextTargetLng: number,
  ) => {
    if (!runnerCoords) {
      return;
    }

    try {
      setIsRouteLoading(true);
      const coords = await getRoute(runnerCoords, {
        latitude: nextTargetLat,
        longitude: nextTargetLng,
      });
      setRouteCoords(coords);
    } catch (e) {
      logger.log('fetchRoute error', e);
      setRouteCoords([runnerCoords, { latitude: nextTargetLat, longitude: nextTargetLng }]);
    } finally {
      setIsRouteLoading(false);
    }
  }, [runnerCoords]);



  // ✅ Reactive — recomputes when runnerCoords OR target changes
  const mapRegion = useMemo((): MapRegion | null => {
    logger.log('mapRegion computing =>', { runnerCoords, targetLat, targetLng });

    if (runnerCoords && targetLat && targetLng) {
      return {
        latitude:       (runnerCoords.latitude + targetLat) / 2,
        longitude:      (runnerCoords.longitude + targetLng) / 2,
        latitudeDelta:  Math.abs(runnerCoords.latitude - targetLat) * 2.5 + 0.01,
        longitudeDelta: Math.abs(runnerCoords.longitude - targetLng) * 2.5 + 0.01,
      };
    }

    if (targetLat && targetLng) {
      return {
        latitude:       targetLat,
        longitude:      targetLng,
        latitudeDelta:  0.01,
        longitudeDelta: 0.01,
      };
    }

    return null;
  }, [runnerCoords, targetLat, targetLng]);

  // ✅ Reactive — recomputes when runnerCoords OR target changes
  const distance = useMemo((): string => {
    logger.log('distance computing =>', { runnerCoords, targetLat, targetLng });

    if (runnerCoords && targetLat && targetLng) {
      return getDistanceFromLatLng(
        runnerCoords.latitude,
        runnerCoords.longitude,
        targetLat,
        targetLng,
      );
    }
    return '—';
  }, [runnerCoords, targetLat, targetLng]);

  return {
     runnerCoords,
     routeCoords,    
     isLoadingLocation,
     isRouteLoading,
     fetchRunnerLocation,
     fetchRoute,     
     mapRegion,
     distance,
  };
};