import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, Platform } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import { Car, UserCircle, Store, User } from 'lucide-react-native';
import { ms, hp, fontSize } from '../../utils/responsive';
import Colors from '../../utils/colors';
import { Typography } from '../../utils/typography';
import { logger } from '../../utils/logger';

interface Coords { latitude: number; longitude: number; }
interface MapRegion { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number; }

interface Props {
  runnerCoords:      Coords | null;
  targetLat:         number | null;   // current target (outlet OR customer depending on isPickedUp)
  targetLng:         number | null;
  // ── Pass BOTH fixed points so map always frames the full property ──────────
  outletLat?:        number | null;   // Outlet.location_lat
  outletLng?:        number | null;   // Outlet.location_lng
  customerLat?:      number | null;   // order.delivery_lat
  customerLng?:      number | null;   // order.delivery_lng
  // ──────────────────────────────────────────────────────────────────────────
  mapRegion:         MapRegion | null;
  isPickedUp:        boolean;
  outletName:        string;
  outletImage?:      string;
  runnerImage?:      string;
  routeCoordinates?: Coords[];
  isRouteLoading?:   boolean;
  isLoading?:        boolean;
  customerName?:     string;
  customerImage?:    string;
}

// S3 objects without a Content-Type need this so RN renders them
const IMAGE_HEADERS = { Accept: 'image/jpeg, image/png, image/webp, image/*' };

// Fallback single-marker zoom
const RUNNER_ZOOM_DELTA = 0.004;

// ─── MapMarkerImage ───────────────────────────────────────────────────────────
const MapMarkerImage = ({
  uri,
  style,
  onLoadComplete,
  fallback,
}: {
  uri?: string;
  style: object;
  onLoadComplete: () => void;
  fallback: React.ReactNode;
}) => {
  const [error, setError] = useState(false);
  return (
    <View style={style}>
      {uri && !error ? (
        <Image
          source={{ uri, headers: IMAGE_HEADERS }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          onLoad={onLoadComplete}
          onError={() => { setError(true); onLoadComplete(); }}
        />
      ) : fallback}
    </View>
  );
};

const MapViewComponent: React.FC<Props> = ({
  runnerCoords,
  targetLat,
  targetLng,
  outletLat,
  outletLng,
  customerLat,
  customerLng,
  mapRegion,
  isPickedUp,
  outletName,
  outletImage,
  runnerImage,
  routeCoordinates,
  isLoading,
  customerName,
  customerImage,
}) => {
  logger.log('======isPickedUp=========',isPickedUp)
  const mapRef = useRef<MapView>(null);
  const [trackRunner, setTrackRunner] = useState(true);
  const [trackTarget, setTrackTarget] = useState(true);

  const targetImageUri = isPickedUp ? customerImage : outletImage;
  logger.log('======targetImageUri=========',targetImageUri)
// Reset tracking whenever the image URI changes
useEffect(() => {
  setTrackTarget(true);
  // Optional: Safety timeout to turn off tracking if onLoad fails
  const timer = setTimeout(() => setTrackTarget(false), 3000);
  return () => clearTimeout(timer);
}, [targetImageUri]);

  // ── Fit ALL known points in frame ──────────────────────────────────────────
  // Build a coordinate list from every non-null point we have:
  //   runner  → always present (GPS)
  //   outlet  → fixed from Outlet.location_lat / location_lng
  //   customer→ fixed from order.delivery_lat / delivery_lng
  // fitToCoordinates will calculate the tightest zoom that shows all of them.
  // edgePadding: 60 keeps markers away from the edges but still zoomed in well.
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !runnerCoords) return;

    const points: Coords[] = [
      { latitude: runnerCoords.latitude, longitude: runnerCoords.longitude },
    ];

    if (outletLat && outletLng) {
      points.push({ latitude: outletLat, longitude: outletLng });
    }

    if (customerLat && customerLng) {
      points.push({ latitude: customerLat, longitude: customerLng });
    }

    if (points.length > 1) {
      // Multiple points — fit them all
      mapRef.current.fitToCoordinates(points, {
        edgePadding: { top: 60, right: 60, bottom: 60, left: 60 },
        animated: true,
      });
    } else {
      // Only runner known — center on it at street level
      mapRef.current.fitToCoordinates(points, {
        edgePadding: { top: 120, right: 120, bottom: 120, left: 120 }, // ← tighter zoom
        animated: true,
      });
      mapRef.current.animateToRegion(
        {
          latitude:       runnerCoords.latitude,
          longitude:      runnerCoords.longitude,
          latitudeDelta:  RUNNER_ZOOM_DELTA,
          longitudeDelta: RUNNER_ZOOM_DELTA,
        },
        400,
      );
    }
  }, [runnerCoords, outletLat, outletLng, customerLat, customerLng]);

  if (isLoading || !mapRegion) {
    return (
      <View style={[styles.map, styles.fallback]}>
        <ActivityIndicator color={Colors.orange} />
        <Text style={styles.fallbackText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.mapWrapper}>
      <MapView
        ref={mapRef}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={mapRegion}
        scrollEnabled
        zoomEnabled
      >
        {/* ── Runner marker ──────────────────────────────────────────────── */}
        {runnerCoords && (
          <Marker
            coordinate={runnerCoords}
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={trackRunner}
          >
            <MapMarkerImage
              uri={runnerImage}
              style={styles.runnerWrapper}
              onLoadComplete={() => setTrackRunner(false)}
              fallback={<Car size={ms(22)} color={Colors.white} />}
            />
          </Marker>
        )}

        {/* ── Target marker (outlet before pickup / customer after) ───────── */}
        {/* ── Target Marker ──
  This marker represents the destination. 
  - Before pickup: Shows the Outlet location/image.
  - After pickup: Shows the Customer location/image.
*/}
{targetLat && targetLng && (
  <Marker
    coordinate={{ latitude: targetLat, longitude: targetLng }}
    anchor={{ x: 0.5, y: 0.5 }}
    // tracksViewChanges is true until the image loads to optimize performance
    tracksViewChanges={trackTarget}
  >
    <MapMarkerImage
      // targetImageUri is dynamically set above based on isPickedUp state
    uri={targetImageUri}
      style={styles.markerWrapper}
      onLoadComplete={() => setTrackTarget(false)}
      fallback={
        /* If no image is provided or it fails to load, 
           switch the icon based on whether the order is picked up.
        */
        isPickedUp ? (
          <User size={ms(22)} color={Colors.white} />
        ) : (
          <Store size={ms(22)} color={Colors.white} />
        )
      }
    />
  </Marker>
)}

        {/* ── Route polyline ──────────────────────────────────────────────── */}
        {routeCoordinates && routeCoordinates.length > 1 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={Colors.orange}
            strokeWidth={3}
          />
        )}
      </MapView>
    </View>
  );
};

export default MapViewComponent;

const styles = StyleSheet.create({
  mapWrapper:   { width: '100%', height: hp(38) },
  map:          { width: '100%', height: hp(38) },
  fallback:     { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  fallbackText: { fontSize: fontSize(13), fontFamily: Typography.Regular.fontFamily, marginTop: 10 },
  markerWrapper: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    borderWidth: 2,
    borderColor: Colors.white,
    backgroundColor: Colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  runnerWrapper: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    borderWidth: 2,
    borderColor: Colors.white,
    backgroundColor: Colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});