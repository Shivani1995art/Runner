

// import React, {
//   useEffect,
//   useState,
//   useContext,
//   useRef,
//   useCallback,
//   } from 'react';
// import {
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
//   ActivityIndicator,
//   Image,
//   Linking,
//   BackHandler,
//   Alert,
//   Platform,
// } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';

// import CustomerInfoCard from '../../components/cards/CustmerInfoCard';
// import InfoRow from '../../components/Row/InfoRow';
// import Colors from '../../utils/colors';
// import { fontSize, hp, ms, vs } from '../../utils/responsive';
// import { Typography } from '../../utils/typography';
// import { MapPin, Map, Store } from 'lucide-react-native';
// import CustomButton from '../../components/Buttons/CustomButton';
// import BottomGradientBottomSheet from '../../components/modals/BottomGradientBottomSheet';
// import SuccessModal from '../../components/modals/SuccessModal';
// import Greenticksvg from '../../assets/svg/Greenticksvg';
// import RenderItem from '../../components/RenderItem/RenderItem';

// import { useOrderDetail } from '../../hooks/useOrderDetail';
// import { pickedOrder } from '../../services/Orders/order.api';
// import { logger } from '../../utils/logger';
// import { useMapLocation } from '../../hooks/useMapLocation';
// import MapViewComponent from '../../components/Map/MapViewComponent';
// import { AuthContext } from '../../context/AuthContext';
// import { useToast } from '../../hooks/ToastProvider';
// import LocationService from '../../hooks/LocationModule.android'
// import { useUserLocation } from '../../hooks/useUserLocation';
// import OutletInfoCard from '../../components/cards/OutletInfoCard';
// // ── Helper: safely parse a coordinate value ───────────────────────────────────
// const safeCoord = (val: any): number | null => {
//   const n = parseFloat(val);
//   return isNaN(n) || n === 0 ? null : n;
// };

// // ── CustomerInfoScreen ────────────────────────────────────────────────────────
// const CustomerInfoScreen = ({ navigation, route }: any) => {
//   const [showSlideModal, setShowSlideModal] = useState(true);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [showPermission, setShowPermission] = useState(false);
//   const [isPickingUp, setIsPickingUp] = useState(false);
//   const [isDelivering, setIsDelivering] = useState(false);
//   const [isDelivered, setIsDelivered] = useState(false);
// const [isNavigatingAway, setIsNavigatingAway] = useState(false);
//   const { order, setOrder, fetchOrderDetail, deliverOrder } = useOrderDetail();
//   const { user } = useContext(AuthContext) || {};
//   const { toast } = useToast();
//  const { location: iosLocation, loading: iosLocationLoading, refetch: fetchIOSLocation } = useUserLocation();

//   const hasFetchedRef = useRef(false);


//   const fetchLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
//     try {
//       if (Platform.OS === 'android') {
        
//         const data = await LocationService.getCurrentLocation();
//         return { latitude: data.latitude, longitude: data.longitude };
//       }else{
//          // iOS — request permission first, then get location
         
//       return await fetchIOSLocation();
//       }
//       // iOS — useUserLocation.refetch() handles permission internally
//      // return await fetchIOSLocation();
//     } catch (err) {
//       logger.error('fetchLocation error:', err);
//       return null;
//     }
//   };

//   // ── Derived order values ──────────────────────────────────────────────────
//   const orderStatus = order?.status ?? 'assigned';
//   const isPickedUp  = orderStatus === 'picked_up';

//   const outletName    = order?.Outlet?.name    ?? '';
//   const outletAddress = order?.Outlet?.address ?? '';

//   // Always parse to number — API may return strings
//   const outletLat  = safeCoord(order?.Outlet?.location_lat);
//   const outletLng  = safeCoord(order?.Outlet?.location_lng);
//   const deliveryLat = safeCoord(order?.delivery_lat);
//   const deliveryLng = safeCoord(order?.delivery_lng);

//   const customerName  = order?.User?.display_name ?? 'Customer';
//   const customerPhone = order?.User?.phone        ?? '';
//   const customerImage =
//     order?.User?.image_url ??
//     'https://randomuser.me/api/portraits/women/44.jpg';
//   const userId = order?.User?.id ?? '—';

//   const orderId      = order?.id            ?? '—';
//   const customerNote = order?.customer_note ?? 'No special instructions';
//   const orderLines   = order?.OrderLines    ?? [];
//   const totalCents   = parseInt(order?.total_cents ?? '0', 10);
//   const currency     = order?.currency      ?? 'USD';

//   const deliveryLocation =
//     order?.delivery_text || outletAddress || 'Resort pickup';

//   // Target switches between outlet (before pickup) and customer (after pickup)
//   const targetLat = isPickedUp ? deliveryLat : outletLat;
//   const targetLng = isPickedUp ? deliveryLng : outletLng;

//   // ── Map hook ──────────────────────────────────────────────────────────────
//   const {
//     runnerCoords,
//     routeCoords,
//     isLoadingLocation,
//     isRouteLoading,
//     fetchRunnerLocation,
//     fetchRoute,
//     mapRegion,
//     distance,
//   } = useMapLocation(targetLat, targetLng);

//   const runnerCoordsRef = useRef(runnerCoords);
//   useEffect(() => {
//     runnerCoordsRef.current = runnerCoords;
//   }, [runnerCoords]);

//   // Re-fetch route when destination changes (pickup → delivery)
//   useEffect(() => {
//     if (runnerCoordsRef.current && targetLat && targetLng) {
//       fetchRoute(targetLat, targetLng);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [targetLat, targetLng,isDelivered]);

//   // ── Mount: check location then load order ────────────────────────────────
// const loadOrder = useCallback(async () => {
//   // ✅ Don't reload if already delivered
//   if (isDelivered) return;

//   const routeOrder = route?.params?.order;
//   if (routeOrder?.OrderLines) {
//     setOrder(routeOrder);
//   } else {
//     const newOrderId = routeOrder?.order?.id ?? routeOrder?.id;
//     fetchOrderDetail(newOrderId ? Number(newOrderId) : undefined);
//   }
//   fetchRunnerLocation();
// }, [route?.params?.order, isDelivered]); // ← add isDelivered

//   useEffect(() => {
//     if (hasFetchedRef.current) return;
//     hasFetchedRef.current = true;

// const init = async () => {
//   const coords = await fetchLocation(); // handles permission for both platforms
//   if (!coords?.latitude || !coords?.longitude) {
//     setShowPermission(true);
//     return;
//   }
//   await loadOrder();
// };

//     init();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ── Block back until delivered (Android hardware back) ────────────────────
//   // useFocusEffect(
//   //   useCallback(() => {
//   //     const subscription = BackHandler.addEventListener(
//   //       'hardwareBackPress',
//   //       () => {
//   //         if (isDelivered) return false; // allow default

//   //         Alert.alert(
//   //           'Order in Progress',
//   //           'You cannot go back until the order is delivered.',
//   //           [{ text: 'OK', style: 'cancel' }],
//   //           { cancelable: false },
//   //         );
//   //         return true; // block
//   //       },
//   //     );

//   //     return () => subscription.remove(); // RN 0.83+ API
//   //   }, [isDelivered]),
//   // );
// useEffect(() => {
//   const unsubscribe = navigation.addListener('beforeRemove', (e) => {
//     // If the order is delivered OR we are manually navigating away, allow it
//     if (isDelivered || isNavigatingAway) {
//       return;
//     }

//     // Otherwise, stop the navigation action
//     e.preventDefault();

//     Alert.alert(
//       'Order in Progress', 
//       'You cannot go back until the order is delivered.',
//       [{ text: 'OK', style: 'cancel' }]
//     );
//   });

//   return unsubscribe;
// }, [navigation, isDelivered, isNavigatingAway]);
//   // Block iOS swipe-back until delivered
//   // useEffect(() => {
//   //   navigation.setOptions({
//   //     gestureEnabled: isDelivered,
//   //     headerLeft: isDelivered ? undefined : () => null,
//   //   });
//   // }, [isDelivered, navigation]);

//   // ── Handlers ─────────────────────────────────────────────────────────────
//   const handlePickedUp = async () => {
//     try {
//       setIsPickingUp(true);
//       const currentOrderId = order?.id;
//       const res = await pickedOrder(currentOrderId);
//       if (res?.success) {
//         await fetchOrderDetail(Number(currentOrderId));
//       }
//     } catch (e) {
//       logger.log('handlePickedUp error', e);
//     } finally {
//       setIsPickingUp(false);
//     }
//   };

//   const handleDeliverOrder = async () => {
//     try {
//       setIsDelivering(true);
//       const currentOrderId = order?.id;
//       const res = await deliverOrder(Number(currentOrderId));
//       if (res?.success) {
//         setIsNavigatingAway(true);
//         setIsDelivered(true);
//         setShowSuccessModal(true);
//       }
//     } catch (e) {
//       logger.log('handleDeliverOrder error', e);
//     } finally {
//       setIsDelivering(false);
//     }
//   };

//   const handleCall = () => {
//     const phoneNumber = `tel:${customerPhone}`;
//     Linking.canOpenURL(phoneNumber)
//       .then(supported => {
//         if (!supported) {
//           toast('Phone calls are not supported on this device', 'error', 3000);
//         } else {
//           return Linking.openURL(phoneNumber);
//         }
//       })
//       .catch(err => logger.log('Call error', err));
//   };

//   // Bottom sheet height scales with item count
//   // const itemCount = orderLines?.length ?? 0;
//   // const sheetMaxHeight = itemCount <= 3 ? 0.45 : 0.60;
// // ── Map height = 60% of screen ────────────────────────────────────────────────
// const MAP_HEIGHT = hp(60);

// // ── Bottom sheet height scales with orderLines count ─────────────────────────
// const itemCount      = orderLines?.length ?? 0;
// const sheetMaxHeight = itemCount === 0 ? 0.20
//   : itemCount === 1                    ? 0.30
//   : itemCount === 2                    ? 0.38
//   : itemCount === 3                    ? 0.45
//   : itemCount <= 5                     ? 0.55
//   : 0.65; // 6+ items
//   // ── Render ────────────────────────────────────────────────────────────────
//   return (
//     <View style={styles.mainContainer}>
//       <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

//         {/* ── Map ─────────────────────────────────────────────────────────── */}
//         <View style={[styles.mapContainer, { height: MAP_HEIGHT }]}>
//           {mapRegion ? (
          
//             <MapViewComponent
//               runnerCoords={runnerCoords}
//               targetLat={targetLat}
//               targetLng={targetLng}
//               mapRegion={mapRegion}
//               isPickedUp={isPickedUp}
//               outletName={outletName}
//               customerName={customerName}
//               customerImage={customerImage}
//               outletImage={order?.Outlet?.image_url}
//               runnerImage={user?.image_url}
//               routeCoordinates={routeCoords}
//               isRouteLoading={isRouteLoading}
//               isLoading={isLoadingLocation}
//               outletLat={outletLat}
//               outletLng={outletLng}
//               customerLat={deliveryLat}
//               customerLng={deliveryLng}
//             />
//           ) : (
//             <View style={[styles.map, styles.fallback]}>
//               <ActivityIndicator size="small" color={Colors.orange} />
//               <Text style={styles.fallbackText}>Loading map...</Text>
//             </View>
//           )}
//         </View>

//         {/* ── Info cards ──────────────────────────────────────────────────── */}
//         <View style={styles.contentContainer}>

//           {/* Outlet view — before pickup */}
//           {!isPickedUp && (
//             <>
//               <View style={styles.outletCard}>
//                 <View style={styles.outletHeader}>
//                   {order?.Outlet?.image_url ? (
//                     <Image
//                       source={{ uri: order?.Outlet?.image_url }}
//                       style={styles.markerImage}
//                     />
//                   ) : (
//                     <View style={styles.outletIconContainer}>
//                       <Store size={ms(24)} color={Colors.orange} />
//                     </View>
//                   )}
//                   <View style={styles.outletInfo}>
//                     <View style={styles.outletHeaderRow}>
//                       <Text style={styles.outletLabel}>Pick up from</Text>
//                       <Text style={styles.orderId}>#{orderId}</Text>
//                     </View>
//                     <Text style={styles.outletName}>{outletName}</Text>
//                   </View>
//                 </View>
//                 <View style={styles.outletDivider} />
//                 <InfoRow
//                   Icon={<MapPin size={16} color={Colors.borderColor1} />}
//                   title="Address"
//                   subtitle={outletAddress}
//                   IconPosition="right"
//                   subtitleStyle={styles.subtextStyle}
//                   iconStyle={styles.iconStyle}
//                 />
//               </View>

//               <View style={styles.infoContainer}>
//                 <InfoRow
//                   Icon={<Map size={16} color={Colors.borderColor1} />}
//                   title="Distance"
//                   subtitle={distance}
//                   IconPosition="right"
//                   subtitleStyle={styles.subtextStyle}
//                   iconStyle={styles.iconStyle}
//                 />
//               </View>

//               <View style={styles.totalContainer}>
//                 <Text style={styles.totalLabel}>Order Total</Text>
//                 <Text style={styles.totalValue}>
//                   ${(totalCents / 100).toFixed(2)} {currency}
//                 </Text>
//               </View>
//             </>
//           )}
// {/* {!isPickedUp && (
//   <>
//     <OutletInfoCard
//       orderId={String(orderId)}
//       outletName={outletName}
//       outletAddress={outletAddress}
//       outletImage={order?.Outlet?.image_url}
//       distance={distance}
//       onNavigate={() => {
//         // Open in maps app
//         const url = Platform.OS === 'ios'
//           ? `maps://?q=${outletLat},${outletLng}`
//           : `geo:${outletLat},${outletLng}?q=${outletLat},${outletLng}`;
//         Linking.openURL(url).catch(err =>
//           logger.log('Maps open error', err)
//         );
//       }}
//     />

//     <View style={styles.totalContainer}>
//       <Text style={styles.totalLabel}>Order Total</Text>
//       <Text style={styles.totalValue}>
//         ${(totalCents / 100).toFixed(2)} {currency}
//       </Text>
//     </View>
//   </>
// )} */}
//           {/* Customer view — after pickup */}
//           {isPickedUp && (
//             <>
//               <CustomerInfoCard
//                 orderId={String(orderId)}
//                 customerId={String(userId)}
//                 name={customerName}
//                 room={outletName}
//                 image={customerImage}
//                 onCall={handleCall}
//                 onMessage={() => logger.log('Message')}
//                 style={styles.customerInfoCardStyle}
//               />

//               <View style={styles.infoRowStyle}>
//                 <Text style={styles.titleNote}>Customer Note</Text>
//                <Text style={styles.descriptionTextStyle}>
//   {customerNote || 'No special instructions'}
// </Text>
//               </View>

//               <View style={styles.infoContainer}>
//                 <InfoRow
//                   Icon={<Map size={16} color={Colors.borderColor1} />}
//                   title="Distance"
//                   subtitle={distance}
//                   IconPosition="right"
//                   subtitleStyle={styles.subtextStyle}
//                   iconStyle={styles.iconStyle}
//                 />
//                 <InfoRow
//                   title="Location"
//                   subtitle={deliveryLocation}
//                   Icon={<MapPin size={16} color={Colors.borderColor1} />}
//                   IconPosition="right"
//                   subtitleStyle={styles.subtextStyle}
//                   iconStyle={styles.iconStyle}
//                 />
//               </View>

//               <View style={styles.totalContainer}>
//                 <Text style={styles.totalLabel}>Order Total</Text>
//                 <Text style={styles.totalValue}>
//                   ${(totalCents / 100).toFixed(2)} {currency}
//                 </Text>
//               </View>
//             </>
//           )}
//         </View>

//         <View style={{ height: hp(20) }} />
//       </ScrollView>

//       {/* ── Bottom Sheet ──────────────────────────────────────────────────── */}
//     <BottomGradientBottomSheet
//   visible={showSlideModal}
//   onClose={() => setShowSlideModal(false)}
//   maxHeightPercentage={sheetMaxHeight}  // ← dynamic
//   minHeightPercentage={0.15}
// >
//         {/* Drag handle */}
//         <View style={styles.modalLine} />

//         {/* Section header */}
//         <Text style={styles.sectionTitle}>
//           {isPickedUp ? 'Order Details' : 'Order Items'}
//           <Text style={styles.nOftext}> ({itemCount} items)</Text>
//         </Text>
//         <View style={styles.dottedLine} />

//         {/* Order items */}
//         {orderLines.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>No items</Text>
//           </View>
//         ) : (
//           orderLines.map((item: any, index: number) => (
//             <RenderItem
//               key={String(item.id)}
//               item={{
//                 id: item.id,
//                 quantity: item.quantity,
//                 price: item.line_total_cents,
//                 menu_item: {
//                   name: item.MenuItem?.name,
//                   description: item.MenuItem?.description,
//                   image_url: item.MenuItem?.image_url,
//                   item_type: item.MenuItem?.item_type,
//                 },
//                 options: [],
//               }}
//               index={index}
//             />
//           ))
//         )}

//         {/* CTA button */}
//         <View style={styles.ctaContainer}>
//           {!isPickedUp ? (
//             <CustomButton
//               title={isPickingUp ? 'Confirming...' : 'Confirm Pickup from Restaurant'}
//               style={[styles.pickupButton, isPickingUp && styles.buttonDisabled]}
//               disabled={isPickingUp}
//               onPress={handlePickedUp}
//             />
//           ) : (
//             <CustomButton
//               title={isDelivering ? 'Delivering...' : 'Mark as Delivered'}
//               style={[styles.deliverButton, isDelivering && styles.buttonDisabled]}
//               disabled={isDelivering}
//               onPress={handleDeliverOrder}
//             />
//           )}
//         </View>
//       </BottomGradientBottomSheet>

//       {/* ── Success Modal ─────────────────────────────────────────────────── */}
//       <SuccessModal
//         icon={Greenticksvg}
//         visible={showSuccessModal}
//         onClose={() => {}}
//         onPress={() => {
//           setShowSuccessModal(false);
//        navigation.reset({
//   index: 0,
//   routes: [{ name: 'Home' }],
// });
//         }}
//         title="Successfully Delivered!"
//         message="Your order has been delivered successfully."
//       />

//       {/* ── Permission Modal ──────────────────────────────────────────────── */}
//       {/* <PermissionFlowModal
//         visible={showPermission}
//         onComplete={async () => {
//           setShowPermission(false);
//           // Retry after permission granted
//           const coords = await fetchLocation();
//           if (coords?.latitude && coords?.longitude) {
//             await loadOrder();
//           }
//         }}
//       /> */}
//     </View>
//   );
// };

// export default CustomerInfoScreen;

// // ── Styles ────────────────────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   mainContainer: { flex: 1, backgroundColor: Colors.white },
//   container: { flex: 1, backgroundColor: Colors.white },

//   // Map
//   mapContainer: { marginBottom: ms(16) },
//   map: { width: '100%', height: hp(38) },
//   fallback: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#eef2f6',
//     gap: vs(8),
//   },
//   fallbackText: {
//     fontSize: fontSize(13),
//     fontFamily: Typography.Regular.fontFamily,
//     color: Colors.borderColor1,
//   },

//   // Content
//   contentContainer: {
//     flex: 1,
//     marginHorizontal: ms(16),
//     gap: ms(12),
//   },

//   // Outlet card
//   outletCard: {
//     backgroundColor: Colors.customerInfoCardBg,
//     borderRadius: ms(14),
//     padding: ms(16),
//   },
//   outletHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: ms(12),
//     marginBottom: vs(12),
//   },
//   outletHeaderRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   markerImage: { width: ms(48), height: ms(48), borderRadius: ms(24) },
//   outletIconContainer: {
//     width: ms(48),
//     height: ms(48),
//     borderRadius: ms(24),
//     backgroundColor: Colors.white,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   outletInfo: { flex: 1 },
//   outletLabel: {
//     fontSize: fontSize(12),
//     fontFamily: Typography.Regular.fontFamily,
//     color: Colors.borderColor1,
//   },
//   orderId: {
//     fontSize: fontSize(16),
//     color: Colors.black,
//     ...Typography.SemiBold,
//   },
//   outletName: {
//     fontSize: fontSize(16),
//     fontFamily: Typography.Bold.fontFamily,
//     color: Colors.black1,
//     marginTop: vs(2),
//   },
//   outletDivider: {
//     height: 1,
//     backgroundColor: Colors.borderColor,
//     marginBottom: vs(12),
//   },

//   // Info rows
//   infoContainer: {
//     backgroundColor: Colors.customerInfoCardBg,
//     paddingHorizontal: ms(16),
//     borderRadius: ms(14),
//     paddingTop: vs(8),
//   },
//   subtextStyle: { marginLeft: 0 },
//   iconStyle: { marginLeft: 5 },

//   // Total
//   totalContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: Colors.customerInfoCardBg,
//     paddingHorizontal: ms(16),
//     paddingVertical: vs(14),
//     borderRadius: ms(14),
//   },
//   totalLabel: {
//     fontSize: fontSize(14),
//     fontFamily: Typography.Medium.fontFamily,
//     color: Colors.borderColor1,
//   },
//   totalValue: {
//     fontSize: fontSize(16),
//     fontFamily: Typography.Bold.fontFamily,
//     color: Colors.black1,
//   },

//   // Customer card
//   customerInfoCardStyle: { maxHeight: hp(20) },
//   infoRowStyle: {
//     backgroundColor: Colors.customerInfoCardBg,
//     paddingHorizontal: ms(16),
//     borderRadius: ms(14),
//   },
//   titleNote: {
//     color: Colors.borderColor1,
//     fontSize: fontSize(14),
//     fontFamily: Typography.Medium.fontFamily,
//     paddingVertical: ms(8),
//   },
//   descriptionTextStyle: {
//     fontFamily: Typography.Regular.fontFamily,
//     fontSize: fontSize(12),
//     color: Colors.black,
//     paddingBottom: ms(8),
//   },

//   // Bottom sheet
//   modalLine: {
//     width: ms(50),
//     height: vs(4),
//     backgroundColor: Colors.black,
//     alignSelf: 'center',
//     borderRadius: ms(10),
//     marginTop: vs(10),
//     marginBottom: vs(4),
//   },
//   sectionTitle: {
//     fontFamily: Typography.SemiBold.fontFamily,
//     fontSize: fontSize(14),
//     paddingHorizontal: ms(20),
//     paddingVertical: vs(10),
//   },
//   nOftext: {
//     color: Colors.borderColor1,
//     fontSize: fontSize(14),
//     fontFamily: Typography.Medium.fontFamily,
//   },
//   dottedLine: {
//     borderBottomWidth: 1.4,
//     borderBottomColor: '#E4E4EB',
//     borderStyle: 'dashed',
//     marginVertical: ms(4),
//     marginHorizontal: ms(16),
//     marginBottom: vs(8),
//   },
//   emptyContainer: {
//     paddingVertical: vs(40),
//     alignItems: 'center',
//   },
//   emptyText: {
//     fontSize: fontSize(14),
//     fontFamily: Typography.Regular.fontFamily,
//     color: Colors.borderColor1,
//   },

//   // CTA button
//   ctaContainer: {
//     position: 'absolute',
//     bottom: vs(20),
//     left: 0,
//     right: 0,
//     paddingHorizontal: ms(16),
//   },
//   pickupButton: {
//     backgroundColor: Colors.orange,
//     borderRadius: ms(10),
//     height: vs(50),
//     width: '100%',
//     alignSelf: 'center',
//   },
//   deliverButton: {
//     backgroundColor: Colors.green2,
//     borderRadius: ms(10),
//     height: vs(50),
//     width: '100%',
//     alignSelf: 'center',
//   },
//   buttonDisabled: { opacity: 0.7 },
// });

import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useCallback,
} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomerInfoCard from '../../components/cards/CustmerInfoCard';
import InfoRow from '../../components/Row/InfoRow';
import Colors from '../../utils/colors';
import { fontSize, hp, ms, vs } from '../../utils/responsive';
import { Typography } from '../../utils/typography';
import { MapPin, Map, Store } from 'lucide-react-native';
import CustomButton from '../../components/Buttons/CustomButton';
import BottomGradientBottomSheet from '../../components/modals/BottomGradientBottomSheet';
import SuccessModal from '../../components/modals/SuccessModal';
import Greenticksvg from '../../assets/svg/Greenticksvg';
import RenderItem from '../../components/RenderItem/RenderItem';
import { FlashList } from '@shopify/flash-list';

import { useOrderDetail } from '../../hooks/useOrderDetail';
import { pickedOrder } from '../../services/Orders/order.api';
import { logger } from '../../utils/logger';
import { useMapLocation } from '../../hooks/useMapLocation';
import MapViewComponent from '../../components/Map/MapViewComponent';
import { AuthContext } from '../../context/AuthContext';
import { useToast } from '../../hooks/ToastProvider';
import LocationService from '../../hooks/LocationModule.android';
import { useUserLocation } from '../../hooks/useUserLocation';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import ChatService from '../../services/Chat/ChatService';
import { makePhoneCall } from '../../utils/phoneCall';
import PermissionFlowModal from '../../components/modals/PermissionFlowModal';
import { useAppPermissions } from '../../hooks/useAppPermissions';

import { Dimensions } from 'react-native';
import RunnerOrderItemsModal from '../../components/modals/RunnerOrderItemsModalProps';
import { SOCKET_EVENTS } from '../../services/Socket/SocketEvents';
import { useOrderSocket } from '../../hooks/useSocketListener';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const sheetMaxHeight = 0.20;
const bottomSheetHeight = SCREEN_HEIGHT * sheetMaxHeight;

// ── Helper: safely parse a coordinate value ───────────────────────────────────
const safeCoord = (val: any): number | null => {
  const n = parseFloat(val);
  return isNaN(n) || n === 0 ? null : n;
};

// ── CustomerInfoScreen ────────────────────────────────────────────────────────
const CustomerInfoScreen = ({ navigation, route }: any) => {

    const isFocused = useIsFocused();

// Inside your component:
const insets = useSafeAreaInsets();
  const [showPermissionModal, setShowPermissionModal] = useState(false);
    const { ensureLocationAccess } = useAppPermissions();
// 1️⃣  ADD these two state variables after your existing useState declarations:
const [unreadCount, setUnreadCount]   = useState(0);
const [lastMessage, setLastMessage]   = useState<string | undefined>(undefined);
// 2️⃣  ADD a ref to hold the chat unsubscribe function:
const chatUnsubscribeRef = useRef<(() => void) | null>(null);

 // ✅ ADD THIS: Ref to track if action is performed by current user
  const isPerformingActionRef = useRef(false);

  // ── State ─────────────────────────────────────────────────────────────────
  const [showSlideModal, setShowSlideModal]     = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isPickingUp, setIsPickingUp]           = useState(false);
  const [isDelivering, setIsDelivering]         = useState(false);
  const [isDelivered, setIsDelivered]           = useState(false);
  const [isNavigatingAway, setIsNavigatingAway] = useState(false);

  // ── Refs ──────────────────────────────────────────────────────────────────
  // Ref to freeze delivery state synchronously — prevents stale closure issues
  const isDeliveredRef  = useRef(false);
  const hasFetchedRef   = useRef(false);
  const runnerCoordsRef = useRef<any>(null);

  // ── Hooks ─────────────────────────────────────────────────────────────────
  const { order, setOrder, fetchOrderDetail, deliverOrder } = useOrderDetail();
  const { user }    = useContext(AuthContext) || {};
  const { toast }   = useToast();
  const { refetch: fetchIOSLocation } = useUserLocation();

  // ── Location helper ───────────────────────────────────────────────────────
  const fetchLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
    try {
      if (Platform.OS === 'android') {
        const data = await LocationService.getCurrentLocation();
        return { latitude: data.latitude, longitude: data.longitude };
      }
      return await fetchIOSLocation();
    } catch (err) {
      logger.error('fetchLocation error:', err);
      return null;
    }
  };

  // ── Derived order values ──────────────────────────────────────────────────
  const orderStatus = order?.status ?? 'assigned';

  // ✅ Freeze isPickedUp when delivered — prevents button flip back to "Confirm Pickup"
  const isPickedUp = isDeliveredRef.current ? true : orderStatus === 'picked_up';

  const outletName    = order?.Outlet?.name    ?? '';
  const outletAddress = order?.Outlet?.address ?? '';

  const outletLat   = safeCoord(order?.Outlet?.location_lat);
  const outletLng   = safeCoord(order?.Outlet?.location_lng);
  const deliveryLat = safeCoord(order?.delivery_lat);
  const deliveryLng = safeCoord(order?.delivery_lng);

  const customerName  = order?.User?.display_name ?? 'Customer';
  const customerPhone = order?.User?.phone        ?? '';
  const customerImage = order?.User?.image_url    ?? 'https://randomuser.me/api/portraits/women/44.jpg';
  const customerId        = order?.User?.id           ?? '—';

  const orderId      = order?.id            ?? '—';
  const customerNote = order?.delivery_text ?? '';
  const orderLines   = order?.OrderLines    ?? [];
  const totalCents   = parseInt(order?.total_cents ?? '0', 10);
  const currency     = order?.currency      ?? 'USD';

  const deliveryLocation = order?.delivery_address || 'No Address';

  // Target switches between outlet (before pickup) and customer (after pickup)
  const targetLat = isPickedUp ? deliveryLat : outletLat;
  const targetLng = isPickedUp ? deliveryLng : outletLng;

  // ── Map hook ──────────────────────────────────────────────────────────────
  const {
    runnerCoords,
    routeCoords,
    isLoadingLocation,
    isRouteLoading,
    fetchRunnerLocation,
    fetchRoute,
    mapRegion,
    distance,
  } = useMapLocation(targetLat, targetLng);


// 3️⃣  ADD this useFocusEffect BELOW your existing useFocusEffect (order-refresh one).
//     It subscribes to the chat room for this order so the badge updates in real-time.
// useFocusEffect(
//   useCallback(() => {
//     if (!orderId || orderId === '—' || !user?.id) return;

//     let unsubscribe: (() => void) | null = null;

//     const subscribeToChat = async () => {
//       try {
//         // Get the chat room for this order (don't create — just fetch if exists)
//         const chatRoomData = await ChatService.getOrCreateChatRoom(
//           String(orderId),
//           String(customerId),
//           customerName,
//           String(user.id),   // runnerId not needed — room is keyed by orderId
//           user.display_name,
//         );

//         unsubscribe = ChatService.getMessages(chatRoomData.id, (messages) => {
//           // Count messages not sent by runner (i.e. from customer) that are unread
//           const unread = messages.filter(
//             (m) => m.senderId !== user.id && !m.read
//           ).length;

//           const latest = messages[messages.length - 1];

//           setUnreadCount(unread);
//           setLastMessage(latest?.senderId !== user.id ? latest?.text : undefined);
//         });

//         chatUnsubscribeRef.current = unsubscribe;
//       } catch (err) {
//         // Chat room may not exist yet — that's fine, ignore silently
//       }
//     };

//    // subscribeToChat();

//     // Cleanup on blur
//     return () => {
//       unsubscribe?.();
//       chatUnsubscribeRef.current = null;
//     };
//   }, [orderId, user?.id, customerName]),
// );

// ── Refresh order when screen comes back into focus (e.g. returning from Chat) ─
useFocusEffect(
  useCallback(() => {
    logger.log('CustomerInfoScreen: useFocusEffect');
    // Skip on first mount (hasFetchedRef handles that) and skip if delivered
    if (!hasFetchedRef.current || isDeliveredRef.current) return;
 const routeOrder = route?.params?.order;
   const newOrderId = routeOrder?.order?.id ?? routeOrder?.id;
   logger.log('CustomerInfoScreen: newOrderId', newOrderId);
    if (newOrderId) {
      fetchOrderDetail(Number(newOrderId));
    }
    fetchRunnerLocation();
  }, [route?.params?.order]),
);


  useEffect(() => {
    runnerCoordsRef.current = runnerCoords;
  }, [runnerCoords]);

  // Re-fetch route when destination changes (pickup → delivery)
  // ✅ Guard: skip if delivered
  useEffect(() => {
    if (isDeliveredRef.current) return;
    if (runnerCoordsRef.current && targetLat && targetLng) {
      fetchRoute(targetLat, targetLng);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetLat, targetLng]);

  // ── Load order ────────────────────────────────────────────────────────────
  const loadOrder = useCallback(async () => {
    // ✅ Don't reload if already delivered
    if (isDeliveredRef.current) return;

    const routeOrder = route?.params?.order;
    if (routeOrder?.OrderLines) {
      setOrder(routeOrder);
    } else {
      const newOrderId = routeOrder?.order?.id ?? routeOrder?.id;
      fetchOrderDetail(newOrderId ? Number(newOrderId) : undefined);
    }
    fetchRunnerLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route?.params?.order]);


const loadLocationSafely = async (): Promise<{ latitude: number; longitude: number } | null> => {
  const access = await ensureLocationAccess();

  if (access.status === 'NO_PERMISSION') {
    setShowPermissionModal(true);
    return null;
  }

  if (access.status === 'SERVICES_DISABLED') {
    setShowPermissionModal(true);
    return null;
  }

  // Safe to fetch
  return await fetchLocation();
};

  // ── Mount: fetch location then load order (runs once) ────────────────────
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const init = async () => {
      const coords = await loadLocationSafely();
      if (!coords?.latitude || !coords?.longitude) {
        // Permission denied — could show permission modal here if needed
        return;
      }
      await loadOrder();
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Block back navigation until delivered ─────────────────────────────────
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      if (isDelivered || isNavigatingAway) return;

      e.preventDefault();
      Alert.alert(
        'Order in Progress',
        'You cannot go back until the order is delivered.',
        [{ text: 'OK', style: 'cancel' }],
      );
    });

    return unsubscribe;
  }, [navigation, isDelivered, isNavigatingAway]);




  // ✅ ADD THIS: Socket listener for order status changes
  useOrderSocket((event, data) => {


    if (!isFocused) return;

    // ✅ CORRECTED: Use correct field names from socket data
    const socketOrderId = data.orderId || data.order_id || data.id;
    const socketRunnerId = data.runnerId || data.runner_id;
    const currentOrderId = order?.id;
    const currentUserId = user?.id;

    logger.log('📡 Order socket event in CustomerInfo:',event, {
      socketOrderId,
      socketRunnerId,
      currentOrderId,
      currentUserId,
      data
    });

    // Only handle events for the current order
    if (socketOrderId !== currentOrderId) {
      logger.log('⏭️ Event is for different order, ignoring');
      return;
    }

    // ✅ Skip toast if this action was performed by current user
    if (socketRunnerId === currentUserId && isPerformingActionRef.current) {
      logger.log('⏭️ Skipping socket action - performed by current user');
      isPerformingActionRef.current = false;
      return;
    }

    // ✅ Handle ORDER_PICKED_UP event
    if (event === SOCKET_EVENTS.ORDER_PICKED_UP) {
      logger.log('📦 Order picked up via socket:', socketOrderId);
      
      if (!isDeliveredRef.current) {
        // Update order status in state
        setOrder((prev: any) => ({
          ...prev,
          status: 'picked_up',
        }));

        // Only show toast if not performed by current user
        if (socketRunnerId !== currentUserId) {
          toast?.('Order marked as picked up', 'success', 2000);
        }
        
        // Optionally refresh order details
        if (currentOrderId) {
          fetchOrderDetail(Number(currentOrderId));
        }
      }
    }

    // ✅ Handle ORDER_DELIVERED event
    if (event === SOCKET_EVENTS.ORDER_DELIVERED) {
      logger.log('✅ Order delivered via socket:', socketOrderId);
      
      // Freeze delivery state
      isDeliveredRef.current = true;
      setIsNavigatingAway(true);
      setIsDelivered(true);
      setShowSlideModal(false);
      
      // Only show toast if not performed by current user
      if (socketRunnerId !== currentUserId) {
        toast?.('Order delivered successfully!', 'success', 2000);
      }
      
      // Show success modal
      setTimeout(() => {
        setShowSuccessModal(true);
      }, 500);
    }

    // ✅ Handle ORDER_READY event (if runner hasn't picked up yet)
    if (event === SOCKET_EVENTS.ORDER_READY) {
      logger.log('🍕 Order ready for pickup via socket:', socketOrderId);
      fetchOrderDetail(Number(currentOrderId));
      // Only show if order hasn't been picked up yet
      // if (order?.status === 'assigned' || order?.status === 'accepted') {
      //   toast?.('Order is ready for pickup!', 'success', 3000);
        
      //   // Refresh order details
      //   if (currentOrderId) {
      //     fetchOrderDetail(Number(currentOrderId));
      //   }
      // }
    }
  });

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handlePickedUp = async () => {
    try {
      setIsPickingUp(true);

       // ✅ Set flag to prevent duplicate socket toast
      isPerformingActionRef.current = true;

      const currentOrderId = order?.id;
      const res = await pickedOrder(currentOrderId);
      // ✅ Guard: don't refresh order after delivery
      if (res?.success && !isDeliveredRef.current) {
        await fetchOrderDetail(Number(currentOrderId));
      }

 // ✅ Reset flag after a delay
      setTimeout(() => {
        isPerformingActionRef.current = false;
      }, 2000);

    } catch (e) {
      logger.log('handlePickedUp error', e);
      isPerformingActionRef.current = false;
    } finally {
      setIsPickingUp(false);
    }
  };

  const handleDeliverOrder = async () => {
    try {
      setIsDelivering(true);


       // ✅ Set flag to prevent duplicate socket toast
      isPerformingActionRef.current = true;

      const currentOrderId = order?.id;
      const res = await deliverOrder(Number(currentOrderId));
      if (res?.success) {
        // ✅ Freeze ref synchronously BEFORE any state updates
        isDeliveredRef.current = true;
        setIsNavigatingAway(true);
        setIsDelivered(true);
        setShowSlideModal(false);   // ← hide bottom sheet immediately
        setShowSuccessModal(true);
      }

       // ✅ Reset flag after a delay
      setTimeout(() => {
        isPerformingActionRef.current = false;
      }, 2000);

    } catch (e) {
      logger.log('handleDeliverOrder error', e);
      isPerformingActionRef.current = false;
    } finally {
      setIsDelivering(false);
    }
  };
// 4️⃣  UPDATE handleChat to reset badge when runner opens chat:
const handleChat = () => {
  setUnreadCount(0);   // 👈 clear badge immediately on open
  setLastMessage(undefined);
  navigation.navigate('Chat', {
    orderId,
    customerId,
    customerName,
    customerPhone,
    customerImage,
    runnerName:  user?.display_name,
    runnerImage: user?.image_url,
    runnerId:    user?.id,
  });
};
  const handleCall = async () => {
     await makePhoneCall(customerPhone || '', 'Customer', toast);
    // const phoneNumber = `tel:${customerPhone}`;
    // Linking.canOpenURL(phoneNumber)
    //   .then(supported => {
    //     if (!supported) {
    //       toast('Phone calls are not supported on this device', 'error', 3000);
    //     } else {
    //       return Linking.openURL(phoneNumber);
    //     }
    //   })
    //   .catch(err => logger.log('Call error', err));
  };

  // ── Dynamic heights ───────────────────────────────────────────────────────
  const MAP_HEIGHT = hp(60);

  const itemCount = orderLines?.length ?? 0;
  const sheetMaxHeight =
    itemCount === 0 ? 0.10
    : itemCount === 1 ? 0.15
    : itemCount === 2 ? 0.20
    : itemCount === 3 ? 0.25
    : itemCount <= 5  ? 0.55
    : 0.55;



  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <View style={styles.mainContainer}>

      {/* ── Main scroll ───────────────────────────────────────────────────── */}
<ScrollView
  style={{ flex: 1 }}
  contentContainerStyle={{
    paddingBottom: bottomSheetHeight,
  }}
  showsVerticalScrollIndicator={false}
>

        {/* ── Map ─────────────────────────────────────────────────────────── */}
        <View style={[styles.mapContainer, { height: MAP_HEIGHT }]}>
          {mapRegion ? (
            <MapViewComponent
              runnerCoords={runnerCoords}
              targetLat={targetLat}
              targetLng={targetLng}
              mapRegion={mapRegion}
              isPickedUp={isPickedUp}
              outletName={outletName}
              customerName={customerName}
              customerImage={customerImage}
              outletImage={order?.Outlet?.image_url}
              runnerImage={user?.image_url}
              routeCoordinates={routeCoords}
              isRouteLoading={isRouteLoading}
              isLoading={isLoadingLocation}
              outletLat={outletLat}
              outletLng={outletLng}
              customerLat={deliveryLat}
              customerLng={deliveryLng}
            />
          ) : (
            <View style={styles.mapFallback}>
              <ActivityIndicator size="small" color={Colors.orange} />
              <Text style={styles.fallbackText}>Loading map...</Text>
            </View>
          )}
        </View>

        {/* ── Info cards ──────────────────────────────────────────────────── */}
        <View style={styles.contentContainer}>

          {/* Outlet view — before pickup */}
          {!isPickedUp && (
            <>
              <View style={styles.outletCard}>
                <View style={styles.outletHeader}>
                  {order?.Outlet?.image_url ? (
                    <Image
                      source={{ uri: order?.Outlet?.image_url }}
                      style={styles.markerImage}
                    />
                  ) : (
                    <View style={styles.outletIconContainer}>
                      <Store size={ms(24)} color={Colors.orange} />
                    </View>
                  )}
                  <View style={styles.outletInfo}>
                    <View style={styles.outletHeaderRow}>
                      <Text style={styles.outletLabel}>Pick up from</Text>
                      <Text style={styles.orderId}>#{orderId}</Text>
                    </View>
                    <Text style={styles.outletName}>{outletName}</Text>
                  </View>
                </View>
                <View style={styles.outletDivider} />
                <InfoRow
                  Icon={<MapPin size={16} color={Colors.borderColor1} />}
                  title="Address"
                  subtitle={outletAddress}
                  IconPosition="right"
                  subtitleStyle={styles.subtextStyle}
                  iconStyle={styles.iconStyle}
                />

  <InfoRow
                  Icon={<Map size={16} color={Colors.borderColor1} />}
                  title="Distance"
                  subtitle={distance}
                  IconPosition="right"
                  subtitleStyle={styles.subtextStyle}
                  iconStyle={styles.iconStyle}
                />

              </View>

              {/* <View style={styles.infoContainer}>
                <InfoRow
                  Icon={<Map size={16} color={Colors.borderColor1} />}
                  title="Distance"
                  subtitle={distance}
                  IconPosition="right"
                  subtitleStyle={styles.subtextStyle}
                  iconStyle={styles.iconStyle}
                />
              </View> */}

              {/* <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Order Total</Text>
                <Text style={styles.totalValue}>
                  ${(totalCents / 100).toFixed(2)} {currency}
                </Text>
              </View> */}
            </>
          )}

          {/* Customer view — after pickup */}
          {isPickedUp && (
            <>
              <CustomerInfoCard
                orderId={String(orderId)}
                customerId={String(customerId)}
                name={customerName}
                room={outletName}
                image={customerImage}
                onCall={handleCall} 
                onMessage={handleChat}
                style={styles.customerInfoCardStyle}
                unreadCount={unreadCount}       // 👈 add this
                lastMessage={lastMessage}  
              />

              <View style={styles.infoRowStyle}>
            {customerNote ? (
  <>
    <Text style={styles.titleNote}>Customer Note</Text>
    <Text style={styles.descriptionTextStyle}>
      {customerNote}
    </Text>
 </>
) : (
 <View style={{marginTop:hp(1)}}/>
)}
              


 <InfoRow
                 // Icon={<Map size={16} color={Colors.borderColor1} />}
                  title="Location"
                  subtitle={deliveryLocation}
                  Icon={<MapPin size={16} color={Colors.borderColor1} />}
                  IconPosition="right"
                  subtitleStyle={styles.subtextStyle}
                  iconStyle={styles.iconStyle}
                />

              </View>

              {/* <View style={styles.infoContainer}>
                <InfoRow
                  Icon={<Map size={16} color={Colors.borderColor1} />}
                  title="Distance"
                  subtitle={distance}
                  IconPosition="right"
                  subtitleStyle={styles.subtextStyle}
                  iconStyle={styles.iconStyle}
                />
                <InfoRow
                  title="Location"
                  subtitle={deliveryLocation}
                  Icon={<MapPin size={16} color={Colors.borderColor1} />}
                  IconPosition="right"
                  subtitleStyle={styles.subtextStyle}
                  iconStyle={styles.iconStyle}
                />
              </View> */}

              {/* <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Order Total dfgdfgd</Text>
                <Text style={styles.totalValue}>
                  ${(totalCents / 100).toFixed(2)} {currency}
                </Text>
              </View> */}
            </>
          )}
        </View>

        {/* Space so content isn't hidden behind bottom sheet */}
        {/* <View style={{ height: hp(sheetMaxHeight * 100 + 5) }} /> */}
      </ScrollView>

      {/* ── Bottom Sheet ──────────────────────────────────────────────────── */}
     

{/* ── Bottom Sheet with preview and expand button ────────────────── */}

<RunnerOrderItemsModal
  visible={showSlideModal && !isDelivered}
  onClose={() => setShowSlideModal(false)}
  orderItems={orderLines}
  isPickedUp={isPickedUp}
  isPickingUp={isPickingUp}
  isDelivering={isDelivering}
  onPickup={handlePickedUp}
  onDeliver={handleDeliverOrder}
  maxHeightPercentage={sheetMaxHeight}
  minHeightPercentage={0.10}
/>

      {/* ── Success Modal ─────────────────────────────────────────────────── */}
      <SuccessModal
        icon={Greenticksvg}
        visible={showSuccessModal}
        onClose={() => {}}
        onPress={() => {
          setShowSuccessModal(false);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }}
        title="Successfully Delivered!"
        message="Your order has been delivered successfully."
      />

  <PermissionFlowModal
        visible={showPermissionModal}
        onComplete={() => setShowPermissionModal(false)}
      />

    </View>
  );
};

export default CustomerInfoScreen;

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: Colors.white },
  container:     { backgroundColor: Colors.white },

  // ── Map ────────────────────────────────────────────────────────────────────
  mapContainer: {
    width: '100%',
    marginBottom: ms(16),
  },
  mapFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eef2f6',
    gap: vs(8),
  },
  fallbackText: {
    fontSize: fontSize(13),
    fontFamily: Typography.Regular.fontFamily,
    color: Colors.borderColor1,
  },

  // ── Content ────────────────────────────────────────────────────────────────
  contentContainer: {
    marginHorizontal: ms(16),
    gap: ms(12),
   // backgroundColor: Colors.red1,
  },

  // ── Outlet card ────────────────────────────────────────────────────────────
  outletCard: {
    backgroundColor: Colors.customerInfoCardBg,
    borderRadius: ms(14),
    padding: ms(16),
  },
  outletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(12),
    marginBottom: vs(12),
  },
  outletHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  markerImage: { width: ms(48), height: ms(48), borderRadius: ms(24) },
  outletIconContainer: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(24),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outletInfo:  { flex: 1 },
  outletLabel: {
    fontSize: fontSize(12),
    fontFamily: Typography.Regular.fontFamily,
    color: Colors.borderColor1,
  },
  orderId: {
    fontSize: fontSize(16),
    color: Colors.black,
    ...Typography.SemiBold,
  },
  outletName: {
    fontSize: fontSize(16),
    fontFamily: Typography.Bold.fontFamily,
    color: Colors.black1,
    marginTop: vs(2),
  },
  outletDivider: {
    height: 1,
    backgroundColor: Colors.borderColor,
    marginBottom: vs(12),
  },

  // ── Info rows ──────────────────────────────────────────────────────────────
  infoContainer: {
    backgroundColor: Colors.customerInfoCardBg,
    paddingHorizontal: ms(16),
    borderRadius: ms(14),
    paddingTop: vs(8),
  },
  subtextStyle: { marginLeft: 0 },
  iconStyle:    { marginLeft: 5 },

  // ── Total ──────────────────────────────────────────────────────────────────
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.customerInfoCardBg,
    paddingHorizontal: ms(16),
    paddingVertical: vs(14),
    borderRadius: ms(14),
  },
  totalLabel: {
    fontSize: fontSize(14),
    fontFamily: Typography.Medium.fontFamily,
    color: Colors.borderColor1,
  },
  totalValue: {
    fontSize: fontSize(16),
    fontFamily: Typography.Bold.fontFamily,
    color: Colors.black1,
  },

  // ── Customer card ──────────────────────────────────────────────────────────
  customerInfoCardStyle: { maxHeight: hp(20) },
  infoRowStyle: {
    backgroundColor: Colors.customerInfoCardBg,
    paddingHorizontal: ms(16),
    borderRadius: ms(14),
  },
  titleNote: {
    color: Colors.borderColor1,
    fontSize: fontSize(14),
    fontFamily: Typography.Medium.fontFamily,
    paddingVertical: ms(8),
  },
  descriptionTextStyle: {
    fontFamily: Typography.Regular.fontFamily,
    fontSize: fontSize(12),
    color: Colors.black,
    paddingBottom: ms(8),
  },

  // ── Bottom sheet ───────────────────────────────────────────────────────────
  modalLine: {
    width: ms(50),
    height: vs(4),
    backgroundColor: Colors.black,
    alignSelf: 'center',
    borderRadius: ms(10),
    marginTop: vs(10),
    marginBottom: vs(4),
  },
  sectionTitle: {
    fontFamily: Typography.SemiBold.fontFamily,
    fontSize: fontSize(14),
    paddingHorizontal: ms(20),
    paddingVertical: vs(10),
  },
  nOftext: {
    color: Colors.borderColor1,
    fontSize: fontSize(14),
    fontFamily: Typography.Medium.fontFamily,
  },
  dottedLine: {
    borderBottomWidth: 1.4,
    borderBottomColor: '#E4E4EB',
    borderStyle: 'dashed',
    marginVertical: ms(4),
    marginHorizontal: ms(16),
    marginBottom: vs(8),
  },
  emptyContainer: {
    paddingVertical: vs(40),
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize(14),
    fontFamily: Typography.Regular.fontFamily,
    color: Colors.borderColor1,
  },

  // ── CTA button ─────────────────────────────────────────────────────────────
  ctaContainer: {
    position: 'absolute',
    bottom: vs(20),
    left: 0,
    right: 0,
    paddingHorizontal: ms(16),
  },
  pickupButton: {
    backgroundColor: Colors.orange,
    borderRadius: ms(10),
    height: vs(50),
    width: '100%',
    alignSelf: 'center',
  },
  deliverButton: {
    backgroundColor: Colors.green2,
    borderRadius: ms(10),
    height: vs(50),
    width: '100%',
    alignSelf: 'center',
  },
  buttonDisabled: { opacity: 0.7 },
});





// import React, {
//   useEffect,
//   useState,
//   useContext,
//   useRef,
//   useCallback,
// } from 'react';
// import {
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
//   ActivityIndicator,
//   Image,
//   Linking,
//   Alert,
//   Platform,
//   Dimensions,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useFocusEffect, useIsFocused } from '@react-navigation/native';

// // ── Components ───────────────────────────────────────────────────────────────
// import CustomerInfoCard from '../../components/cards/CustmerInfoCard';
// import InfoRow from '../../components/Row/InfoRow';
// import Colors from '../../utils/colors';
// import { fontSize, hp, ms, vs } from '../../utils/responsive';
// import { Typography } from '../../utils/typography';
// import { MapPin, Map, Store } from 'lucide-react-native';
// import CustomButton from '../../components/Buttons/CustomButton';
// import SuccessModal from '../../components/modals/SuccessModal';
// import Greenticksvg from '../../assets/svg/Greenticksvg';
// import RenderItem from '../../components/RenderItem/RenderItem';
// import { FlashList } from '@shopify/flash-list';

// // ── Hooks ────────────────────────────────────────────────────────────────────
// import { useOrdersContext } from '../../context/OrdersContext'; // ✅ NEW: Global orders
// import { useMapLocation } from '../../hooks/useMapLocation';
// import { pickedOrder } from '../../services/Orders/order.api';
// import { logger } from '../../utils/logger';
// import MapViewComponent from '../../components/Map/MapViewComponent';
// import { useToast } from '../../hooks/ToastProvider';
// import LocationService from '../../hooks/LocationModule.android';
// import { useUserLocation } from '../../hooks/useUserLocation';
// import ChatService from '../../services/Chat/ChatService';
// import { makePhoneCall } from '../../utils/phoneCall';
// import PermissionFlowModal from '../../components/modals/PermissionFlowModal';
// import { useAppPermissions } from '../../hooks/useAppPermissions';
// import RunnerOrderItemsModal from '../../components/modals/RunnerOrderItemsModalProps';

// // ── Context ──────────────────────────────────────────────────────────────────
// import { AuthContext } from '../../context/AuthContext';

// // ── Services ─────────────────────────────────────────────────────────────────
// import { SOCKET_EVENTS } from '../../services/Socket/SocketEvents';
// import { useOrderSocket } from '../../hooks/useSocketListener';

// // ────────────────────────────────────────────────────────────────────────────
// // CONSTANTS
// // ────────────────────────────────────────────────────────────────────────────

// const SCREEN_HEIGHT = Dimensions.get('window').height;
// const sheetMaxHeight = 0.20;
// const bottomSheetHeight = SCREEN_HEIGHT * sheetMaxHeight;

// // ────────────────────────────────────────────────────────────────────────────
// // HELPER FUNCTIONS
// // ────────────────────────────────────────────────────────────────────────────

// /**
//  * Safely parse a coordinate value
//  */
// const safeCoord = (val: any): number | null => {
//   const n = parseFloat(val);
//   return isNaN(n) || n === 0 ? null : n;
// };

// // ════════════════════════════════════════════════════════════════════════════
// // CUSTOMER INFO SCREEN
// // ════════════════════════════════════════════════════════════════════════════

// const CustomerInfoScreen = ({ navigation, route }: any) => {
//   const insets = useSafeAreaInsets();
//   const isFocused = useIsFocused();

//   // ══════════════════════════════════════════════════════════════════════════
//   // STATE
//   // ══════════════════════════════════════════════════════════════════════════

//   const [showPermissionModal, setShowPermissionModal] = useState(false);
//   const [showSlideModal, setShowSlideModal] = useState(true);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [isPickingUp, setIsPickingUp] = useState(false);
//   const [isDelivering, setIsDelivering] = useState(false);
//   const [isDelivered, setIsDelivered] = useState(false);
//   const [isNavigatingAway, setIsNavigatingAway] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [lastMessage, setLastMessage] = useState<string | undefined>(undefined);

//   // ══════════════════════════════════════════════════════════════════════════
//   // REFS
//   // ══════════════════════════════════════════════════════════════════════════

//   const isDeliveredRef = useRef(false);
//   const hasFetchedRef = useRef(false);
//   const runnerCoordsRef = useRef<any>(null);
//   const isPerformingActionRef = useRef(false);
//   const chatUnsubscribeRef = useRef<(() => void) | null>(null);

//   // ══════════════════════════════════════════════════════════════════════════
//   // CONTEXT & HOOKS
//   // ══════════════════════════════════════════════════════════════════════════

//   const { user } = useContext(AuthContext) || {};
//   const { toast } = useToast();
//   const { refetch: fetchIOSLocation } = useUserLocation();
//   const { ensureLocationAccess } = useAppPermissions();

//   // ✅ USE GLOBAL ORDERS CONTEXT
//   const { state: ordersState, dispatchAction } = useOrdersContext();

//   // Extract current order from global state
//   const orderId = route?.params?.orderId || route?.params?.order?.id;
//   const currentOrder = ordersState.orders.find((o) => o.id === orderId);

//   // Fallback to route order if not in global state yet
//   const order = route?.params?.order || currentOrder;

//   // ══════════════════════════════════════════════════════════════════════════
//   // LOCATION HELPER
//   // ══════════════════════════════════════════════════════════════════════════

//   const fetchLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
//     try {
//       if (Platform.OS === 'android') {
//         const data = await LocationService.getCurrentLocation();
//         return { latitude: data.latitude, longitude: data.longitude };
//       }
//       return await fetchIOSLocation();
//     } catch (err) {
//       logger.error('fetchLocation error:', err);
//       return null;
//     }
//   };

//   const loadLocationSafely = async (): Promise<{ latitude: number; longitude: number } | null> => {
//     const access = await ensureLocationAccess();

//     if (access.status === 'NO_PERMISSION' || access.status === 'SERVICES_DISABLED') {
//       setShowPermissionModal(true);
//       return null;
//     }

//     return await fetchLocation();
//   };

//   // ══════════════════════════════════════════════════════════════════════════
//   // DERIVED VALUES
//   // ══════════════════════════════════════════════════════════════════════════

//   const orderStatus = order?.status ?? 'assigned';
//   const isPickedUp = isDeliveredRef.current ? true : orderStatus === 'picked_up';

//   const outletName = order?.Outlet?.name ?? '';
//   const outletAddress = order?.Outlet?.address ?? '';
//   const outletLat = safeCoord(order?.Outlet?.location_lat);
//   const outletLng = safeCoord(order?.Outlet?.location_lng);
//   const deliveryLat = safeCoord(order?.delivery_lat);
//   const deliveryLng = safeCoord(order?.delivery_lng);

//   const customerName = order?.User?.display_name ?? 'Customer';
//   const customerPhone = order?.User?.phone ?? '';
//   const customerImage = order?.User?.image_url ?? 'https://randomuser.me/api/portraits/women/44.jpg';
//   const customerId = order?.User?.id ?? '—';

//   const customerNote = order?.delivery_text ?? '';
//   const orderLines = order?.OrderLines ?? [];
//   const totalCents = parseInt(order?.total_cents ?? '0', 10);
//   const currency = order?.currency ?? 'USD';
//   const deliveryLocation = order?.delivery_address || 'No Address';

//   // Target switches between outlet (before pickup) and customer (after pickup)
//   const targetLat = isPickedUp ? deliveryLat : outletLat;
//   const targetLng = isPickedUp ? deliveryLng : outletLng;

//   // ══════════════════════════════════════════════════════════════════════════
//   // MAP LOCATION HOOK
//   // ══════════════════════════════════════════════════════════════════════════

//   const {
//     runnerCoords,
//     routeCoords,
//     isLoadingLocation,
//     isRouteLoading,
//     fetchRunnerLocation,
//     fetchRoute,
//     mapRegion,
//     distance,
//   } = useMapLocation(targetLat, targetLng);

//   // ══════════════════════════════════════════════════════════════════════════
//   // SOCKET LISTENERS
//   // ══════════════════════════════════════════════════════════════════════════

//   /**
//    * Listen to order socket events
//    */
//   useOrderSocket((event, data) => {
//     if (!isFocused) return;

//     const socketOrderId = data.orderId || data.order_id || data.id;
//     const socketRunnerId = data.runnerId || data.runner_id;
//     const currentOrderId = order?.id;
//     const currentUserId = user?.id;

//     logger.log('📡 Order socket event in CustomerInfo:', event, {
//       socketOrderId,
//       socketRunnerId,
//       currentOrderId,
//       currentUserId,
//     });

//     // Only handle events for the current order
//     if (socketOrderId !== currentOrderId) {
//       logger.log('⏭️ Event is for different order, ignoring');
//       return;
//     }

//     // Skip if action was performed by current user
//     if (socketRunnerId === currentUserId && isPerformingActionRef.current) {
//       logger.log('⏭️ Skipping socket action - performed by current user');
//       isPerformingActionRef.current = false;
//       return;
//     }

//     // ✅ Handle ORDER_PICKED_UP event
//     if (event === SOCKET_EVENTS.ORDER_PICKED_UP) {
//       logger.log('📦 Order picked up via socket:', socketOrderId);

//       if (!isDeliveredRef.current) {
//         // Update local order state
//         if (socketRunnerId === currentUserId) {
//           // This is our action, suppress duplicate toast
//         } else {
//           toast?.('Order marked as picked up', 'success', 2000);
//         }
//       }
//     }

//     // ✅ Handle ORDER_DELIVERED event
//     if (event === SOCKET_EVENTS.ORDER_DELIVERED) {
//       logger.log('✅ Order delivered via socket:', socketOrderId);

//       isDeliveredRef.current = true;
//       setIsNavigatingAway(true);
//       setIsDelivered(true);
//       setShowSlideModal(false);

//       if (socketRunnerId !== currentUserId) {
//         toast?.('Order delivered successfully!', 'success', 2000);
//       }

//       setTimeout(() => {
//         setShowSuccessModal(true);
//       }, 500);
//     }

//     // ✅ Handle ORDER_READY event
//     if (event === SOCKET_EVENTS.ORDER_READY) {
//       logger.log('🍕 Order ready for pickup via socket:', socketOrderId);
//       // Order details may have changed, but no need to refresh since
//       // we already have the order info
//     }
//   });

//   // ══════════════════════════════════════════════════════════════════════════
//   // EFFECTS
//   // ══════════════════════════════════════════════════════════════════════════

//   /**
//    * Mount: Fetch location and initialize
//    */
//   useEffect(() => {
//     if (hasFetchedRef.current) return;
//     hasFetchedRef.current = true;

//     const init = async () => {
//       const coords = await loadLocationSafely();
//       if (!coords?.latitude || !coords?.longitude) {
//         return;
//       }
//       fetchRunnerLocation();
//     };

//     init();
//   }, [fetchRunnerLocation]);

//   /**
//    * Update runner coords ref
//    */
//   useEffect(() => {
//     runnerCoordsRef.current = runnerCoords;
//   }, [runnerCoords]);

//   /**
//    * Re-fetch route when destination changes (pickup → delivery)
//    */
//   useEffect(() => {
//     if (isDeliveredRef.current) return;
//     if (runnerCoordsRef.current && targetLat && targetLng) {
//       fetchRoute(targetLat, targetLng);
//     }
//   }, [targetLat, targetLng, fetchRoute]);

//   /**
//    * Refresh when screen comes back into focus
//    */
//   useFocusEffect(
//     useCallback(() => {
//       logger.log('CustomerInfoScreen: useFocusEffect');
//       if (!hasFetchedRef.current || isDeliveredRef.current) return;

//       fetchRunnerLocation();
//     }, [fetchRunnerLocation])
//   );

//   /**
//    * Block back navigation until delivered
//    */
//   useEffect(() => {
//     const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
//       if (isDelivered || isNavigatingAway) return;

//       e.preventDefault();
//       Alert.alert(
//         'Order in Progress',
//         'You cannot go back until the order is delivered.',
//         [{ text: 'OK', style: 'cancel' }],
//       );
//     });

//     return unsubscribe;
//   }, [navigation, isDelivered, isNavigatingAway]);

//   // ══════════════════════════════════════════════════════════════════════════
//   // EVENT HANDLERS
//   // ══════════════════════════════════════════════════════════════════════════

//   /**
//    * Mark order as picked up
//    */
//   const handlePickedUp = async () => {
//     try {
//       setIsPickingUp(true);
//       isPerformingActionRef.current = true;

//       const currentOrderId = order?.id;
//       const res = await pickedOrder(currentOrderId);

//       if (res?.success && !isDeliveredRef.current) {
//         // ✅ Update global state with picked_up status
//         dispatchAction({
//           type: 'SET_ORDERS',
//           payload: ordersState.orders.map((o) =>
//             o.id === currentOrderId ? { ...o, status: 'picked_up' } : o
//           ),
//         });
//       }

//       setTimeout(() => {
//         isPerformingActionRef.current = false;
//       }, 2000);
//     } catch (e) {
//       logger.log('handlePickedUp error', e);
//       isPerformingActionRef.current = false;
//     } finally {
//       setIsPickingUp(false);
//     }
//   };

//   /**
//    * Deliver order
//    */
//   const handleDeliverOrder = async () => {
//     try {
//       setIsDelivering(true);
//       isPerformingActionRef.current = true;

//       const currentOrderId = order?.id;
      
//       // Make API call to deliver order
//       const res = await pickedOrder(currentOrderId); // or your deliver API
      
//       if (res?.success) {
//         isDeliveredRef.current = true;
//         setIsNavigatingAway(true);
//         setIsDelivered(true);
//         setShowSlideModal(false);

//         // ✅ Update global state: remove order from list
//         dispatchAction({
//           type: 'REMOVE_ORDER',
//           payload: currentOrderId,
//         });

//         setShowSuccessModal(true);
//       }

//       setTimeout(() => {
//         isPerformingActionRef.current = false;
//       }, 2000);
//     } catch (e) {
//       logger.log('handleDeliverOrder error', e);
//       isPerformingActionRef.current = false;
//     } finally {
//       setIsDelivering(false);
//     }
//   };

//   /**
//    * Open chat screen
//    */
//   const handleChat = () => {
//     setUnreadCount(0);
//     setLastMessage(undefined);
//     navigation.navigate('Chat', {
//       orderId,
//       customerId,
//       customerName,
//       customerPhone,
//       customerImage,
//       runnerName: user?.display_name,
//       runnerImage: user?.image_url,
//       runnerId: user?.id,
//     });
//   };

//   /**
//    * Call customer
//    */
//   const handleCall = async () => {
//     await makePhoneCall(customerPhone || '', 'Customer', toast);
//   };

//   // ══════════════════════════════════════════════════════════════════════════
//   // DYNAMIC HEIGHTS
//   // ══════════════════════════════════════════════════════════════════════════

//   const MAP_HEIGHT = hp(60);

//   const itemCount = orderLines?.length ?? 0;
//   const sheetMaxHeight =
//     itemCount === 0 ? 0.1
//       : itemCount === 1 ? 0.15
//       : itemCount === 2 ? 0.2
//       : itemCount === 3 ? 0.25
//       : itemCount <= 5 ? 0.55
//       : 0.55;

//   // ══════════════════════════════════════════════════════════════════════════
//   // RENDER
//   // ══════════════════════════════════════════════════════════════════════════

//   return (
//     <View style={styles.mainContainer}>
//       {/* ── Main scroll ────────────────────────────────────────────────── */}
//       <ScrollView
//         style={{ flex: 1 }}
//         contentContainerStyle={{
//           paddingBottom: bottomSheetHeight,
//         }}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* ── Map ─────────────────────────────────────────────────────── */}
//         <View style={[styles.mapContainer, { height: MAP_HEIGHT }]}>
//           {mapRegion ? (
//             <MapViewComponent
//               runnerCoords={runnerCoords}
//               targetLat={targetLat}
//               targetLng={targetLng}
//               mapRegion={mapRegion}
//               isPickedUp={isPickedUp}
//               outletName={outletName}
//               customerName={customerName}
//               customerImage={customerImage}
//               outletImage={order?.Outlet?.image_url}
//               runnerImage={user?.image_url}
//               routeCoordinates={routeCoords}
//               isRouteLoading={isRouteLoading}
//               isLoading={isLoadingLocation}
//               outletLat={outletLat}
//               outletLng={outletLng}
//               customerLat={deliveryLat}
//               customerLng={deliveryLng}
//             />
//           ) : (
//             <View style={styles.mapFallback}>
//               <ActivityIndicator size="small" color={Colors.orange} />
//               <Text style={styles.fallbackText}>Loading map...</Text>
//             </View>
//           )}
//         </View>

//         {/* ── Info cards ──────────────────────────────────────────────── */}
//         <View style={styles.contentContainer}>
//           {/* Outlet view — before pickup */}
//           {!isPickedUp && (
//             <>
//               <View style={styles.outletCard}>
//                 <View style={styles.outletHeader}>
//                   {order?.Outlet?.image_url ? (
//                     <Image
//                       source={{ uri: order?.Outlet?.image_url }}
//                       style={styles.markerImage}
//                     />
//                   ) : (
//                     <View style={styles.outletIconContainer}>
//                       <Store size={ms(24)} color={Colors.orange} />
//                     </View>
//                   )}
//                   <View style={styles.outletInfo}>
//                     <View style={styles.outletHeaderRow}>
//                       <Text style={styles.outletLabel}>Pick up from</Text>
//                       <Text style={styles.orderId}>#{orderId}</Text>
//                     </View>
//                     <Text style={styles.outletName}>{outletName}</Text>
//                   </View>
//                 </View>
//                 <View style={styles.outletDivider} />
//                 <InfoRow
//                   Icon={<MapPin size={16} color={Colors.borderColor1} />}
//                   title="Address"
//                   subtitle={outletAddress}
//                   IconPosition="right"
//                   subtitleStyle={styles.subtextStyle}
//                   iconStyle={styles.iconStyle}
//                 />
//                 <InfoRow
//                   Icon={<Map size={16} color={Colors.borderColor1} />}
//                   title="Distance"
//                   subtitle={distance}
//                   IconPosition="right"
//                   subtitleStyle={styles.subtextStyle}
//                   iconStyle={styles.iconStyle}
//                 />
//               </View>
//             </>
//           )}

//           {/* Customer view — after pickup */}
//           {isPickedUp && (
//             <>
//               <CustomerInfoCard
//                 orderId={String(orderId)}
//                 customerId={String(customerId)}
//                 name={customerName}
//                 room={outletName}
//                 image={customerImage}
//                 onCall={handleCall}
//                 onMessage={handleChat}
//                 style={styles.customerInfoCardStyle}
//                 unreadCount={unreadCount}
//                 lastMessage={lastMessage}
//               />

//               <View style={styles.infoRowStyle}>
//                 {customerNote ? (
//                   <>
//                     <Text style={styles.titleNote}>Customer Note</Text>
//                     <Text style={styles.descriptionTextStyle}>
//                       {customerNote}
//                     </Text>
//                   </>
//                 ) : (
//                   <View style={{ marginTop: hp(1) }} />
//                 )}

//                 <InfoRow
//                   title="Location"
//                   subtitle={deliveryLocation}
//                   Icon={<MapPin size={16} color={Colors.borderColor1} />}
//                   IconPosition="right"
//                   subtitleStyle={styles.subtextStyle}
//                   iconStyle={styles.iconStyle}
//                 />
//               </View>
//             </>
//           )}
//         </View>
//       </ScrollView>

//       {/* ── Bottom Sheet ──────────────────────────────────────────────– */}
//       <RunnerOrderItemsModal
//         visible={showSlideModal && !isDelivered}
//         onClose={() => setShowSlideModal(false)}
//         orderItems={orderLines}
//         isPickedUp={isPickedUp}
//         isPickingUp={isPickingUp}
//         isDelivering={isDelivering}
//         onPickup={handlePickedUp}
//         onDeliver={handleDeliverOrder}
//         maxHeightPercentage={sheetMaxHeight}
//         minHeightPercentage={0.1}
//       />

//       {/* ── Success Modal ──────────────────────────────────────────────– */}
//       <SuccessModal
//         icon={Greenticksvg}
//         visible={showSuccessModal}
//         onClose={() => {}}
//         onPress={() => {
//           setShowSuccessModal(false);
//           navigation.reset({
//             index: 0,
//             routes: [{ name: 'Home' }],
//           });
//         }}
//         title="Successfully Delivered!"
//         message="Your order has been delivered successfully."
//       />

//       {/* ── Permission Modal ──────────────────────────────────────────– */}
//       <PermissionFlowModal
//         visible={showPermissionModal}
//         onComplete={() => setShowPermissionModal(false)}
//       />
//     </View>
//   );
// };

// export default CustomerInfoScreen;

// // ════════════════════════════════════════════════════════════════════════════
// // STYLES
// // ════════════════════════════════════════════════════════════════════════════

// const styles = StyleSheet.create({
//   mainContainer: { flex: 1, backgroundColor: Colors.white },

//   mapContainer: {
//     width: '100%',
//     marginBottom: ms(16),
//   },
//   mapFallback: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#eef2f6',
//     gap: vs(8),
//   },
//   fallbackText: {
//     fontSize: fontSize(13),
//     fontFamily: Typography.Regular.fontFamily,
//     color: Colors.borderColor1,
//   },

//   contentContainer: {
//     marginHorizontal: ms(16),
//     gap: ms(12),
//   },

//   outletCard: {
//     backgroundColor: Colors.customerInfoCardBg,
//     borderRadius: ms(14),
//     padding: ms(16),
//   },
//   outletHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: ms(12),
//     marginBottom: vs(12),
//   },
//   outletHeaderRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   markerImage: { width: ms(48), height: ms(48), borderRadius: ms(24) },
//   outletIconContainer: {
//     width: ms(48),
//     height: ms(48),
//     borderRadius: ms(24),
//     backgroundColor: Colors.white,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   outletInfo: { flex: 1 },
//   outletLabel: {
//     fontSize: fontSize(12),
//     fontFamily: Typography.Regular.fontFamily,
//     color: Colors.borderColor1,
//   },
//   orderId: {
//     fontSize: fontSize(16),
//     color: Colors.black,
//     ...Typography.SemiBold,
//   },
//   outletName: {
//     fontSize: fontSize(16),
//     fontFamily: Typography.Bold.fontFamily,
//     color: Colors.black1,
//     marginTop: vs(2),
//   },
//   outletDivider: {
//     height: 1,
//     backgroundColor: Colors.borderColor,
//     marginBottom: vs(12),
//   },

//   infoContainer: {
//     backgroundColor: Colors.customerInfoCardBg,
//     paddingHorizontal: ms(16),
//     borderRadius: ms(14),
//     paddingTop: vs(8),
//   },
//   subtextStyle: { marginLeft: 0 },
//   iconStyle: { marginLeft: 5 },

//   totalContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: Colors.customerInfoCardBg,
//     paddingHorizontal: ms(16),
//     paddingVertical: vs(14),
//     borderRadius: ms(14),
//   },
//   totalLabel: {
//     fontSize: fontSize(14),
//     fontFamily: Typography.Medium.fontFamily,
//     color: Colors.borderColor1,
//   },
//   totalValue: {
//     fontSize: fontSize(16),
//     fontFamily: Typography.Bold.fontFamily,
//     color: Colors.black1,
//   },

//   customerInfoCardStyle: { maxHeight: hp(20) },
//   infoRowStyle: {
//     backgroundColor: Colors.customerInfoCardBg,
//     paddingHorizontal: ms(16),
//     borderRadius: ms(14),
//   },
//   titleNote: {
//     color: Colors.borderColor1,
//     fontSize: fontSize(14),
//     fontFamily: Typography.Medium.fontFamily,
//     paddingVertical: ms(8),
//   },
//   descriptionTextStyle: {
//     fontFamily: Typography.Regular.fontFamily,
//     fontSize: fontSize(12),
//     color: Colors.black,
//     paddingBottom: ms(8),
//   },
// });