
// import React, { useRef, useEffect, useState } from 'react';

// import {
//   View,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
//   Image,
//   Platform,
// } from 'react-native';
// import MapView, {
//   Marker,
//   Polyline,
//   PROVIDER_GOOGLE,
//   PROVIDER_DEFAULT,
// } from 'react-native-maps';
// import { Car, Store, User } from 'lucide-react-native';
// import { ms, hp, fontSize } from '../../utils/responsive';
// import Colors from '../../utils/colors';
// import { Typography } from '../../utils/typography';
// import { logger } from '../../utils/logger';

// // ── Types ─────────────────────────────────────────────────────────────────────
// interface Coords {
//   latitude: number;
//   longitude: number;
// }

// interface MapRegion {
//   latitude: number;
//   longitude: number;
//   latitudeDelta: number;
//   longitudeDelta: number;
// }

// interface Props {
//   runnerCoords: Coords | null;
//   targetLat: number | null;
//   targetLng: number | null;
//   outletLat?: number | null;
//   outletLng?: number | null;
//   customerLat?: number | null;
//   customerLng?: number | null;
//   mapRegion: MapRegion | null;
//   isPickedUp: boolean;
//   outletName: string;
//   outletImage?: string;
//   runnerImage?: string;
//   routeCoordinates?: Coords[];
//   isRouteLoading?: boolean;
//   isLoading?: boolean;
//   customerName?: string;
//   customerImage?: string;
// }

// // ── Constants ─────────────────────────────────────────────────────────────────
// // S3 objects without Content-Type need this header so RN renders them
// const IMAGE_HEADERS = { Accept: 'image/jpeg, image/png, image/webp, image/*' };
// const RUNNER_ZOOM_DELTA = 0.004;
// const TRACK_IMAGE_TIMEOUT_MS = 3000;

// // ── Helpers ───────────────────────────────────────────────────────────────────
// const isValidCoord = (val: number | null | undefined): val is number =>
//   val !== null && val !== undefined && !isNaN(val) && val !== 0;

// // ── MapMarkerImage ────────────────────────────────────────────────────────────
// interface MarkerImageProps {
//   uri?: string;
//   style: object;
//   onLoadComplete: () => void;
//   fallback: React.ReactNode;
// }

// const MapMarkerImage: React.FC<MarkerImageProps> = ({
//   uri,
//   style,
//   onLoadComplete,
//   fallback,
// }) => {
//   const [error, setError] = useState(false);

//   // Reset error state when URI changes
//   useEffect(() => {
//     setError(false);
//   }, [uri]);

//   return (
//     <View style={style}>
//       {uri && !error ? (
//         <Image
//           source={{ uri, headers: IMAGE_HEADERS }}
//           style={StyleSheet.absoluteFill}
//           resizeMode="cover"
//           onLoad={onLoadComplete}
//           onError={() => {
//             setError(true);
//             onLoadComplete();
//           }}
//         />
//       ) : (
//         fallback
//       )}
//     </View>
//   );
// };

// // ── MapViewComponent ──────────────────────────────────────────────────────────
// const MapViewComponent: React.FC<Props> = ({
//   runnerCoords,
//   targetLat,
//   targetLng,
//   outletLat,
//   outletLng,
//   customerLat,
//   customerLng,
//   mapRegion,
//   isPickedUp,
//   outletName,
//   outletImage,
//   runnerImage,
//   routeCoordinates,
//   isLoading,
//   customerName,
//   customerImage,
// }) => {
//   const mapRef = useRef<MapView>(null);

//   // tracksViewChanges must be true while image is loading, then false for perf
//   const [trackRunner, setTrackRunner] = useState(true);
//   const [trackTarget, setTrackTarget] = useState(true);

//   const targetImageUri = isPickedUp ? customerImage : outletImage;

//   // ── Validate coords ──────────────────────────────────────────────────────
//   const validTarget = isValidCoord(targetLat) && isValidCoord(targetLng);
//   const validOutlet = isValidCoord(outletLat) && isValidCoord(outletLng);
//   const validCustomer = isValidCoord(customerLat) && isValidCoord(customerLng);
//   const validRunner =
//     runnerCoords !== null &&
//     isValidCoord(runnerCoords?.latitude) &&
//     isValidCoord(runnerCoords?.longitude);

//   // ── Reset target image tracking on URI change ────────────────────────────
//   useEffect(() => {
//     setTrackTarget(true);
//     const timer = setTimeout(() => setTrackTarget(false), TRACK_IMAGE_TIMEOUT_MS);
//     return () => clearTimeout(timer);
//   }, [targetImageUri]);

//   // ── Fit all known points in frame ────────────────────────────────────────
//   useEffect(() => {
//     if (!mapRef.current || !validRunner) return;

//     const points: Coords[] = [
//       {
//         latitude: runnerCoords!.latitude,
//         longitude: runnerCoords!.longitude,
//       },
//     ];

//     if (validOutlet) {
//       points.push({
//         latitude: outletLat as number,
//         longitude: outletLng as number,
//       });
//     }

//     if (validCustomer) {
//       points.push({
//         latitude: customerLat as number,
//         longitude: customerLng as number,
//       });
//     }

//     logger.log('[MapView] fitting points:', points.length);

//     if (points.length > 1) {
//       mapRef.current.fitToCoordinates(points, {
//         edgePadding: { top: 80, right: 60, bottom: 80, left: 60 },
//         animated: true,
//       });
//     } else {
//       // Only runner known — zoom to street level
//       mapRef.current.animateToRegion(
//         {
//           latitude: runnerCoords!.latitude,
//           longitude: runnerCoords!.longitude,
//           latitudeDelta: RUNNER_ZOOM_DELTA,
//           longitudeDelta: RUNNER_ZOOM_DELTA,
//         },
//         400,
//       );
//     }
//   }, [
//     validRunner,
//     validOutlet,
//     validCustomer,
//     runnerCoords?.latitude,
//     runnerCoords?.longitude,
//     outletLat,
//     outletLng,
//     customerLat,
//     customerLng,
//   ]);

//   // ── Loading state ────────────────────────────────────────────────────────
//   if (isLoading || !mapRegion) {
//     return (
//       <View style={[styles.map, styles.fallback]}>
//         <ActivityIndicator color={Colors.orange} />
//         <Text style={styles.fallbackText}>Loading map...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.mapWrapper}>
//       <MapView
//         ref={mapRef}
//         // provider={
//         //   Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
//         // }
//         provider={PROVIDER_GOOGLE}
//         style={styles.map}
//         initialRegion={mapRegion}
//         scrollEnabled
//         zoomEnabled
//       >
//         {/* ── Runner marker ──────────────────────────────────────────────── */}
//         {validRunner && (
//           <Marker
//             coordinate={{
//               latitude: runnerCoords!.latitude,
//               longitude: runnerCoords!.longitude,
//             }}
//             anchor={{ x: 0.5, y: 0.5 }}
//             tracksViewChanges={trackRunner}
//           >
//             <MapMarkerImage
//               uri={runnerImage}
//               style={styles.runnerWrapper}
//               onLoadComplete={() => setTrackRunner(false)}
//               fallback={<Car size={ms(22)} color={Colors.white} />}
//             />
//           </Marker>
//         )}

//         {/* ── Target marker (outlet → customer based on isPickedUp) ───────── */}
//         {validTarget && (
//           <Marker
//             coordinate={{
//               latitude: targetLat as number,
//               longitude: targetLng as number,
//             }}
//             anchor={{ x: 0.5, y: 0.5 }}
//             tracksViewChanges={trackTarget}
//           >
//             <MapMarkerImage
//               uri={targetImageUri}
//               style={styles.markerWrapper}
//               onLoadComplete={() => setTrackTarget(false)}
//               fallback={
//                 isPickedUp ? (
//                   <User size={ms(22)} color={Colors.white} />
//                 ) : (
//                   <Store size={ms(22)} color={Colors.white} />
//                 )
//               }
//             />
//           </Marker>
//         )}

//         {/* ── Route polyline ──────────────────────────────────────────────── */}
//         {routeCoordinates && routeCoordinates.length > 1 && (
//           <Polyline
//             coordinates={routeCoordinates}
//             strokeColor={Colors.orange}
//             strokeWidth={3}
//           />
//         )}
//       </MapView>
//     </View>
//   );
// };

// export default MapViewComponent;

// // ── Styles ────────────────────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   mapWrapper: { width: '100%', height: hp(38) },
//   map: { width: '100%', height: hp(60) },
//   fallback: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   fallbackText: {
//     fontSize: fontSize(13),
//     fontFamily: Typography.Regular.fontFamily,
//     marginTop: 10,
//     color: Colors.borderColor1,
//   },
//   markerWrapper: {
//     width: ms(40),
//     height: ms(40),
//     borderRadius: ms(20),
//     borderWidth: 2,
//     borderColor: Colors.white,
//     backgroundColor: Colors.orange,
//     justifyContent: 'center',
//     alignItems: 'center',
//     overflow: 'hidden',
//   },
//   runnerWrapper: {
//     width: ms(36),
//     height: ms(36),
//     borderRadius: ms(18),
//     borderWidth: 2,
//     borderColor: Colors.white,
//     backgroundColor: Colors.orange,
//     justifyContent: 'center',
//     alignItems: 'center',
//     overflow: 'hidden',
//   },
// });

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
import { Car, Store, User, Crosshair } from 'lucide-react-native';
import { ms, hp, vs, fontSize } from '../../utils/responsive';
import Colors from '../../utils/colors';
import { Typography } from '../../utils/typography';
import { logger } from '../../utils/logger';

// ── Types ─────────────────────────────────────────────────────────────────────
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

interface Props {
  runnerCoords: Coords | null;
  targetLat: number | null;
  targetLng: number | null;
  outletLat?: number | null;
  outletLng?: number | null;
  customerLat?: number | null;
  customerLng?: number | null;
  mapRegion: MapRegion | null;
  isPickedUp: boolean;
  outletName: string;
  outletImage?: string;
  runnerImage?: string;
  routeCoordinates?: Coords[];
  isRouteLoading?: boolean;
  isLoading?: boolean;
  customerName?: string;
  customerImage?: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const IMAGE_HEADERS = { Accept: 'image/jpeg, image/png, image/webp, image/*' };
const RUNNER_ZOOM_DELTA = 0.004;
const TRACK_IMAGE_TIMEOUT_MS = 3000;

// ── Helpers ───────────────────────────────────────────────────────────────────
const isValidCoord = (val: number | null | undefined): val is number =>
  val !== null && val !== undefined && !isNaN(val) && val !== 0;

// ── MapMarkerImage ────────────────────────────────────────────────────────────
interface MarkerImageProps {
  uri?: string;
  style: object;
  onLoadComplete: () => void;
  fallback: React.ReactNode;
}

const MapMarkerImage: React.FC<MarkerImageProps> = ({
  uri,
  style,
  onLoadComplete,
  fallback,
}) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [uri]);

  return (
    <View style={style}>
      {uri && !error ? (
        <Image
          source={{ uri, headers: IMAGE_HEADERS }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          onLoad={onLoadComplete}
          onError={() => {
            setError(true);
            onLoadComplete();
          }}
        />
      ) : (
        fallback
      )}
    </View>
  );
};

// ── MapViewComponent ──────────────────────────────────────────────────────────
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
  outletImage,
  runnerImage,
  routeCoordinates,
  isLoading,
  customerImage,
}) => {
  const mapRef = useRef<MapView>(null);

  const [trackRunner, setTrackRunner] = useState(true);
  const [trackTarget, setTrackTarget] = useState(true);
  // ── Shows recenter button only after user pans away ───────────────────────
  const [userPanned, setUserPanned] = useState(false);

  const targetImageUri = isPickedUp ? customerImage : outletImage;

  // ── Validate coords ──────────────────────────────────────────────────────
  const validTarget   = isValidCoord(targetLat)  && isValidCoord(targetLng);
  const validOutlet   = isValidCoord(outletLat)  && isValidCoord(outletLng);
  const validCustomer = isValidCoord(customerLat) && isValidCoord(customerLng);
  const validRunner   =
    runnerCoords !== null &&
    isValidCoord(runnerCoords?.latitude) &&
    isValidCoord(runnerCoords?.longitude);

  // ── Reset target image tracking on URI change ────────────────────────────
  useEffect(() => {
    setTrackTarget(true);
    const timer = setTimeout(() => setTrackTarget(false), TRACK_IMAGE_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [targetImageUri]);

  // ── Auto-fit on mount / coord changes (skip if user has panned) ──────────
  useEffect(() => {
    if (!mapRef.current || !validRunner || userPanned) return;
    fitAllPoints();
  }, [
    validRunner,
    validOutlet,
    validCustomer,
    runnerCoords?.latitude,
    runnerCoords?.longitude,
    outletLat,
    outletLng,
    customerLat,
    customerLng,
  ]);

  // ── Fit all known points — reused by auto-fit and recenter button ─────────
  const fitAllPoints = () => {
    if (!mapRef.current || !validRunner) return;

    const points: Coords[] = [
      {
        latitude:  runnerCoords!.latitude,
        longitude: runnerCoords!.longitude,
      },
    ];

    if (validOutlet) {
      points.push({
        latitude:  outletLat as number,
        longitude: outletLng as number,
      });
    }
    if (validCustomer) {
      points.push({
        latitude:  customerLat as number,
        longitude: customerLng as number,
      });
    }

    logger.log('[MapView] fitting points:', points.length);

    if (points.length > 1) {
      mapRef.current.fitToCoordinates(points, {
        edgePadding: { top: 80, right: 60, bottom: 80, left: 60 },
        animated: true,
      });
    } else {
      mapRef.current.animateToRegion(
        {
          latitude:       runnerCoords!.latitude,
          longitude:      runnerCoords!.longitude,
          latitudeDelta:  RUNNER_ZOOM_DELTA,
          longitudeDelta: RUNNER_ZOOM_DELTA,
        },
        400,
      );
    }
  };

  // ── Recenter button ───────────────────────────────────────────────────────
  const handleRecenter = () => {
    setUserPanned(false);
    fitAllPoints();
  };

  // ── Loading state ────────────────────────────────────────────────────────
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
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={mapRegion}
        scrollEnabled
        zoomEnabled
        // ── Detect manual pan → show recenter button ──────────────────────
        onPanDrag={() => {
          if (!userPanned) setUserPanned(true);
        }}
      >
        {/* ── Runner marker ──────────────────────────────────────────────── */}
        {validRunner && (
          <Marker
            coordinate={{
              latitude:  runnerCoords!.latitude,
              longitude: runnerCoords!.longitude,
            }}
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

        {/* ── Target marker (outlet → customer) ───────────────────────────── */}
        {validTarget && (
          <Marker
            coordinate={{
              latitude:  targetLat as number,
              longitude: targetLng as number,
            }}
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={trackTarget}
          >
            <MapMarkerImage
              uri={targetImageUri}
              style={styles.markerWrapper}
              onLoadComplete={() => setTrackTarget(false)}
              fallback={
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

      {/* ── Recenter button — shown only after user pans away ──────────────── */}
      {userPanned && validRunner && (
        <TouchableOpacity
          style={styles.recenterButton}
          onPress={handleRecenter}
          activeOpacity={0.85}
        >
          <Crosshair size={ms(20)} color={Colors.orange} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MapViewComponent;

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  mapWrapper: {
    width: '100%',
    flex: 1,          // fills the height given by parent (MAP_HEIGHT from CustomerInfoScreen)
  },
  map: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  fallbackText: {
    fontSize: fontSize(13),
    fontFamily: Typography.Regular.fontFamily,
    marginTop: 10,
    color: Colors.borderColor1,
  },
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

  // ── Recenter button ────────────────────────────────────────────────────────
  recenterButton: {
    position: 'absolute',
    bottom: vs(16),
    right: ms(16),
    width: ms(44),
    height: ms(44),
    borderRadius: ms(22),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // Android shadow
    elevation: 5,
  },
});