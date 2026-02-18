import { logger } from '../../utils/logger';

interface Coords {
  latitude: number;
  longitude: number;
}

const GOOGLE_DIRECTIONS_API_KEY = 'AIzaSyB86YAlLXOle7pLu-oAwrDdAT7b9S9_vKY';

// ── Decode Google encoded polyline ─────────────
function decodePolyline(encoded: string): Coords[] {
  const coords: Coords[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte: number;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    lat += result & 1 ? ~(result >> 1) : result >> 1;

    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    lng += result & 1 ? ~(result >> 1) : result >> 1;

    coords.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5,
    });
  }

  return coords;
}

export const getRoute = async (
  origin: Coords,
  destination: Coords
): Promise<Coords[]> => {
  try {
    // ✅ Routes API (New) — replaces legacy Directions API
    const response = await fetch(
      'https://routes.googleapis.com/directions/v2:computeRoutes',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_DIRECTIONS_API_KEY,
          // ✅ Required field mask for Routes API
          'X-Goog-FieldMask': 'routes.polyline.encodedPolyline',
        },
        body: JSON.stringify({
          origin: {
            location: {
              latLng: {
                latitude:  origin.latitude,
                longitude: origin.longitude,
              },
            },
          },
          destination: {
            location: {
              latLng: {
                latitude:  destination.latitude,
                longitude: destination.longitude,
              },
            },
          },
          travelMode: 'DRIVE',
          routingPreference: 'TRAFFIC_AWARE',
        }),
      }
    );

    const data = await response.json();
    logger.log('Routes API response:', data);

    if (data?.routes?.length > 0) {
      const encodedPolyline = data.routes[0]?.polyline?.encodedPolyline;
      if (!encodedPolyline) {
        logger.log('Routes API missing encodedPolyline:', data.routes[0]);
        return [origin, destination];
      }

      const coordinates = decodePolyline(encodedPolyline);
      logger.log('Route fetched:', coordinates.length, 'points');
      return coordinates;
    }

    logger.log('Routes API no routes:', data);
    return [origin, destination]; // fallback
  } catch (error) {
    logger.log('getRoute error:', error);
    return [origin, destination]; // fallback
  }
};
