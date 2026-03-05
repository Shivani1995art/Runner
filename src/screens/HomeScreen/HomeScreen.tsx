// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import {
//   StyleSheet, View, ScrollView, StatusBar,
//   Text, Platform, RefreshControl,
//   Button
// } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // ── Components ───────────────────────────────────────────────────────────────
// import CustomHeaderHome from '../../components/common/CustomHeaderHome';
// import DateCard from '../../components/cards/DateCard';
// import OrderCard from '../../components/cards/OrderCard';
// import RenderItem from '../../components/RenderItem/RenderItem';
// import CustomButton from '../../components/Buttons/CustomButton';
// import BottomGradientModal from '../../components/modals/BottomGradientModal';
// import OrderCardShimmer from '../../components/OrderCardShimmer';
// import OrderItemShimmer from '../../components/OrderItemShimmer';
// import { FlashList } from '@shopify/flash-list';

// // ── SVGs ─────────────────────────────────────────────────────────────────────
// import Notification from '../../assets/svg/Notification';

// // ── Hooks ────────────────────────────────────────────────────────────────────
// import { useContext } from 'react';
// import { useOrders } from '../../hooks/useOrders';
// import { useUserLocation } from '../../hooks/useUserLocation';
// import { useToast } from '../../hooks/ToastProvider';
// import { useAuth } from '../../hooks/useAuth';
// import useNotificationSetup from '../../hooks/useNotificationSetup';

// // ── Context ───────────────────────────────────────────────────────────────────
// import { AuthContext } from '../../context/AuthContext';

// // ── Services ──────────────────────────────────────────────────────────────────
// import LocationService from '../../hooks/LocationModule.android';

// // ── Utils ─────────────────────────────────────────────────────────────────────
// import { vs, ms, fontSize, hp } from '../../utils/responsive';
// import { Typography } from '../../utils/typography';
// import Colors from '../../utils/colors';
// import { logger } from '../../utils/logger';
// import NotificationAlertDialog from '../../components/modals/NotificationAlertDialog';
// import NotificationService from '../../services/NotificationService/NotificationService';
// import { useAppPermissions } from '../../hooks/useAppPermissions';
// import PermissionFlowModal from '../../components/modals/PermissionFlowModal';
// //import OrderSocketManager from '../../services/Socket/OrderSocketManager';
// import { testSocket } from '../../utils/testSocket';

// // ─────────────────────────────────────────────────────────────────────────────
// // Helpers
// // ─────────────────────────────────────────────────────────────────────────────

// const formatDate = (date?: string) => {
//   const d = date ? new Date(date) : new Date();
//   return d.toLocaleDateString(undefined, {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//   });
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // HomeScreen
// // ─────────────────────────────────────────────────────────────────────────────

// const HomeScreen = ({ navigation, route }) => {
//   const [showPermissionModal, setShowPermissionModal] = useState(false);
// // Inside your component:
// const insets = useSafeAreaInsets();
//  // ── Notification Alert Dialog State ────────────────────────────────────────
//   const [notifAlert, setNotifAlert] = useState<{
//     visible: boolean;
//     title: string;
//     body: string;
//   }>({ visible: false, title: '', body: '' });

//   // ── Local State ─────────────────────────────────────────────────────────────
//   const [showSlideModal, setShowSlideModal]   = useState(false);
//   const [selectedOrder, setSelectedOrder]     = useState<any>(null);
//   const [isRefreshing, setIsRefreshing]       = useState(false);

//   // ── Context ──────────────────────────────────────────────────────────────────
//   const { user, outlet } = useContext(AuthContext);

//   // ── Hooks ────────────────────────────────────────────────────────────────────

//   const { saveToken }   = useAuth();
//   const { location: iosLocation, refetch: fetchIOSLocation }  = useUserLocation();
//   const { ensureLocationAccess } = useAppPermissions();
//   const {
//     orders,
//     loadOrders,
//     loadRunnerStatus,
//     runnerStatus,
//     setRunnerStatus,
//     toggleRunnerDuty,
//     isLoadingOrders,
//     isLoadingStatus,
//     isAccepting,
//     handleAcceptOrder,
//   } = useOrders();

//   // ── Route Params ─────────────────────────────────────────────────────────────
//   // initialStatus is passed from AppBootstrap to avoid a duplicate API call on mount
//   const initialStatus = route?.params?.initialStatus;

  

  
//   // ─────────────────────────────────────────────────────────────────────────────
//   // Notification Setup
//   // Handles FCM token save + notification tap navigation for both iOS & Android
//   // ─────────────────────────────────────────────────────────────────────────────
//   useNotificationSetup(true, saveToken, (data) => {
//     logger.log('Notification tapped, data:', data);
//     if (data?.screen === 'order') {
//       navigation.navigate('CustomerInfoScreen', { orderId: data.order_id });
//     }
//   });

//   // ─────────────────────────────────────────────────────────────────────────────
//   // Location Helpers
//   // ─────────────────────────────────────────────────────────────────────────────

//   /** Android: fetch native GPS location */
//   const fetchAndroidLocation = async () => {
//     try {
//       const locationData = await LocationService.getCurrentLocation();
//       return { latitude: locationData.latitude, longitude: locationData.longitude };
//     } catch (error) {
//       logger.error('Error fetching Android location:', error);
//       return { latitude: 0, longitude: 0 };
//     }
//   };


// const fetchLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
//   const access = await ensureLocationAccess();

//   if (access.status === 'NO_PERMISSION') {
//     setShowPermissionModal(true);
//     return null;
//   }

//   if (access.status === 'SERVICES_DISABLED') {
//     setShowPermissionModal(true);
//     return null;
//   }

//   // Only now fetch location
//   return await LoadLocation();
// };

//   /** Unified location fetch for both platforms */
//   // const LoadLocation = async () => {
//   //   if (Platform.OS === 'android') return await fetchAndroidLocation();
//   //   logger.log('Fetching iOS location...');
//   //   return await fetchIOSLocation();
//   // };


// const LoadLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
//   try {
//     if (Platform.OS === 'android') {
//       return await fetchAndroidLocation();
//     }

//     logger.log('Fetching iOS location...');
//     return await fetchIOSLocation();
//   } catch (e) {
//     logger.log('LoadLocation error:', e);
//     return null;
//   }
// };

//   // ── Register foreground alert handler ──────────────────────────────────────
//   // useEffect(() => {
//   //   const handler = (title: string, body: string) => {
//   //     setNotifAlert({ visible: true, title, body });
//   //   };

//   //   NotificationService.addForegroundAlertHandler(handler);

//   //   return () => {
//   //     NotificationService.removeForegroundAlertHandler(handler);
//   //   };
//   // }, []);

//   // ─────────────────────────────────────────────────────────────────────────────
//   // Initial Load (on mount)
//   // 1. Use initialStatus from AppBootstrap if available (skip extra API call)
//   // 2. Otherwise fetch runner status fresh
//   // 3. If on duty → fetch location → load available orders
//   // ─────────────────────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const init = async () => {
//       let status = initialStatus;

//       if (!status) {
//         // No status passed — fetch fresh from API
//         const fetchedStatus = await loadRunnerStatus((assignment) => {
//           navigation.navigate('CustomerInfoScreen', { order: assignment });
//         });
//         status = fetchedStatus;
//       } else {
//         // Use pre-fetched status from AppBootstrap
//         setRunnerStatus(status);
//         logger.log('Using initialStatus from AppBootstrap:', status);
//       }

//       // Load orders only if runner is on duty
//       if (status?.is_on_duty) {
//         const coords = await fetchLocation();
//         logger.log('Initial load coords:', coords);
//         if (coords?.latitude && coords?.longitude) {
//           await loadOrders(coords.latitude, coords.longitude);
//         }
//       }
//     };

//     init();
//   }, [initialStatus]);

// useFocusEffect(
//   useCallback(() => {
//     // 1. Define the async logic
//     const fetchStatus = async () => {
//       try {
//         logger.log('Fetching status in focus effect');
//         const fetchedStatus = await loadRunnerStatus((assignment) => {
//           navigation.navigate('CustomerInfoScreen', { order: assignment });
//         });
//       } catch (error) {
//         console.error("Failed to load status:", error);
//       }
//     };

//     // 2. Execute it
//     fetchStatus();

//     return () => {
//       // Clean up logic here (cancel subscriptions, etc.)
//     };
//   }, [navigation]) // Added navigation as a dependency
// );

//   // ─────────────────────────────────────────────────────────────────────────────
//   // Reload Orders on Screen Focus
//   // Refreshes order list every time user navigates back to this screen
//   // (e.g. after completing a delivery from CustomerInfoScreen)
//   // ─────────────────────────────────────────────────────────────────────────────
//   useFocusEffect(
//     useCallback(() => {
//       // Skip the very first focus since useEffect above handles initial load
//       if (!runnerStatus) return;

//       const reloadOnFocus = async () => {
//         if (!runnerStatus?.is_on_duty) return;

//         const coords = await fetchLocation();
//         logger.log('Focus reload coords:', coords);
//         if (coords?.latitude && coords?.longitude) {
//           await loadOrders(coords.latitude, coords.longitude);
//         }
//       };

//       reloadOnFocus();
//     }, [runnerStatus?.is_on_duty])
//   );




//   // ─────────────────────────────────────────────────────────────────────────────
//   // Pull-to-Refresh
//   // ─────────────────────────────────────────────────────────────────────────────
//   const onRefresh = useCallback(async () => {
//     setIsRefreshing(true);
//     try {
//       const coords = await fetchLocation();
//       logger.log('Refresh coords:', coords);
//       if (coords?.latitude && coords?.longitude) {
//         await loadOrders(coords.latitude, coords.longitude);
//       }
//     } finally {
//       setIsRefreshing(false);
//     }
//   }, []);

//   // ─────────────────────────────────────────────────────────────────────────────
//   // Order Helpers
//   // ─────────────────────────────────────────────────────────────────────────────

//   /** Re-fetch orders after an "already assigned" conflict */
//   const refreshOrders = async () => {
//     if (!runnerStatus?.is_on_duty) return;
//     const coords = await fetchLocation();
//     if (coords?.latitude && coords?.longitude) {
//       await loadOrders(coords.latitude, coords.longitude);
//     }
//   };

//   // ─────────────────────────────────────────────────────────────────────────────
//   // Handlers
//   // ─────────────────────────────────────────────────────────────────────────────

//   const handleNotificationPress = () => console.log('Notification pressed');

//   /** Toggle on/off duty — fetches location first */
//   const handleTakeBreak = async () => {
//     logger.log('handleTakeBreak');
//     const coords = await fetchLocation();
//     await toggleRunnerDuty(coords?.latitude, coords?.longitude, (assignment: any) => {
//       logger.log('Assignment received:', assignment);
//       navigation.navigate('CustomerInfoScreen', { order: assignment });
//     });
//   };

//   /** Open order detail modal */
//   const handlePressAcceptOrder = async (orderId: number) => {
//     const order = orders.find((o) => o.id === orderId);
//     setSelectedOrder(order);
//     setShowSlideModal(true);
//   };

//   /** Confirm accept from modal */
//   const onPressAccept = async () => {
//     try {
//       await handleAcceptOrder(
//         selectedOrder?.id,
//         (acceptedOrder) => {
//           logger.log('Accepted order:', acceptedOrder);
//           navigation.navigate('CustomerInfoScreen', {
//             order: acceptedOrder ?? selectedOrder,
//           });
//         },
//         () => {
//           logger.log('Order already assigned — refreshing list');
//           refreshOrders();
//         }
//       );
//     } catch (error) {
//       logger.log('Accept order error:', error);
//     } finally {
//       setShowSlideModal(false);
//     }
//   };

//   // ── Modal height based on number of items ────────────────────────────────────
//   const itemCount              = selectedOrder?.order_lines?.length ?? 0;
//  // const modalHeightPercentage  = itemCount <= 1 ? 0.52 : 0.60;
// // List height: fixed when >2 items so button stays visible, auto when ≤2
// // ── Modal height grows with item count ───────────────────────────────────────


// const modalHeightPercentage = itemCount <= 1 ? 0.50
//   : itemCount === 2             ? 0.60
//   : itemCount === 3             ? 0.65
//   : 0.75; // 4+ items → 75% of screen

// // List height also grows with items
// const listHeight = itemCount <= 1 ? hp(30)
//   : itemCount === 2              ? hp(20)
//   : itemCount === 3              ? hp(28)
//   : hp(38); // 4+ items → fixed scrollable height
//   // ─────────────────────────────────────────────────────────────────────────────
//   // Render
//   // ─────────────────────────────────────────────────────────────────────────────
//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

//       {/* ── Header ──────────────────────────────────────────────────────────── */}
//       <CustomHeaderHome
//         profileImage={user?.image_url}
//         displayName={user?.display_name}
//         location={outlet?.name}
//         onNotificationPress={handleNotificationPress}
//         NotificationIcon={<Notification />}
//         onPress={() => navigation.navigate('ProfileScreen')}
//       />

//  {/* <Button
//       title="Test Socket"
//       onPress={testSocket}
//     /> */}

//       {/* ── Date / Duty Card ─────────────────────────────────────────────────── */}
//       <View style={{ paddingHorizontal: ms(16) }}>
//         <DateCard
//           date={formatDate(runnerStatus?.last_clock_in)}
//           deliveryCount={runnerStatus?.total_delivered || 0}
//           takeBreakText={runnerStatus?.is_on_duty ? 'Take Break' : 'Resume Duty'}
//           loading={isLoadingStatus}
//           onTakeBreak={handleTakeBreak}
//         />
//       </View>

//       {/* ── Orders List ──────────────────────────────────────────────────────── */}
//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollViewContent}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={isRefreshing}
//             onRefresh={onRefresh}
//             colors={[Colors.orange]}
//             tintColor={Colors.orange}
//           />
//         }
//       >
//         {/* Off duty */}
//         {runnerStatus?.is_on_duty === false ? (
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyTitle}>You're on a break</Text>
//             <Text style={styles.emptySubtitle}>Resume duty to see available orders</Text>
//           </View>

//         /* Loading skeletons */
//         ) : isLoadingOrders || isRefreshing ? (
//           <>
//             <OrderCardShimmer />
//             <OrderCardShimmer />
//             <OrderCardShimmer />
//           </>

//         /* Empty state */
//         ) : orders.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyTitle}>No orders available</Text>
//             <Text style={styles.emptySubtitle}>New orders will appear here</Text>
//           </View>

//         /* Orders list */
//         ) : (
//           <FlashList
//             data={orders}
//             estimatedItemSize={100}
//             removeClippedSubviews
//             keyExtractor={(item) => String(item.id)}
//             renderItem={({ item }) => (
//               <OrderCard
//                 distance={item.distance}
//                 estimatedReadyAt={item.estimatedReadyAt}
//                 location={item.location}
//                 status={item.status}
//                 onAccept={() => handlePressAcceptOrder(item.id)}
//                 orcontainerStyle={{ backgroundColor: Colors.cardbg, paddingVertical: vs(8) }}
//               />
//             )}
//           />
//         )}
//       </ScrollView>

//       {/* ── Order Detail Modal ───────────────────────────────────────────────── */}
//       <BottomGradientModal
//         visible={showSlideModal}
//         onClose={() => setShowSlideModal(false)}
//         maxHeightPercentage={modalHeightPercentage}
//         minHeightPercentage={0.85}
//       >
//        <View style={styles.modalContent}>

//   {/* Order summary */}
//   <OrderCard
//   orderID={selectedOrder?.id}
//     distance={selectedOrder?.distance ?? '—'}
//     estimatedReadyAt={selectedOrder?.estimatedReadyAt ?? '—'}
//     location={selectedOrder?.location ?? '—'}
//     status={selectedOrder?.status ?? '—'}
//     orcontainerStyle={styles.orcontainerStyle}
//     rightText="Deliver to"
//     showOrderButton={false}
//     locationUnderline={false}
//   />

//   {/* Item count */}
//   <Text style={styles.itemCountText}>
//     No. of Items: {selectedOrder?.order_lines?.length ?? 0}
//   </Text>

//   {/* Items list — flex:1 so it takes remaining space above button */}
//     <View style={[styles.listContainer, { height: listHeight }]}>
//     <FlashList
//       data={isLoadingOrders ? Array(3).fill({}) : (selectedOrder?.order_lines ?? [])}
//       estimatedItemSize={30}
//       keyExtractor={(item, index) => item?.id ? String(item.id) : String(index)}
//       showsVerticalScrollIndicator={false}
//       renderItem={({ item, index }) =>
//         isLoadingOrders
//           ? <OrderItemShimmer />
//           : <RenderItem item={item} index={index} />
//       }
//           // ✅ Button lives inside the list — no gap ever
//     // ListFooterComponent={
//     //   <View style={styles.buttonFooter}>
//     //     <CustomButton
//     //       title="Accept Order"
//     //       style={styles.acceptButton}
//     //       onPress={onPressAccept}
//     //     />
//     //   </View>
//     // }
//     />
//   </View>

//   {/* Accept button — pinned to bottom */}
//  <View
//   style={[
//     styles.buttonFooter,
//     { bottom: insets.bottom }
//   ]}
// >
//     <CustomButton
//       title="Accept Order"
//       style={styles.acceptButton}
//       onPress={onPressAccept}
//     />
//   </View>

// </View>
//       </BottomGradientModal>


//   <PermissionFlowModal
//         visible={showPermissionModal}
//         onComplete={() => setShowPermissionModal(false)}
//       />

//  {/* <NotificationAlertDialog
//          visible={notifAlert.visible}
//         title={notifAlert.title}
//         body={notifAlert.body}
//         onOk={() => setNotifAlert({ visible: false, title: '', body: '' })}
//         onCancel={() => setNotifAlert({ visible: false, title: '', body: '' })}
//       /> */}

//     </View>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // Styles
// // ─────────────────────────────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   container:          { flex: 1, backgroundColor: Colors.white },
//   scrollView:         { flex: 1 },
//   scrollViewContent:  { paddingHorizontal: ms(16), paddingBottom: vs(20) },
//  modalContent: {
//     flex: 1,
//     paddingHorizontal: ms(16),
//    // paddingTop: vs(8),
//   },
//   listContainer: {
//   flex: 1,                    // ← takes ALL space between itemCountText and button
//   minHeight: vs(60),          // ← at least visible even with 1 item
// },
//   buttonFooter: {
//     paddingTop: vs(12),
//     //paddingBottom: vs(24),
//   },
//   acceptButton: {
//     borderRadius: ms(10),
//     backgroundColor: Colors.orange,
//     width: '90%',
//     height: vs(50),
//     alignSelf: 'center',
//   },
//   emptyContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: vs(60),
//   },
//   emptyTitle: {
//     fontSize: fontSize(18),
//     fontFamily: Typography.Bold.fontFamily,
//     color: Colors.black1,
//     marginBottom: vs(6),
//   },
//   emptySubtitle: {
//     fontSize: fontSize(14),
//     fontFamily: Typography.Regular.fontFamily,
//     color: Colors.borderColor1,
//   },

//   acceptButton: {
//     borderRadius: ms(10),
//     backgroundColor: Colors.orange,
//     width: '90%',
//     height: vs(50),
//     alignSelf: 'center',
//   },
//   itemCountText: {
//     paddingHorizontal: ms(16),
//     fontSize: fontSize(16),
//     fontFamily: Typography.SemiBold.fontFamily,
//     paddingBottom: vs(10),
//     fontWeight: '700',
//     color: Colors.black1,
//   },
//   orcontainerStyle: {
//     backgroundColor: 'transparent',
//   },
// });

// export default HomeScreen;

// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import {
//   StyleSheet, View, ScrollView, StatusBar,
//   Text, Platform, RefreshControl, AppState
// } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // ── Components ───────────────────────────────────────────────────────────────
// import CustomHeaderHome from '../../components/common/CustomHeaderHome';
// import DateCard from '../../components/cards/DateCard';
// import OrderCard from '../../components/cards/OrderCard';
// import RenderItem from '../../components/RenderItem/RenderItem';
// import CustomButton from '../../components/Buttons/CustomButton';
// import BottomGradientModal from '../../components/modals/BottomGradientModal';
// import OrderCardShimmer from '../../components/OrderCardShimmer';
// import OrderItemShimmer from '../../components/OrderItemShimmer';
// import { FlashList } from '@shopify/flash-list';

// // ── SVGs ─────────────────────────────────────────────────────────────────────
// import Notification from '../../assets/svg/Notification';

// // ── Hooks ────────────────────────────────────────────────────────────────────
// import { useContext } from 'react';
// import { useOrders } from '../../hooks/useOrders';
// import { useUserLocation } from '../../hooks/useUserLocation';
// import { useToast } from '../../hooks/ToastProvider';
// import { useAuth } from '../../hooks/useAuth';
// import useNotificationSetup from '../../hooks/useNotificationSetup';

// // ── Context ───────────────────────────────────────────────────────────────────
// import { AuthContext } from '../../context/AuthContext';

// // ── Services ──────────────────────────────────────────────────────────────────
// import LocationService from '../../hooks/LocationModule.android';

// // ── Utils ─────────────────────────────────────────────────────────────────────
// import { vs, ms, fontSize, hp } from '../../utils/responsive';
// import { Typography } from '../../utils/typography';
// import Colors from '../../utils/colors';
// import { logger } from '../../utils/logger';
// import NotificationService from '../../services/NotificationService/NotificationService';
// import { useAppPermissions } from '../../hooks/useAppPermissions';
// import PermissionFlowModal from '../../components/modals/PermissionFlowModal';
// import { useOutletSocket, useRunnerSocket } from '../../hooks/useSocketListener';
// import { SOCKET_EVENTS } from '../../services/Socket/SocketEvents';


// // ─────────────────────────────────────────────────────────────────────────────
// // Helpers
// // ─────────────────────────────────────────────────────────────────────────────

// const formatDate = (date?: string) => {
//   const d = date ? new Date(date) : new Date();
//   return d.toLocaleDateString(undefined, {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//   });
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // HomeScreen
// // ─────────────────────────────────────────────────────────────────────────────

// const HomeScreen = ({ navigation, route }) => {
//   const [showPermissionModal, setShowPermissionModal] = useState(false);
//   const insets = useSafeAreaInsets();
// const { toast } = useToast();
//   // ── Local State ─────────────────────────────────────────────────────────────
//   const [showSlideModal, setShowSlideModal] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<any>(null);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//  const [SocketEvents, setSocketEvents] = useState(false);
//   // ✅ Track if initial load has happened
//   const hasInitializedRef = useRef(false);
  
//   // ✅ Track app state for background/foreground detection
//   const appState = useRef(AppState.currentState);

//   // ── Context ──────────────────────────────────────────────────────────────────
//   const { user, outlet } = useContext(AuthContext);

//   // ── Hooks ────────────────────────────────────────────────────────────────────
//   const { saveToken } = useAuth();
//   const { location: iosLocation, refetch: fetchIOSLocation } = useUserLocation();
//   const { ensureLocationAccess } = useAppPermissions();
//   const {
//     orders,
//     loadOrders,
//     loadRunnerStatus,
//     runnerStatus,
//     setRunnerStatus,
//     toggleRunnerDuty,
//     isLoadingOrders,
//     isLoadingStatus,
//     isAccepting,
//     handleAcceptOrder,
//   } = useOrders();

//   // ── Route Params ─────────────────────────────────────────────────────────────
//   const initialStatus = route?.params?.initialStatus || runnerStatus;

//    // Handle Outlet closures/updates
//   useOutletSocket((event, data) => {
//     console.log("Outlet socket data",data)
//     if (event === SOCKET_EVENTS.OUTLET_CLOSED

//     ) {
//       toast(`Outlet ${data.name} is now closed.`);
//     }
//   });

//   useRunnerSocket((event,data)=>{
//     console.log("Runner socket data",data)
//     if(event === SOCKET_EVENTS.RUNNER_STATUS_CHANGED){
//      // toast(`${user?.display_name} is now ${data.status}.`);
//       setSocketEvents(true);
//       if(data.status == 'offline'){
//         logger.log('Runner is offline');
//         setRunnerStatus(false);
//       }else{
//         logger.log('Runner is online');
//         setRunnerStatus(true);
//       }
//     }
//   })

//   // ─────────────────────────────────────────────────────────────────────────────
//   // Notification Setup
//   // ─────────────────────────────────────────────────────────────────────────────
//   useNotificationSetup(true, saveToken, (data) => {
//     logger.log('Notification tapped, data:', data);
//     if (data?.screen === 'order') {
//       navigation.navigate('CustomerInfoScreen', { orderId: data.order_id });
//     }
//   });

//   // ─────────────────────────────────────────────────────────────────────────────
//   // Location Helpers
//   // ─────────────────────────────────────────────────────────────────────────────

//   const fetchAndroidLocation = async () => {
//     try {
//       const locationData = await LocationService.getCurrentLocation();
//       return { latitude: locationData.latitude, longitude: locationData.longitude };
//     } catch (error) {
//       logger.error('Error fetching Android location:', error);
//       return { latitude: 0, longitude: 0 };
//     }
//   };

//   const fetchLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
//     const access = await ensureLocationAccess();

//     if (access.status === 'NO_PERMISSION') {
//       setShowPermissionModal(true);
//       return null;
//     }

//     if (access.status === 'SERVICES_DISABLED') {
//       setShowPermissionModal(true);
//       return null;
//     }

//     return await LoadLocation();
//   };

//   const LoadLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
//     try {
//       if (Platform.OS === 'android') {
//         return await fetchAndroidLocation();
//       }

//       logger.log('Fetching iOS location...');
//       return await fetchIOSLocation();
//     } catch (e) {
//       logger.log('LoadLocation error:', e);
//       return null;
//     }
//   };

//   // ─────────────────────────────────────────────────────────────────────────────
//   // Load Orders Based on Duty Status
//   // ─────────────────────────────────────────────────────────────────────────────
//   const loadOrdersIfOnDuty = async () => {

//     logger.log('📦 Loading orders - runner is on duty');
//     const coords = await fetchLocation();
    
//     if (coords?.latitude && coords?.longitude) {
//       await loadOrders(coords.latitude, coords.longitude);
//     } else {
//       logger.log('❌ Failed to get location for loading orders');
//     }
//   };

//   // ─────────────────────────────────────────────────────────────────────────────
//   // Initial Load (on mount)
//   // ─────────────────────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const init = async () => {
//       if (hasInitializedRef.current) {
//         logger.log('⏭️ Skipping init - already initialized');
//         return;
//       }

//       logger.log('🚀 Initializing HomeScreen...',initialStatus);
//       hasInitializedRef.current = true;

//       let status = initialStatus?.is_on_duty;

//       if (!status) {
//         logger.log('📊 Fetching runner status...');
//         const fetchedStatus = await loadRunnerStatus((assignment) => {
//           navigation.navigate('CustomerInfoScreen', { order: assignment });
//         });
//         status = fetchedStatus;
//       } else {
//         setRunnerStatus(status);
//         logger.log('✅ Using initialStatus from AppBootstrap:', status);
//       }

//       // Load orders only if runner is on duty
//       if (status?.is_on_duty) {
//         logger.log('✅ Runner on duty - loading orders');
//         const coords = await fetchLocation();
//         if (coords?.latitude && coords?.longitude) {
//           await loadOrders(coords.latitude, coords.longitude);
//         }
//       } else {
//         logger.log('⏭️ Runner off duty - skipping order load');
//       }
//     };

//     init();
//   }, [initialStatus]);

//   // ─────────────────────────────────────────────────────────────────────────────
//   // ✅ FIX 2: App State Listener - Reload on Foreground
//   // ─────────────────────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const subscription = AppState.addEventListener('change', async (nextAppState) => {
//       logger.log('📱 App state changed:', appState.current, '→', nextAppState);

//       // ✅ Only reload when coming back to foreground
//       if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
//         logger.log('🔄 App came to foreground - reloading runner status');

//         try {
//           // ✅ Reload runner status
//           const fetchedStatus = await loadRunnerStatus((assignment) => {
//             navigation.navigate('CustomerInfoScreen', { order: assignment });
//           });

//           logger.log('🔄 Fetched runner status:', fetchedStatus);
//           // ✅ Load orders only if on duty
//           if (fetchedStatus?.is_on_duty) {
//             logger.log('✅ Runner on duty - loading orders');
//             await loadOrdersIfOnDuty();
//           } else {
//             logger.log('⏭️ Runner off duty - skipping order load');
//           }
//         } catch (error) {
//           logger.error('❌ Error reloading on foreground:', error);
//         }
//       }

//       appState.current = nextAppState;
//     });

//     return () => {
//       subscription.remove();
//     };
//   }, [runnerStatus]); // Depend on runnerStatus to have latest state

//   // ─────────────────────────────────────────────────────────────────────────────
//   // ✅ FIX 2: Reload on Screen Focus
//   // ─────────────────────────────────────────────────────────────────────────────
//   useFocusEffect(
//     useCallback(() => {
//       // ✅ Skip if this is the first mount (handled by initial useEffect)
//       if (!hasInitializedRef.current) {
//         logger.log('⏭️ Skipping focus reload - initial load not done yet');
//         return;
//       }

//       logger.log('👀 Screen focused - checking if reload needed');

//       const reloadOnFocus = async () => {
//         try {
//           // ✅ Always reload runner status on focus
//           logger.log('📊 Reloading runner status on focus');
//           const fetchedStatus = await loadRunnerStatus((assignment) => {
//             navigation.navigate('CustomerInfoScreen', { order: assignment });
//           });
// logger.log('🔄 Fetched runner status:', fetchedStatus);
//           // ✅ Load orders only if on duty
//           if (fetchedStatus?.is_on_duty) {
//             logger.log('✅ Runner on duty - loading orders');
//             await loadOrdersIfOnDuty();
//           } else {
//             logger.log('⏭️ Runner off duty - skipping order load');
//           }
//         } catch (error) {
//           logger.error('❌ Error reloading on focus:', error);
//         }
//       };

//       reloadOnFocus();

//       return () => {
//         // Cleanup if needed
//       };
//     }, [SocketEvents]) // Empty deps - runs every time screen is focused
//   );

//   // ─────────────────────────────────────────────────────────────────────────────
//   // ✅ FIX 1: Pull-to-Refresh - Disabled When Off Duty
//   // ─────────────────────────────────────────────────────────────────────────────
//   const onRefresh = useCallback(async () => {
//     // ✅ FIX 1: Block refresh when off duty
//     if (!runnerStatus?.is_on_duty) {
//       logger.log('⏭️ Skipping refresh - runner is off duty');
//       return;
//     }

//     logger.log('🔄 Pull to refresh triggered');
//     setIsRefreshing(true);
    
//     try {
//       const coords = await fetchLocation();
//       logger.log('Refresh coords:', coords);
      
//       if (coords?.latitude && coords?.longitude) {
//         await loadOrders(coords.latitude, coords.longitude);
//       }
//     } catch (error) {
//       logger.error('❌ Error during refresh:', error);
//     } finally {
//       setIsRefreshing(false);
//     }
//   }, [runnerStatus?.is_on_duty]); // ✅ Depend on duty status

//   // ─────────────────────────────────────────────────────────────────────────────
//   // Order Helpers
//   // ─────────────────────────────────────────────────────────────────────────────

//   const refreshOrders = async () => {
//     if (!runnerStatus?.is_on_duty) {
//       logger.log('⏭️ Skipping order refresh - runner is off duty');
//       return;
//     }
    
//     const coords = await fetchLocation();
//     if (coords?.latitude && coords?.longitude) {
//       await loadOrders(coords.latitude, coords.longitude);
//     }
//   };

//   // ─────────────────────────────────────────────────────────────────────────────
//   // Handlers
//   // ─────────────────────────────────────────────────────────────────────────────

//   const handleNotificationPress = () => console.log('Notification pressed');

//   const handleTakeBreak = async () => {
//     logger.log('handleTakeBreak');
//     const coords = await fetchLocation();
//     await toggleRunnerDuty(coords?.latitude, coords?.longitude, (assignment: any) => {
//       logger.log('Assignment received:', assignment);
//       navigation.navigate('CustomerInfoScreen', { order: assignment });
//     });
//   };

//   const handlePressAcceptOrder = async (orderId: number) => {
//     const order = orders.find((o) => o.id === orderId);
//     setSelectedOrder(order);
//     setShowSlideModal(true);
//   };

//   const onPressAccept = async () => {
//     try {
//       await handleAcceptOrder(
//         selectedOrder?.id,
//         (acceptedOrder) => {
//           logger.log('Accepted order:', acceptedOrder);
//           navigation.navigate('CustomerInfoScreen', {
//             order: acceptedOrder ?? selectedOrder,
//           });
//         },
//         () => {
//           logger.log('Order already assigned — refreshing list');
//           refreshOrders();
//         }
//       );
//     } catch (error) {
//       logger.log('Accept order error:', error);
//     } finally {
//       setShowSlideModal(false);
//     }
//   };


//   // ── Modal height based on number of items ────────────────────────────────────
//   const itemCount = selectedOrder?.order_lines?.length ?? 0;

//   const modalHeightPercentage = itemCount <= 1 ? 0.40
//     : itemCount === 2 ? 0.50
//     : itemCount === 3 ? 0.60
//     : 0.60;

    
//   const listHeight = itemCount <= 1 ? hp(30)
//     : itemCount === 2 ? hp(20)
//     : itemCount === 3 ? hp(28)
//     : hp(30);

//   // ─────────────────────────────────────────────────────────────────────────────
//   // Render
//   // ─────────────────────────────────────────────────────────────────────────────
//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

//       {/* ── Header ──────────────────────────────────────────────────────────── */}
//       <CustomHeaderHome
//         profileImage={user?.image_url}
//         displayName={user?.display_name}
//         location={outlet?.name}
//         onNotificationPress={handleNotificationPress}
//         NotificationIcon={<Notification />}
//         onPress={() => navigation.navigate('ProfileScreen')}
//       />

//       {/* ── Date / Duty Card ─────────────────────────────────────────────────── */}
//       <View style={{ paddingHorizontal: ms(16) }}>
//         <DateCard
//           date={formatDate(runnerStatus?.last_clock_in)}
//           deliveryCount={runnerStatus?.total_delivered || 0}
//           takeBreakText={runnerStatus?.is_on_duty ? 'Take Break' : 'Resume Duty'}
//           loading={isLoadingStatus}
//           onTakeBreak={handleTakeBreak}
//         />
//       </View>

//       {/* ── Orders List ──────────────────────────────────────────────────────── */}
//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollViewContent}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={isRefreshing}
//             onRefresh={onRefresh}
//             colors={[Colors.orange]}
//             tintColor={Colors.orange}
//             // ✅ FIX 1: Disable pull-to-refresh when off duty
//             enabled={runnerStatus?.is_on_duty === true}
//           />
//         }
//       >
//         {/* Off duty */}
//         {runnerStatus?.is_on_duty === false ?(
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyTitle}>You're on a break</Text>
//             <Text style={styles.emptySubtitle}>Resume duty to see available orders</Text>
//           </View>

//         /* Loading skeletons */
//         ) : isLoadingOrders || isRefreshing ? (
//           <>
//             <OrderCardShimmer />
//             <OrderCardShimmer />
//             <OrderCardShimmer />
//           </>

//         /* Empty state */
//         ) : orders.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyTitle}>No orders available</Text>
//             <Text style={styles.emptySubtitle}>New orders will appear here</Text>
//           </View>

//         /* Orders list */
//         ) : (
//           <FlashList
//             data={orders}
//             estimatedItemSize={100}
//             removeClippedSubviews
//             keyExtractor={(item) => String(item.id)}
//             renderItem={({ item }) => (
//               <OrderCard
//                 distance={item.distance}
//                 estimatedReadyAt={item.estimatedReadyAt}
//                 location={item.location}
//                 status={item.status}
//                 onAccept={() => handlePressAcceptOrder(item.id)}
//                 orcontainerStyle={{ backgroundColor: Colors.cardbg, paddingVertical: vs(8) }}
//               />
//             )}
//           />
//         )}
//       </ScrollView>

//       {/* ── Order Detail Modal ───────────────────────────────────────────────── */}
//       <BottomGradientModal
//         visible={showSlideModal}
//         onClose={() => setShowSlideModal(false)}
//         maxHeightPercentage={modalHeightPercentage}
//         minHeightPercentage={0.85}
//       >
//         <View style={styles.modalContent}>
//           {/* Order summary */}
//           <OrderCard
//             orderID={selectedOrder?.id}
//             distance={selectedOrder?.distance ?? '—'}
//             estimatedReadyAt={selectedOrder?.estimatedReadyAt ?? '—'}
//             location={selectedOrder?.location ?? '—'}
//             status={selectedOrder?.status ?? '—'}
//             orcontainerStyle={styles.orcontainerStyle}
//             rightText="Deliver to"
//             showOrderButton={false}
//             locationUnderline={false}
//           />

//           {/* Item count */}
//           <Text style={styles.itemCountText}>
//             No. of Items: {selectedOrder?.order_lines?.length ?? 0}
//           </Text>

//           {/* Items list */}
//           <View style={[styles.listContainer, { height: listHeight }]}>
//             <FlashList
//               data={isLoadingOrders ? Array(3).fill({}) : (selectedOrder?.order_lines ?? [])}
//               estimatedItemSize={30}
//               keyExtractor={(item, index) => item?.id ? String(item.id) : String(index)}
//               showsVerticalScrollIndicator={false}
//               renderItem={({ item, index }) =>
//                 isLoadingOrders
//                   ? <OrderItemShimmer />
//                   : <RenderItem item={item} index={index} />
//               }
//             />
//           </View>

//           {/* Accept button */}
//           <View style={[styles.buttonFooter, { bottom: insets.bottom }]}>
//             <CustomButton
//               title="Accept Order"
//               style={styles.acceptButton}
//               onPress={onPressAccept}
//             />
//           </View>
//         </View>
//       </BottomGradientModal>

//       <PermissionFlowModal
//         visible={showPermissionModal}
//         onComplete={() => setShowPermissionModal(false)}
//       />
//     </View>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // Styles
// // ─────────────────────────────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.white },
//   scrollView: { flex: 1 },
//   scrollViewContent: { paddingHorizontal: ms(16), paddingBottom: vs(20) },
//   modalContent: {
//     flex: 1,
//     paddingHorizontal: ms(16),
//   },
//   listContainer: {
//     flex: 1,
//     minHeight: vs(60),
//   },
//   buttonFooter: {
//     paddingTop: vs(12),
//   },
//   acceptButton: {
//     borderRadius: ms(10),
//     backgroundColor: Colors.orange,
//     width: '90%',
//     height: vs(50),
//     alignSelf: 'center',
//   },
//   emptyContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: vs(60),
//   },
//   emptyTitle: {
//     fontSize: fontSize(18),
//     fontFamily: Typography.Bold.fontFamily,
//     color: Colors.black1,
//     marginBottom: vs(6),
//   },
//   emptySubtitle: {
//     fontSize: fontSize(14),
//     fontFamily: Typography.Regular.fontFamily,
//     color: Colors.borderColor1,
//   },
//   itemCountText: {
//     paddingHorizontal: ms(16),
//     fontSize: fontSize(16),
//     fontFamily: Typography.SemiBold.fontFamily,
//     paddingBottom: vs(10),
//     fontWeight: '700',
//     color: Colors.black1,
//   },
//   orcontainerStyle: {
//     backgroundColor: 'transparent',
//   },
// });

// export default HomeScreen;

// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import {
//   StyleSheet, View, ScrollView, StatusBar,
//   Text, Platform, RefreshControl, AppState
// } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // ── Components ───────────────────────────────────────────────────────────────
// import CustomHeaderHome from '../../components/common/CustomHeaderHome';
// import DateCard from '../../components/cards/DateCard';
// import OrderCard from '../../components/cards/OrderCard';
// import RenderItem from '../../components/RenderItem/RenderItem';
// import CustomButton from '../../components/Buttons/CustomButton';
// import BottomGradientModal from '../../components/modals/BottomGradientModal';
// import OrderCardShimmer from '../../components/OrderCardShimmer';
// import OrderItemShimmer from '../../components/OrderItemShimmer';
// import { FlashList } from '@shopify/flash-list';

// // ── SVGs ─────────────────────────────────────────────────────────────────────
// import Notification from '../../assets/svg/Notification';

// // ── Hooks ────────────────────────────────────────────────────────────────────
// import { useContext } from 'react';
// import { useOrders } from '../../hooks/useOrders';
// import { useUserLocation } from '../../hooks/useUserLocation';
// import { useToast } from '../../hooks/ToastProvider';
// import { useAuth } from '../../hooks/useAuth';
// import useNotificationSetup from '../../hooks/useNotificationSetup';

// // ── Context ───────────────────────────────────────────────────────────────────
// import { AuthContext } from '../../context/AuthContext';

// // ── Services ──────────────────────────────────────────────────────────────────
// import LocationService from '../../hooks/LocationModule.android';

// // ── Utils ─────────────────────────────────────────────────────────────────────
// import { vs, ms, fontSize, hp } from '../../utils/responsive';
// import { Typography } from '../../utils/typography';
// import Colors from '../../utils/colors';
// import { logger } from '../../utils/logger';
// import NotificationService from '../../services/NotificationService/NotificationService';
// import { useAppPermissions } from '../../hooks/useAppPermissions';
// import PermissionFlowModal from '../../components/modals/PermissionFlowModal';
// import { useOutletSocket, useRunnerSocket, useOrderSocket } from '../../hooks/useSocketListener';
// import { SOCKET_EVENTS } from '../../services/Socket/SocketEvents';


// // ─────────────────────────────────────────────────────────────────────────────
// // Helpers
// // ─────────────────────────────────────────────────────────────────────────────

// const formatDate = (date?: string) => {
//   const d = date ? new Date(date) : new Date();
//   return d.toLocaleDateString(undefined, {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//   });
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // HomeScreen
// // ─────────────────────────────────────────────────────────────────────────────

// const HomeScreen = ({ navigation, route }) => {
//   const [showPermissionModal, setShowPermissionModal] = useState(false);
//   const insets = useSafeAreaInsets();
//   const { toast } = useToast();
  
//   // ── Local State ─────────────────────────────────────────────────────────────
//   const [showSlideModal, setShowSlideModal] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<any>(null);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [outletClosed, setOutletClosed] = useState(false);
  
//   // ✅ Track if socket action is from current user (prevent duplicate toasts)
//   const isPerformingActionRef = useRef(false);
  
//   // ✅ Track if initial load has happened
//   const hasInitializedRef = useRef(false);
  
//   // ✅ Track app state for background/foreground detection
//   const appState = useRef(AppState.currentState);

//   // ── Context ──────────────────────────────────────────────────────────────────
//   const { user, outlet } = useContext(AuthContext);
// logger.log('user', user);
//   // ── Hooks ────────────────────────────────────────────────────────────────────
//   const { saveToken } = useAuth();
//   const { location: iosLocation, refetch: fetchIOSLocation } = useUserLocation();
//   const { ensureLocationAccess } = useAppPermissions();
//   const {
//     orders,
//     loadOrders,
//     loadRunnerStatus,
//     runnerStatus,
//     setRunnerStatus,
//     toggleRunnerDuty,
//     isLoadingOrders,
//     isLoadingStatus,
//     isAccepting,
//     handleAcceptOrder,
//   } = useOrders();

//   // ── Route Params ─────────────────────────────────────────────────────────────
//   const initialStatus = route?.params?.initialStatus || runnerStatus;

//   // ═════════════════════════════════════════════════════════════════════════════
//   // 🔌 SOCKET EVENT HANDLERS
//   // ═════════════════════════════════════════════════════════════════════════════

//   // ✅ 1. RUNNER STATUS SOCKET - Handle runner status changes
//   useRunnerSocket((event, data) => {
//     logger.log('📡 Runner socket event:', event, data);
    
//     if (event === SOCKET_EVENTS.RUNNER_STATUS_CHANGED) {
//       const newStatus = data.status; // 'online' | 'offline'
//       const runnerId = data.runnerId; // ✅ CORRECTED: use runnerId not runner_id
      
//       logger.log('🔄 Runner status socket data:', { runnerId, newStatus, currentUserId: user?.id });
      
//       // Only update if it's for this runner
//       if (runnerId === user?.id) {
//         logger.log('🔄 Runner status changed for current user:', newStatus);
        
//         // ✅ Skip toast if this action was performed by current user
//         if (isPerformingActionRef.current) {
//           logger.log('⏭️ Skipping socket toast - action performed by current user');
//           isPerformingActionRef.current = false;
//           return;
//         }
        
//         if (newStatus === 'offline') {
//           logger.log('❌ Runner is now offline');
          
//           // ✅ CORRECTED: Update runnerStatus object properly
//           setRunnerStatus((prev: any) => ({
//             ...prev,
//             is_on_duty: false
//           }));
          
//           toast('You are now offline', 'info', 3000);
//         } else if (newStatus === 'online') {
//           logger.log('✅ Runner is now online');
          
//           // ✅ CORRECTED: Update runnerStatus object properly
//           setRunnerStatus((prev: any) => ({
//             ...prev,
//             is_on_duty: true
//           }));
          
//           toast('You are now online', 'success', 3000);
          
//           // Reload orders when coming online
//           loadOrdersIfOnDuty();
//         }
//       }
//     }
//   });

//   // ✅ 2. OUTLET STATUS SOCKET - Handle outlet closed/opened
//   useOutletSocket((event, data) => {
//     logger.log('📡 Outlet socket event:', event, data);
    
//     if (event === SOCKET_EVENTS.OUTLET_CLOSED) {
//       logger.log('🏪 Outlet closed:', data.id);
      
//       // Check if it's the runner's assigned outlet
//       if (data.dataValues.id === outlet?.id || data._previousDataValues.id === outlet?.id) {
//         setOutletClosed(true);
        
//         // Set runner to offline
//         setRunnerStatus((prev: any) => ({
//           ...prev,
//           is_on_duty: false
//         }));
        
//         toast(`${data?.name || 'Outlet'} is now closed. You've been set to offline.`, 'alert', 5000);
//       }
//     }
    
//     if (event === SOCKET_EVENTS.OUTLET_OPENED) {
//       logger.log('🏪 Outlet opened:', data.name);
      
//       if (data.id === outlet?.id || data.outletId === outlet?.id) {
//         setOutletClosed(false);
//         toast(`${data?.name || 'Outlet'} is now open!`, 'success', 3000);
//       }
//     }
    
//     if (event === SOCKET_EVENTS.OUTLET_UPDATED) {
//       logger.log('🏪 Outlet updated:', data);
//       // Handle outlet updates if needed
//     }
//   });

//   // ✅ 3. ORDER STATUS SOCKET - Handle order ready events
//   useOrderSocket((event, data) => {
//     logger.log('📡 Order socket event:', event, data);
    
//     if (event === SOCKET_EVENTS.ORDER_READY) {
//       const orderId = data.orderId || data.order_id || data.id; // ✅ CORRECTED: use orderId first
//       logger.log('🍕 Order ready for pickup:', orderId);
      
//       // ✅ Skip toast if this action was performed by current user
//       if (isPerformingActionRef.current) {
//         logger.log('⏭️ Skipping socket toast - action performed by current user');
//         isPerformingActionRef.current = false;
//         return;
//       }
      
//       // Show toast with action to view order
//       toast(
//         `Order #${orderId} is ready for pickup!`,
//         'success',
//         5000,
//         () => {
//           // Navigate to order details when toast is tapped
//           navigation.navigate('CustomerInfoScreen', { 
//             orderId: orderId,
//             fromNotification: true 
//           });
//         }
//       );
      
//       // Refresh orders list to update UI
//       refreshOrders();
//     }
    
//     if (event === SOCKET_EVENTS.ORDER_ASSIGNED) {
//       const orderId = data.orderId ; // ✅ CORRECTED: use orderId first
//       const assignedRunnerId = data.runnerId; // ✅ CORRECTED: use runnerId
      
//       logger.log('📦 Order assigned:', orderId, 'to runner:', assignedRunnerId);
//       logger.log("isPerformingActionRef.current==>",isPerformingActionRef.current)
//       // ✅ Skip toast if this action was performed by current user
//       if (assignedRunnerId === user?.id) {
//         logger.log('⏭️ Skipping socket toast - action performed by current user');
//         isPerformingActionRef.current = false;
//         return;
//       }
      
//       // Refresh orders to remove assigned order from list
//       refreshOrders();
//     }
    
//     if (event === SOCKET_EVENTS.ORDER_ACCEPTED) {
//       logger.log('✅ Order accepted:', data);
      
//       // ✅ Skip toast if this action was performed by current user
//       if (isPerformingActionRef.current) {
//         logger.log('⏭️ Skipping socket refresh - action performed by current user');
//         isPerformingActionRef.current = false;
//         return;
//       }
      
//       // Refresh orders list
//       refreshOrders();
//     }
//   });

//   // ─────────────────────────────────────────────────────────────────────────────
//   // Notification Setup
//   // ─────────────────────────────────────────────────────────────────────────────
//   useNotificationSetup(true, saveToken, (data) => {
//     logger.log('Notification tapped, data:', data);
//     if (data?.screen === 'order') {
//       navigation.navigate('CustomerInfoScreen', { orderId: data.order_id });
//     }
//   });

//   // ─────────────────────────────────────────────────────────────────────────────
//   // Location Helpers
//   // ─────────────────────────────────────────────────────────────────────────────

//   const fetchAndroidLocation = async () => {
//     try {
//       const locationData = await LocationService.getCurrentLocation();
//       return { latitude: locationData.latitude, longitude: locationData.longitude };
//     } catch (error) {
//       logger.error('Error fetching Android location:', error);
//       return { latitude: 0, longitude: 0 };
//     }
//   };

//   const fetchLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
//     const access = await ensureLocationAccess();

//     if (access.status === 'NO_PERMISSION') {
//       setShowPermissionModal(true);
//       return null;
//     }

//     if (access.status === 'SERVICES_DISABLED') {
//       setShowPermissionModal(true);
//       return null;
//     }

//     return await LoadLocation();
//   };

//   const LoadLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
//     try {
//       if (Platform.OS === 'android') {
//         return await fetchAndroidLocation();
//       }

//       logger.log('Fetching iOS location...');
//       return await fetchIOSLocation();
//     } catch (e) {
//       logger.log('LoadLocation error:', e);
//       return null;
//     }
//   };

//   // ─────────────────────────────────────────────────────────────────────────────
//   // Load Orders Based on Duty Status
//   // ─────────────────────────────────────────────────────────────────────────────
//   const loadOrdersIfOnDuty = async () => {
//     // Don't load orders if outlet is closed
//     if (outletClosed) {
//       logger.log('⏭️ Skipping order load - outlet is closed');
//       return;
//     }

//     if (!runnerStatus?.is_on_duty) {
//       logger.log('⏭️ Skipping order load - runner is off duty');
//       return;
//     }

//     logger.log('📦 Loading orders - runner is on duty');
//     const coords = await fetchLocation();
    
//     if (coords?.latitude && coords?.longitude) {
//       await loadOrders(coords.latitude, coords.longitude);
//     } else {
//       logger.log('❌ Failed to get location for loading orders');
//     }
//   };

//   // ─────────────────────────────────────────────────────────────────────────────
//   // Initial Load (on mount)
//   // ─────────────────────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const init = async () => {
//       if (hasInitializedRef.current) {
//         logger.log('⏭️ Skipping init - already initialized');
//         return;
//       }

//       logger.log('🚀 Initializing HomeScreen...', initialStatus);
//       hasInitializedRef.current = true;

//       let status = initialStatus;

//       if (!status) {
//         logger.log('📊 Fetching runner status...');
//         const fetchedStatus = await loadRunnerStatus((assignment) => {
//           navigation.navigate('CustomerInfoScreen', { order: assignment });
//         });
//         status = fetchedStatus;
//       } else {
//         setRunnerStatus(status);
//         logger.log('✅ Using initialStatus from AppBootstrap:', status);
//       }

//       // Load orders only if runner is on duty and outlet is not closed
//       if (status?.is_on_duty && !outletClosed) {
//         logger.log('✅ Runner on duty - loading orders');
//         const coords = await fetchLocation();
//         if (coords?.latitude && coords?.longitude) {
//           await loadOrders(coords.latitude, coords.longitude);
//         }
//       } else {
//         logger.log('⏭️ Runner off duty or outlet closed - skipping order load');
//       }
//     };

//     init();
//   }, [initialStatus]);

//   // ─────────────────────────────────────────────────────────────────────────────
//   // App State Listener - Reload on Foreground
//   // ─────────────────────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const subscription = AppState.addEventListener('change', async (nextAppState) => {
//       logger.log('📱 App state changed:', appState.current, '→', nextAppState);

//       if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
//         logger.log('🔄 App came to foreground - reloading runner status');

//         try {
//           const fetchedStatus = await loadRunnerStatus((assignment) => {
//             navigation.navigate('CustomerInfoScreen', { order: assignment });
//           });

//           logger.log('🔄 Fetched runner status:', fetchedStatus);
          
//           if (fetchedStatus?.is_on_duty && !outletClosed) {
//             logger.log('✅ Runner on duty - loading orders');
//             await loadOrdersIfOnDuty();
//           } else {
//             logger.log('⏭️ Runner off duty or outlet closed - skipping order load');
//           }
//         } catch (error) {
//           logger.error('❌ Error reloading on foreground:', error);
//         }
//       }

//       appState.current = nextAppState;
//     });

//     return () => {
//       subscription.remove();
//     };
//   }, [runnerStatus, outletClosed]);

//   // ─────────────────────────────────────────────────────────────────────────────
//   // Reload on Screen Focus
//   // ─────────────────────────────────────────────────────────────────────────────
//   useFocusEffect(
//     useCallback(() => {
//       if (!hasInitializedRef.current) {
//         logger.log('⏭️ Skipping focus reload - initial load not done yet');
//         return;
//       }

//       logger.log('👀 Screen focused - checking if reload needed');

//       const reloadOnFocus = async () => {
//         try {
//           logger.log('📊 Reloading runner status on focus');
//           const fetchedStatus = await loadRunnerStatus((assignment) => {
//             navigation.navigate('CustomerInfoScreen', { order: assignment });
//           });
          
//           logger.log('🔄 Fetched runner status:', fetchedStatus);
          
//           if (fetchedStatus?.is_on_duty && !outletClosed) {
//             logger.log('✅ Runner on duty - loading orders');
//             await loadOrdersIfOnDuty();
//           } else {
//             logger.log('⏭️ Runner off duty or outlet closed - skipping order load');
//           }
//         } catch (error) {
//           logger.error('❌ Error reloading on focus:', error);
//         }
//       };

//       reloadOnFocus();
//     }, [outletClosed])
//   );

//   // ─────────────────────────────────────────────────────────────────────────────
//   // Pull-to-Refresh - Disabled When Off Duty or Outlet Closed
//   // ─────────────────────────────────────────────────────────────────────────────
//   const onRefresh = useCallback(async () => {
//     if (!runnerStatus?.is_on_duty || outletClosed) {
//       logger.log('⏭️ Skipping refresh - runner is off duty or outlet is closed');
//       return;
//     }

//     logger.log('🔄 Pull to refresh triggered');
//     setIsRefreshing(true);
    
//     try {
//       const coords = await fetchLocation();
//       logger.log('Refresh coords:', coords);
      
//       if (coords?.latitude && coords?.longitude) {
//         await loadOrders(coords.latitude, coords.longitude);
//       }
//     } catch (error) {
//       logger.error('❌ Error during refresh:', error);
//     } finally {
//       setIsRefreshing(false);
//     }
//   }, [runnerStatus?.is_on_duty, outletClosed]);

//   // ─────────────────────────────────────────────────────────────────────────────
//   // Order Helpers
//   // ─────────────────────────────────────────────────────────────────────────────

//   const refreshOrders = async () => {
//     if (!runnerStatus?.is_on_duty || outletClosed) {
//       logger.log('⏭️ Skipping order refresh - runner is off duty or outlet is closed');
//       return;
//     }
    
//     const coords = await fetchLocation();
//     if (coords?.latitude && coords?.longitude) {
//       await loadOrders(coords.latitude, coords.longitude);
//     }
//   };

//   // ─────────────────────────────────────────────────────────────────────────────
//   // Handlers
//   // ─────────────────────────────────────────────────────────────────────────────

//   const handleNotificationPress = () => console.log('Notification pressed');

//   const handleTakeBreak = async () => {
//     // Prevent going online if outlet is closed
//     if (outletClosed && !runnerStatus?.is_on_duty) {
//       toast('Cannot go online - outlet is closed', 'error', 3000);
//       return;
//     }

//     logger.log('handleTakeBreak');
    
//     // ✅ Set flag to prevent duplicate socket toast
//     isPerformingActionRef.current = true;
    
//     const coords = await fetchLocation();
//     await toggleRunnerDuty(coords?.latitude, coords?.longitude, (assignment: any) => {
//       logger.log('Assignment received:', assignment);
//       navigation.navigate('CustomerInfoScreen', { order: assignment });
//     });
    
//     // ✅ Reset flag after a delay (in case socket doesn't fire)
//     setTimeout(() => {
//       isPerformingActionRef.current = false;
//     }, 2000);
//   };

//   const handlePressAcceptOrder = async (orderId: number) => {
//     const order = orders.find((o) => o.id === orderId);
//     setSelectedOrder(order);
//     setShowSlideModal(true);
//   };

//   const onPressAccept = async () => {
//     try {
//       // ✅ Set flag to prevent duplicate socket toast
//       isPerformingActionRef.current = true;
      
//       await handleAcceptOrder(
//         selectedOrder?.id,
//         (acceptedOrder) => {
//           logger.log('Accepted order:', acceptedOrder);
//           navigation.navigate('CustomerInfoScreen', {
//             order: acceptedOrder ?? selectedOrder,
//           });
//         },
//         () => {
//           logger.log('Order already assigned — refreshing list');
//           refreshOrders();
//         }
//       );
      
//       // ✅ Reset flag after a delay
//       setTimeout(() => {
//         isPerformingActionRef.current = false;
//       }, 2000);
//     } catch (error) {
//       logger.log('Accept order error:', error);
//       isPerformingActionRef.current = false;
//     } finally {
//       setShowSlideModal(false);
//     }
//   };

//   // ── Modal height based on number of items ────────────────────────────────────
//   const itemCount = selectedOrder?.order_lines?.length ?? 0;

//   const modalHeightPercentage = itemCount <= 1 ? 0.40
//     : itemCount === 2 ? 0.50
//     : itemCount === 3 ? 0.60
//     : 0.60;

//   const listHeight = itemCount <= 1 ? hp(30)
//     : itemCount === 2 ? hp(20)
//     : itemCount === 3 ? hp(28)
//     : hp(30);

//   // ─────────────────────────────────────────────────────────────────────────────
//   // Render
//   // ─────────────────────────────────────────────────────────────────────────────
//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

//       {/* ── Header ──────────────────────────────────────────────────────────── */}
//       <CustomHeaderHome
//         profileImage={user?.image_url}
//         displayName={user?.display_name}
//         location={outlet?.name}
//         onNotificationPress={handleNotificationPress}
//         NotificationIcon={<Notification />}
//         onPress={() => navigation.navigate('ProfileScreen')}
//       />

//       {/* ── Date / Duty Card ─────────────────────────────────────────────────── */}
//       <View style={{ paddingHorizontal: ms(16) }}>
//         <DateCard
//           date={formatDate(runnerStatus?.last_clock_in)}
//           deliveryCount={runnerStatus?.total_delivered || 0}
//           takeBreakText={runnerStatus?.is_on_duty ? 'Take Break' : 'Resume Duty'}
//           loading={isLoadingStatus}
//           onTakeBreak={handleTakeBreak}
//         />
//       </View>

//       {/* ── Orders List ──────────────────────────────────────────────────────── */}
//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollViewContent}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={isRefreshing}
//             onRefresh={onRefresh}
//             colors={[Colors.orange]}
//             tintColor={Colors.orange}
//             enabled={runnerStatus?.is_on_duty === true && !outletClosed}
//           />
//         }
//       >
//         {/* Outlet closed */}
//         {outletClosed ? (
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyTitle}>Outlet is Closed</Text>
//             <Text style={styles.emptySubtitle}>You've been set to offline. Orders will appear when outlet opens.</Text>
//           </View>

//         /* Off duty */
//         ) : runnerStatus?.is_on_duty === false ? (
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyTitle}>You're on a break</Text>
//             <Text style={styles.emptySubtitle}>Resume duty to see available orders</Text>
//           </View>

//         /* Loading skeletons */
//         ) : isLoadingOrders || isRefreshing ? (
//           <>
//             <OrderCardShimmer />
//             <OrderCardShimmer />
//             <OrderCardShimmer />
//           </>

//         /* Empty state */
//         ) : orders.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyTitle}>No orders available</Text>
//             <Text style={styles.emptySubtitle}>New orders will appear here</Text>
//           </View>

//         /* Orders list */
//         ) : (
//           <FlashList
//             data={orders}
//             estimatedItemSize={100}
//             removeClippedSubviews
//             keyExtractor={(item) => String(item.id)}
//             renderItem={({ item }) => (
//               <OrderCard
//                 distance={item.distance}
//                 estimatedReadyAt={item.estimatedReadyAt}
//                 location={item.location}
//                 status={item.status}
//                 onAccept={() => handlePressAcceptOrder(item.id)}
//                 orcontainerStyle={{ backgroundColor: Colors.cardbg, paddingVertical: vs(8) }}
//               />
//             )}
//           />
//         )}
//       </ScrollView>

//       {/* ── Order Detail Modal ───────────────────────────────────────────────── */}
//       <BottomGradientModal
//         visible={showSlideModal}
//         onClose={() => setShowSlideModal(false)}
//         maxHeightPercentage={modalHeightPercentage}
//         minHeightPercentage={0.85}
//       >
//         <View style={styles.modalContent}>
//           <OrderCard
//             orderID={selectedOrder?.id}
//             distance={selectedOrder?.distance ?? '—'}
//             estimatedReadyAt={selectedOrder?.estimatedReadyAt ?? '—'}
//             location={selectedOrder?.location ?? '—'}
//             status={selectedOrder?.status ?? '—'}
//             orcontainerStyle={styles.orcontainerStyle}
//             rightText="Deliver to"
//             showOrderButton={false}
//             locationUnderline={false}
//           />

//           <Text style={styles.itemCountText}>
//             No. of Items: {selectedOrder?.order_lines?.length ?? 0}
//           </Text>

//           <View style={[styles.listContainer, { height: listHeight }]}>
//             <FlashList
//               data={isLoadingOrders ? Array(3).fill({}) : (selectedOrder?.order_lines ?? [])}
//               estimatedItemSize={30}
//               keyExtractor={(item, index) => item?.id ? String(item.id) : String(index)}
//               showsVerticalScrollIndicator={false}
//               renderItem={({ item, index }) =>
//                 isLoadingOrders
//                   ? <OrderItemShimmer />
//                   : <RenderItem item={item} index={index} />
//               }
//             />
//           </View>

//           <View style={[styles.buttonFooter, { bottom: insets.bottom }]}>
//             <CustomButton
//               title="Accept Order"
//               style={styles.acceptButton}
//               onPress={onPressAccept}
//             />
//           </View>
//         </View>
//       </BottomGradientModal>

//       <PermissionFlowModal
//         visible={showPermissionModal}
//         onComplete={() => setShowPermissionModal(false)}
//       />
//     </View>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // Styles
// // ─────────────────────────────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.white },
//   scrollView: { flex: 1 },
//   scrollViewContent: { paddingHorizontal: ms(16), paddingBottom: vs(20) },
//   modalContent: {
//     flex: 1,
//     paddingHorizontal: ms(16),
//   },
//   listContainer: {
//     flex: 1,
//     minHeight: vs(60),
//   },
//   buttonFooter: {
//     paddingTop: vs(12),
//   },
//   acceptButton: {
//     borderRadius: ms(10),
//     backgroundColor: Colors.orange,
//     width: '90%',
//     height: vs(50),
//     alignSelf: 'center',
//   },
//   emptyContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: vs(60),
//   },
//   emptyTitle: {
//     fontSize: fontSize(18),
//     fontFamily: Typography.Bold.fontFamily,
//     color: Colors.black1,
//     marginBottom: vs(6),
//   },
//   emptySubtitle: {
//     fontSize: fontSize(14),
//     fontFamily: Typography.Regular.fontFamily,
//     color: Colors.borderColor1,
//     textAlign: 'center',
//     paddingHorizontal: ms(32),
//   },
//   itemCountText: {
//     paddingHorizontal: ms(16),
//     fontSize: fontSize(16),
//     fontFamily: Typography.SemiBold.fontFamily,
//     paddingBottom: vs(10),
//     fontWeight: '700',
//     color: Colors.black1,
//   },
//   orcontainerStyle: {
//     backgroundColor: 'transparent',
//   },
// });

// export default HomeScreen;

// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import {
//   StyleSheet,
//   View,
//   ScrollView,
//   StatusBar,
//   Text,
//   Platform,
//   RefreshControl,
//   AppState,
// } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { FlashList } from '@shopify/flash-list';

// // ── Components ───────────────────────────────────────────────────────────────
// import CustomHeaderHome from '../../components/common/CustomHeaderHome';
// import DateCard from '../../components/cards/DateCard';
// import OrderCard from '../../components/cards/OrderCard';
// import RenderItem from '../../components/RenderItem/RenderItem';
// import CustomButton from '../../components/Buttons/CustomButton';
// import BottomGradientModal from '../../components/modals/BottomGradientModal';
// import OrderCardShimmer from '../../components/OrderCardShimmer';
// import OrderItemShimmer from '../../components/OrderItemShimmer';
// import PermissionFlowModal from '../../components/modals/PermissionFlowModal';

// // ── SVGs ─────────────────────────────────────────────────────────────────────
// import Notification from '../../assets/svg/Notification';

// // ── Hooks ────────────────────────────────────────────────────────────────────
// import { useContext } from 'react';
// import { useOrders } from '../../hooks/useOrders';
// import { useToast } from '../../hooks/ToastProvider';
// import { useAuth } from '../../hooks/useAuth';
// import useNotificationSetup from '../../hooks/useNotificationSetup';
// import { useUserLocation } from '../../hooks/useUserLocation';
// import { useAppPermissions } from '../../hooks/useAppPermissions';
// import {
//   useOutletSocket,
//   useRunnerSocket,
//   useOrderSocket,
// } from '../../hooks/useSocketListener';

// // ── Context ──────────────────────────────────────────────────────────────────
// import { AuthContext } from '../../context/AuthContext';

// // ── Services ─────────────────────────────────────────────────────────────────
// import LocationService from '../../hooks/LocationModule.android';
// import { SOCKET_EVENTS } from '../../services/Socket/SocketEvents';

// // ── Utils ────────────────────────────────────────────────────────────────────
// import { vs, ms, fontSize, hp } from '../../utils/responsive';
// import { Typography } from '../../utils/typography';
// import Colors from '../../utils/colors';
// import { logger } from '../../utils/logger';

// // ─────────────────────────────────────────────────────────────────────────────
// // HELPERS
// // ─────────────────────────────────────────────────────────────────────────────

// const formatDate = (date?: string) => {
//   const d = date ? new Date(date) : new Date();
//   return d.toLocaleDateString(undefined, {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//   });
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // HOME SCREEN
// // ─────────────────────────────────────────────────────────────────────────────

// const HomeScreen = ({ navigation, route }) => {
//   // ── State ────────────────────────────────────────────────────────────────────
//   const [showPermissionModal, setShowPermissionModal] = useState(false);
//   const [showSlideModal, setShowSlideModal] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<any>(null);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [outletClosed, setOutletClosed] = useState(false);
//   const [loadAction, setLoadAction] = useState<'manual' | null>(null);

//   // ── Refs ─────────────────────────────────────────────────────────────────────
//   const isPerformingActionRef = useRef(false);
//   const hasInitializedRef = useRef(false);
//   const appState = useRef(AppState.currentState);
//   const initialLoadCompleteRef = useRef(false);
//   const lastForegroundFetchRef = useRef<number>(0);

//   // ── Context ──────────────────────────────────────────────────────────────────
//   const { user, outlet } = useContext(AuthContext);

//   // ── Hooks ────────────────────────────────────────────────────────────────────
//   const insets = useSafeAreaInsets();
//   const { toast } = useToast();
//   const { saveToken } = useAuth();
//   const { location: iosLocation, refetch: fetchIOSLocation } = useUserLocation();
//   const { ensureLocationAccess } = useAppPermissions();
//   const {
//     orders,
//     loadOrders,
//     loadRunnerStatus,
//     runnerStatus,
//     setRunnerStatus,
//     toggleRunnerDuty,
//     isLoadingOrders,
//     isLoadingStatus,
//     isAccepting,
//     handleAcceptOrder,
//   } = useOrders();

//   // ── Route Params ─────────────────────────────────────────────────────────────
//   const preLoadedOrders = route?.params?.preLoadedOrders || null;
// logger.log('preLoadedOrders', preLoadedOrders);
//   // ═════════════════════════════════════════════════════════════════════════════
//   // SHIMMER CONTROL - Only show for manual refresh
//   // ═════════════════════════════════════════════════════════════════════════════

//   const showShimmer = loadAction === 'manual';

//   // ═════════════════════════════════════════════════════════════════════════════
//   // LOCATION & ORDERS LOADING
//   // ═════════════════════════════════════════════════════════════════════════════

//   /**
//    * Get device location (Android/iOS)
//    */
//   const getLocationCoords = async (): Promise<{
//     latitude: number;
//     longitude: number;
//   } | null> => {
//     try {
//       const access = await ensureLocationAccess();

//       if (access.status === 'NO_PERMISSION' || access.status === 'SERVICES_DISABLED') {
//         setShowPermissionModal(true);
//         return null;
//       }

//       if (Platform.OS === 'android') {
//         const locationData = await LocationService.getCurrentLocation();
//         return {
//           latitude: locationData.latitude,
//           longitude: locationData.longitude,
//         };
//       }

//       return await fetchIOSLocation();
//     } catch (error) {
//       logger.error('❌ Error getting location:', error);
//       return null;
//     }
//   };

//   /**
//    * Load orders with action tracking
//    * Only shows shimmer for manual refresh
//    */
//   const loadOrdersWithAction = async (
//     lat: number,
//     lng: number,
//     action: 'initial' | 'manual' | 'socket' = 'socket'
//   ) => {
//     logger.log(`📦 Loading orders [${action}]...`);

//     // Only set shimmer for manual actions
//     if (action === 'manual') {
//       setLoadAction('manual');
//     }

//     try {
//       await loadOrders(lat, lng, action);
//     } catch (error) {
//       logger.error(`❌ Error loading orders [${action}]:`, error);
//     } finally {
//       if (action === 'manual') {
//         setTimeout(() => setLoadAction(null), 300);
//       } else {
//         setLoadAction(null);
//       }
//     }
//   };

//   /**
//    * Load orders if runner is on duty
//    */
//   const loadOrdersIfOnDuty = async (
//     action: 'initial' | 'manual' | 'socket' = 'socket'
//   ) => {
//     if (outletClosed) {
//       logger.log('⏭️ Outlet is closed, skipping order load');
//       return;
//     }

//     if (!runnerStatus?.is_on_duty) {
//       logger.log('⏭️ Runner is off duty, skipping order load');
//       return;
//     }

//     logger.log(`📦 Loading orders [${action}] - runner on duty`);
//     const coords = await getLocationCoords();

//     if (coords?.latitude && coords?.longitude) {
//       await loadOrdersWithAction(coords.latitude, coords.longitude, action);
//     } else {
//       logger.log('❌ Failed to get location for loading orders');
//     }
//   };

//   // ═════════════════════════════════════════════════════════════════════════════
//   // SOCKET LISTENERS
//   // ═════════════════════════════════════════════════════════════════════════════

//   /**
//    * Listen to runner status changes (online/offline)
//    */
//   useRunnerSocket((event, data) => {
//     logger.log('📡 Runner socket event:', event);

//     if (event === SOCKET_EVENTS.RUNNER_STATUS_CHANGED) {
//       const newStatus = data.status;
//       const runnerId = data.runnerId;

//       if (runnerId === user?.id) {
//         if (isPerformingActionRef.current) {
//           logger.log('⏭️ Skipping socket toast - action by current user');
//           isPerformingActionRef.current = false;
//           return;
//         }

//         if (newStatus === 'offline') {
//           logger.log('🔴 Runner is now offline');
//           setRunnerStatus((prev: any) => ({
//             ...prev,
//             is_on_duty: false,
//           }));
//           toast('You are now offline', 'info', 3000);
//         } else if (newStatus === 'online') {
//           logger.log('🟢 Runner is now online');
//           setRunnerStatus((prev: any) => ({
//             ...prev,
//             is_on_duty: true,
//           }));
//           toast('You are now online', 'success', 3000);
//           loadOrdersIfOnDuty('socket');
//         }
//       }
//     }
//   });

//   /**
//    * Listen to outlet status (open/closed)
//    */
//   useOutletSocket((event, data) => {
//     logger.log('📡 Outlet socket event:', event);

//     if (event === SOCKET_EVENTS.OUTLET_CLOSED) {
//       if (data.id === outlet?.id) {
//         setOutletClosed(true);
//         setRunnerStatus((prev: any) => ({
//           ...prev,
//           is_on_duty: false,
//         }));
//         toast(
//           `${data?.name || 'Outlet'} is closed. You've been set offline.`,
//           'alert',
//           5000
//         );
//       }
//     }

//     if (event === SOCKET_EVENTS.OUTLET_OPENED) {
//       if (data.id === outlet?.id) {
//         setOutletClosed(false);
//         toast(`${data?.name || 'Outlet'} is open!`, 'success', 3000);
//       }
//     }
//   });

//   /**
//    * Listen to order status updates
//    */
//   useOrderSocket((event, data) => {
//     logger.log('📡 Order socket event:', event);

//     if (event === SOCKET_EVENTS.ORDER_READY) {
//       const orderId = data.orderId || data.order_id || data.id;

//       if (isPerformingActionRef.current) {
//         logger.log('⏭️ Skipping - action by current user');
//         isPerformingActionRef.current = false;
//         return;
//       }

//       toast(
//         `Order #${orderId} is ready for pickup!`,
//         'success',
//         5000,
//         () => {
//           navigation.navigate('CustomerInfoScreen', {
//             orderId: orderId,
//             fromNotification: true,
//           });
//         }
//       );

//       refreshOrders();
//     }

//     if (event === SOCKET_EVENTS.ORDER_ASSIGNED) {
//       if (data.runnerId !== user?.id) {
//         refreshOrders();
//       }
//     }

//     if (event === SOCKET_EVENTS.ORDER_ACCEPTED) {
//       if (isPerformingActionRef.current) {
//         logger.log('⏭️ Skipping - action by current user');
//         isPerformingActionRef.current = false;
//         return;
//       }
//       refreshOrders();
//     }
//   });

//   // ═════════════════════════════════════════════════════════════════════════════
//   // NOTIFICATION SETUP
//   // ═════════════════════════════════════════════════════════════════════════════

//   useNotificationSetup(true, saveToken, (data) => {
//     logger.log('Notification tapped:', data);
//     if (data?.screen === 'order') {
//       navigation.navigate('CustomerInfoScreen', { orderId: data.order_id });
//     }
//   });

//   // ═════════════════════════════════════════════════════════════════════════════
//   // EFFECTS
//   // ═════════════════════════════════════════════════════════════════════════════

//   /**
//    * Initial load on mount
//    */
//   useEffect(() => {
//     const init = async () => {
//       if (hasInitializedRef.current) {
//         logger.log('⏭️ Already initialized');
//         return;
//       }

//       logger.log('🚀 Initializing HomeScreen...');
//       hasInitializedRef.current = true;

//       // ── Fetch status if not provided ────────────────────────────────────────
//       const status = await loadRunnerStatus((assignment) => {
//         navigation.navigate('CustomerInfoScreen', { order: assignment });
//       });

//       // ── Use pre-loaded orders or load from API ──────────────────────────────
//       if (preLoadedOrders && preLoadedOrders.length > 0) {
//         logger.log('✅ Using pre-loaded orders:', preLoadedOrders.length);
//       } else if (status?.is_on_duty && !outletClosed) {
//         logger.log('📦 Loading orders from API');
//         const coords = await getLocationCoords();
//         if (coords?.latitude && coords?.longitude) {
//           await loadOrdersWithAction(coords.latitude, coords.longitude, 'initial');
//         }
//       } else {
//         logger.log('⏭️ Runner off duty or outlet closed');
//       }

//       initialLoadCompleteRef.current = true;
//     };

//     init();
//   }, []);

//   /**
//    * App state listener (foreground/background)
//    */
//   useEffect(() => {
//     const subscription = AppState.addEventListener('change', async (nextState) => {
//       logger.log('📱 App state:', appState.current, '→', nextState);

//       if (appState.current.match(/inactive|background/) && nextState === 'active') {
//         if (!initialLoadCompleteRef.current) {
//           logger.log('⏭️ Initial load not complete');
//           appState.current = nextState;
//           return;
//         }

//         const now = Date.now();
//         if (now - lastForegroundFetchRef.current < 10000) {
//           logger.log('⏭️ Too soon to fetch again');
//           appState.current = nextState;
//           return;
//         }

//         lastForegroundFetchRef.current = now;

//         logger.log('🔄 App came to foreground - reloading');

//         try {
//           await loadRunnerStatus((assignment) => {
//             navigation.navigate('CustomerInfoScreen', { order: assignment });
//           });

//           if (runnerStatus?.is_on_duty && !outletClosed) {
//             await loadOrdersIfOnDuty('socket');
//           }
//         } catch (error) {
//           logger.error('❌ Error on foreground:', error);
//         }
//       }

//       appState.current = nextState;
//     });

//     return () => subscription.remove();
//   }, [runnerStatus, outletClosed]);

//   /**
//    * Screen focus listener
//    */
//   useFocusEffect(
//     useCallback(() => {
//       if (!initialLoadCompleteRef.current) {
//         logger.log('⏭️ Initial load not complete');
//         return;
//       }

//       logger.log('👀 Screen focused');

//       const reloadOnFocus = async () => {
//         try {
//           const status = await loadRunnerStatus((assignment) => {
//             navigation.navigate('CustomerInfoScreen', { order: assignment });
//           });

//           if (status?.is_on_duty && !outletClosed) {
//             await loadOrdersIfOnDuty('socket');
//           }
//         } catch (error) {
//           logger.error('❌ Error on focus:', error);
//         }
//       };

//       reloadOnFocus();
//     }, [outletClosed])
//   );

//   // ═════════════════════════════════════════════════════════════════════════════
//   // HANDLERS
//   // ═════════════════════════════════════════════════════════════════════════════

//   /**
//    * Pull-to-refresh handler (shows shimmer)
//    */
//   const onRefresh = useCallback(async () => {
//     if (!runnerStatus?.is_on_duty || outletClosed) {
//       logger.log('⏭️ Cannot refresh - off duty or outlet closed');
//       return;
//     }

//     logger.log('🔄 Pull to refresh');
//     setIsRefreshing(true);

//     try {
//       const coords = await getLocationCoords();

//       if (coords?.latitude && coords?.longitude) {
//         await loadOrdersWithAction(coords.latitude, coords.longitude, 'manual');
//       }
//     } catch (error) {
//       logger.error('❌ Refresh error:', error);
//     } finally {
//       setIsRefreshing(false);
//     }
//   }, [runnerStatus?.is_on_duty, outletClosed]);

//   /**
//    * Refresh orders without shimmer (for socket updates)
//    */
//   const refreshOrders = async () => {
//     if (!runnerStatus?.is_on_duty || outletClosed) return;

//     const coords = await getLocationCoords();
//     if (coords?.latitude && coords?.longitude) {
//       await loadOrdersWithAction(coords.latitude, coords.longitude, 'socket');
//     }
//   };

//   /**
//    * Toggle runner duty (on/off break)
//    */
//   const handleTakeBreak = async () => {
//     if (outletClosed && !runnerStatus?.is_on_duty) {
//       toast('Cannot go online - outlet is closed', 'error', 3000);
//       return;
//     }

//     logger.log('🔄 Toggling duty status');
//     isPerformingActionRef.current = true;

//     try {
//       const coords = await getLocationCoords();
//       await toggleRunnerDuty(coords?.latitude, coords?.longitude, (assignment: any) => {
//         navigation.navigate('CustomerInfoScreen', { order: assignment });
//       });
//     } finally {
//       setTimeout(() => {
//         isPerformingActionRef.current = false;
//       }, 2000);
//     }
//   };

//   /**
//    * Handle accept order button press
//    */
//   const handlePressAcceptOrder = async (orderId: number) => {
//     let order = preLoadedOrders?.find((o: any) => o.id === orderId);

//     if (!order) {
//       order = orders.find((o) => o.id === orderId);
//     }

//     setSelectedOrder(order);
//     setShowSlideModal(true);
//   };

//   /**
//    * Accept order action
//    */
//   const onPressAccept = async () => {
//     try {
//       isPerformingActionRef.current = true;

//       await handleAcceptOrder(
//         selectedOrder?.id,
//         (acceptedOrder) => {
//           navigation.navigate('CustomerInfoScreen', {
//             order: acceptedOrder ?? selectedOrder,
//           });
//         },
//         () => {
//           logger.log('Order already assigned - refreshing');
//           refreshOrders();
//         }
//       );
//     } finally {
//       setTimeout(() => {
//         isPerformingActionRef.current = false;
//       }, 2000);
//       setShowSlideModal(false);
//     }
//   };

//   // ─────────────────────────────────────────────────────────────────────────────
//   // MODAL HEIGHT CALCULATION
//   // ─────────────────────────────────────────────────────────────────────────────

//   const itemCount = selectedOrder?.order_lines?.length ?? 0;
//   const modalHeightPercentage =
//     itemCount <= 1 ? 0.4 : itemCount === 2 ? 0.5 : itemCount === 3 ? 0.6 : 0.6;
//   const listHeight =
//     itemCount <= 1 ? hp(30) : itemCount === 2 ? hp(20) : itemCount === 3 ? hp(28) : hp(30);

//   // ─────────────────────────────────────────────────────────────────────────────
//   // DETERMINE WHICH ORDERS TO DISPLAY
//   // ─────────────────────────────────────────────────────────────────────────────

//   const displayOrders =
//     preLoadedOrders && preLoadedOrders.length > 0 ? preLoadedOrders : orders;

//   // ═════════════════════════════════════════════════════════════════════════════
//   // RENDER
//   // ═════════════════════════════════════════════════════════════════════════════

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

//       {/* ── Header ──────────────────────────────────────────────────────────── */}
//       <CustomHeaderHome
//         profileImage={user?.image_url}
//         displayName={user?.display_name}
//         location={outlet?.name}
//         onNotificationPress={() => console.log('Notification pressed')}
//         NotificationIcon={<Notification />}
//         onPress={() => navigation.navigate('ProfileScreen')}
//       />

//       {/* ── Date / Duty Card ─────────────────────────────────────────────────── */}
//       <View style={{ paddingHorizontal: ms(16) }}>
//         <DateCard
//           date={formatDate(runnerStatus?.last_clock_in)}
//           deliveryCount={runnerStatus?.total_delivered || 0}
//           takeBreakText={runnerStatus?.is_on_duty ? 'Take Break' : 'Resume Duty'}
//           loading={isLoadingStatus}
//           onTakeBreak={handleTakeBreak}
//         />
//       </View>

//       {/* ── Orders List ──────────────────────────────────────────────────────── */}
//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollViewContent}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={isRefreshing || showShimmer}
//             onRefresh={onRefresh}
//             colors={[Colors.orange]}
//             tintColor={Colors.orange}
//             enabled={runnerStatus?.is_on_duty === true && !outletClosed}
//           />
//         }
//       >
//         {/* ── Outlet Closed State ──────────────────────────────────────────────── */}
//         {outletClosed ? (
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyTitle}>Outlet is Closed</Text>
//             <Text style={styles.emptySubtitle}>
//               You've been set offline. Orders appear when outlet opens.
//             </Text>
//           </View>
//         ) : /* ── Off Duty State ──────────────────────────────────────────────────── */
//         runnerStatus?.is_on_duty === false ? (
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyTitle}>You're on a break</Text>
//             <Text style={styles.emptySubtitle}>Resume duty to see orders</Text>
//           </View>
//         ) : /* ── Shimmer (Manual Refresh Only) ──────────────────────────────────── */
//         showShimmer ? (
//           <>
//             <OrderCardShimmer />
//             <OrderCardShimmer />
//             <OrderCardShimmer />
//           </>
//         ) : /* ── Empty State ──────────────────────────────────────────────────────── */
//         displayOrders.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyTitle}>No orders available</Text>
//             <Text style={styles.emptySubtitle}>New orders will appear here</Text>
//           </View>
//         ) : /* ── Orders List ──────────────────────────────────────────────────────── */
//         (
//           <FlashList
//             data={displayOrders}
//             estimatedItemSize={100}
//             removeClippedSubviews
//             keyExtractor={(item) => String(item.id)}
//             renderItem={({ item }) => (
//               <OrderCard
//                 distance={item.distance}
//                 estimatedReadyAt={item.estimatedReadyAt}
//                 location={item.location}
//                 status={item.status}
//                 onAccept={() => handlePressAcceptOrder(item.id)}
//                 orcontainerStyle={{
//                   backgroundColor: Colors.cardbg,
//                   paddingVertical: vs(8),
//                 }}
//               />
//             )}
//           />
//         )}
//       </ScrollView>

//       {/* ── Order Detail Modal ───────────────────────────────────────────────── */}
//       <BottomGradientModal
//         visible={showSlideModal}
//         onClose={() => setShowSlideModal(false)}
//         maxHeightPercentage={modalHeightPercentage}
//         minHeightPercentage={0.85}
//       >
//         <View style={styles.modalContent}>
//           <OrderCard
//             orderID={selectedOrder?.id}
//             distance={selectedOrder?.distance ?? '—'}
//             estimatedReadyAt={selectedOrder?.estimatedReadyAt ?? '—'}
//             location={selectedOrder?.location ?? '—'}
//             status={selectedOrder?.status ?? '—'}
//             orcontainerStyle={styles.orcontainerStyle}
//             rightText="Deliver to"
//             showOrderButton={false}
//             locationUnderline={false}
//           />

//           <Text style={styles.itemCountText}>
//             No. of Items: {selectedOrder?.order_lines?.length ?? 0}
//           </Text>

//           <View style={[styles.listContainer, { height: listHeight }]}>
//             <FlashList
//               data={
//                 isLoadingOrders
//                   ? Array(3).fill({})
//                   : selectedOrder?.order_lines ?? []
//               }
//               estimatedItemSize={30}
//               keyExtractor={(item, index) =>
//                 item?.id ? String(item.id) : String(index)
//               }
//               showsVerticalScrollIndicator={false}
//               renderItem={({ item, index }) =>
//                 isLoadingOrders ? (
//                   <OrderItemShimmer />
//                 ) : (
//                   <RenderItem item={item} index={index} />
//                 )
//               }
//             />
//           </View>

//           <View style={[styles.buttonFooter, { bottom: insets.bottom }]}>
//             <CustomButton
//               title="Accept Order"
//               style={styles.acceptButton}
//               onPress={onPressAccept}
//             />
//           </View>
//         </View>
//       </BottomGradientModal>

//       {/* ── Permission Modal ─────────────────────────────────────────────────── */}
//       <PermissionFlowModal
//         visible={showPermissionModal}
//         onComplete={() => setShowPermissionModal(false)}
//       />
//     </View>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // STYLES
// // ─────────────────────────────────────────────────────────────────────────────

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.white },
//   scrollView: { flex: 1 },
//   scrollViewContent: { paddingHorizontal: ms(16), paddingBottom: vs(20) },
//   modalContent: {
//     flex: 1,
//     paddingHorizontal: ms(16),
//   },
//   listContainer: {
//     flex: 1,
//     minHeight: vs(60),
//   },
//   buttonFooter: {
//     paddingTop: vs(12),
//   },
//   acceptButton: {
//     borderRadius: ms(10),
//     backgroundColor: Colors.orange,
//     width: '90%',
//     height: vs(50),
//     alignSelf: 'center',
//   },
//   emptyContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: vs(60),
//   },
//   emptyTitle: {
//     fontSize: fontSize(18),
//     fontFamily: Typography.Bold.fontFamily,
//     color: Colors.black1,
//     marginBottom: vs(6),
//   },
//   emptySubtitle: {
//     fontSize: fontSize(14),
//     fontFamily: Typography.Regular.fontFamily,
//     color: Colors.borderColor1,
//     textAlign: 'center',
//     paddingHorizontal: ms(32),
//   },
//   itemCountText: {
//     paddingHorizontal: ms(16),
//     fontSize: fontSize(16),
//     fontFamily: Typography.SemiBold.fontFamily,
//     paddingBottom: vs(10),
//     fontWeight: '700',
//     color: Colors.black1,
//   },
//   orcontainerStyle: {
//     backgroundColor: 'transparent',
//   },
// });

// export default HomeScreen;

import React, { useEffect, useState, useCallback, useRef, useContext, useMemo } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  Text,
  Platform,
  RefreshControl,
  AppState,
  AppStateStatus,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';

// ── Components ───────────────────────────────────────────────────────────────
import CustomHeaderHome from '../../components/common/CustomHeaderHome';
import DateCard from '../../components/cards/DateCard';
import OrderCard from '../../components/cards/OrderCard';
import RenderItem from '../../components/RenderItem/RenderItem';
import CustomButton from '../../components/Buttons/CustomButton';
import BottomGradientModal from '../../components/modals/BottomGradientModal';
import OrderCardShimmer from '../../components/OrderCardShimmer';
import OrderItemShimmer from '../../components/OrderItemShimmer';
import PermissionFlowModal from '../../components/modals/PermissionFlowModal';
import Notification from '../../assets/svg/Notification';
import { useIsFocused } from '@react-navigation/native';

// ── Hooks ────────────────────────────────────────────────────────────────────
import { useOrders } from '../../hooks/useOrders';
import { useToast } from '../../hooks/ToastProvider';
import { useAuth } from '../../hooks/useAuth';
import useNotificationSetup from '../../hooks/useNotificationSetup';
import { useUserLocation } from '../../hooks/useUserLocation';
import { useAppPermissions } from '../../hooks/useAppPermissions';
import {
  useOutletSocket,
  useRunnerSocket,
  useOrderSocket,
} from '../../hooks/useSocketListener';

// ── Context ──────────────────────────────────────────────────────────────────
import { AuthContext } from '../../context/AuthContext';

// ── Services ─────────────────────────────────────────────────────────────────
import LocationService from '../../hooks/LocationModule.android';
import { SOCKET_EVENTS } from '../../services/Socket/SocketEvents';

// ── Utils ────────────────────────────────────────────────────────────────────
import { vs, ms, fontSize, hp } from '../../utils/responsive';
import { Typography } from '../../utils/typography';
import Colors from '../../utils/colors';
import { logger } from '../../utils/logger';

// ═════════════════════════════════════════════════════════════════════════════
// TYPES
// ═════════════════════════════════════════════════════════════════════════════

interface LocationCoords {
  latitude: number;
  longitude: number;
}

type LoadAction = 'initial' | 'manual' | 'socket' | null;
type ScreenState = 'loading' | 'empty' | 'offline' | 'orders' | 'outlet-closed';

// ═════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Format date to: "01 Jan 2024"
 */
const formatDate = (dateString?: string): string => {
  const date = dateString ? new Date(dateString) : new Date();
  return date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Calculate modal height based on item count
 */
const calculateModalHeight = (itemCount: number = 0) => {
  return {
    percentage: itemCount <= 1 ? 0.4 : itemCount === 2 ? 0.5 : 0.6,
    listHeight:
      itemCount <= 1 ? hp(30) : itemCount === 2 ? hp(20) : itemCount === 3 ? hp(28) : hp(30),
  };
};

/**
 * Determine which orders to display (preloaded or from API)
 */
// const getDisplayOrders = (preLoaded: any[], apiOrders: any[]): any[] => {
//   return preLoaded && preLoaded.length > 0 ? preLoaded : apiOrders;
// };
/**
 * Merges preloaded and API orders with priority.
 * API/Socket orders take precedence over stale preloaded data.
 */
const getDisplayOrders = (preLoaded: any[], apiOrders: any[]): any[] => {
  const pre = preLoaded || [];
  const api = apiOrders || [];

  // 1. Create a Map using ID as key to ensure uniqueness
  // Putting 'pre' first and 'api' second means 'api' overrides 'pre'
  const combinedMap = new Map();
  
  [...pre, ...api].forEach(order => {
    if (order?.id) {
      combinedMap.set(order.id, order);
    }
  });

  const mergedOrders = Array.from(combinedMap.values());
logger.log("===========mege======list===")
  // 2. Sort by Priority/Time (Optional)
  // Example: Orders with shorter time remaining or "Accepted" status first
  return mergedOrders.sort((a, b) => {
    // If you have a timestamp or ID to sort by:
    return b.id - a.id; // Newest IDs first
  });
};
/**
 * Determine screen state based on conditions
 */
const determineScreenState = (
  outletClosed: boolean,
  isOnDuty: boolean,
  showShimmer: boolean,
  ordersCount: number
): ScreenState => {
  if (outletClosed) return 'outlet-closed';
  if (!isOnDuty) return 'offline';
  if (showShimmer) return 'loading';
  if (ordersCount === 0) return 'empty';
  return 'orders';
};

// ═════════════════════════════════════════════════════════════════════════════
// HOME SCREEN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════

const HomeScreen = ({ navigation, route }: any) => {
  // ══════════════════════════════════════════════════════════════════════════
  // STATE MANAGEMENT
  // ══════════════════════════════════════════════════════════════════════════

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [outletClosed, setOutletClosed] = useState(false);
  const [loadAction, setLoadAction] = useState<LoadAction>(null);

  // ══════════════════════════════════════════════════════════════════════════
  // REFS - INITIALIZATION & STATE TRACKING
  // ══════════════════════════════════════════════════════════════════════════

  const isPerformingActionRef = useRef(false);
  const hasInitializedRef = useRef(false);
  const initialLoadCompleteRef = useRef(false);
  const lastForegroundFetchRef = useRef<number>(0);
  const appStateRef = useRef(AppState.currentState);

  // ══════════════════════════════════════════════════════════════════════════
  // CONTEXT & HOOKS
  // ══════════════════════════════════════════════════════════════════════════

  const { user, outlet } = useContext(AuthContext);
  const insets = useSafeAreaInsets();
  const { toast } = useToast();
  const { saveToken } = useAuth();
  const { location: iosLocation, refetch: fetchIOSLocation } = useUserLocation();
  const { isLocationEnabled,ensureLocationAccess } = useAppPermissions();

// Inside your component:
  const isFocused = useIsFocused();

  // Orders hook
  const {
    orders,
    loadOrders,
    loadRunnerStatus,
    runnerStatus,
    setRunnerStatus,
    toggleRunnerDuty,
    isLoadingOrders,
    isLoadingStatus,
    handleAcceptOrder,
  } = useOrders();

  // Route params
  const preLoadedOrders = route?.params?.preLoadedOrders || null;

  // ══════════════════════════════════════════════════════════════════════════
  // COMPUTED VALUES
  // ══════════════════════════════════════════════════════════════════════════

  const showShimmer = loadAction === 'manual';
  // const displayOrders = getDisplayOrders(preLoadedOrders, orders);
const displayOrders = useMemo(() => {
  return getDisplayOrders(preLoadedOrders, orders);
}, [preLoadedOrders, orders]);

  const screenState = determineScreenState(
    outletClosed,
    runnerStatus?.is_on_duty ?? false,
    showShimmer,
    displayOrders.length
  );

  const { percentage: modalHeightPercentage, listHeight } = calculateModalHeight(
    selectedOrder?.order_lines?.length ?? 0
  );

  // ══════════════════════════════════════════════════════════════════════════
  // LOCATION MANAGEMENT
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Get device location (Android/iOS)
   * Handles permission checks and platform-specific location retrieval
   */
  const getLocationCoords = useCallback(async (): Promise<LocationCoords | null> => {
    try {
      logger.log('📍 Getting location...');

      const access = await ensureLocationAccess();
      const gpsEnabled = await isLocationEnabled();
      if (access.status === 'NO_PERMISSION' || access.status === 'SERVICES_DISABLED') {
        logger.warn('⚠️ Location permission denied or disabled');

        setShowPermissionModal(true);
        return null;
      }

      if (Platform.OS === 'android') {
        const locationData = await LocationService.getCurrentLocation();
        return {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        };
      }

      return await fetchIOSLocation();
    } catch (error) {
      logger.error('❌ Error getting location:', error);
      toast('Failed to get location', 'error', 3000);
      return null;
    }
  }, [ensureLocationAccess, fetchIOSLocation, toast]);

  // ══════════════════════════════════════════════════════════════════════════
  // ORDERS MANAGEMENT
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Load orders from API
   * Tracks action type for shimmer control
   */
  const loadOrdersWithAction = useCallback(
    async (lat: number, lng: number, action: 'initial' | 'manual' | 'socket' = 'socket') => {
      logger.log(`📦 Loading orders [${action}]...`);

      if (action === 'manual') {
        setLoadAction('manual');
      }

      try {
        await loadOrders(lat, lng, action);
      } catch (error) {
        logger.error(`❌ Error loading orders [${action}]:`, error);
        toast('Failed to load orders', 'error', 3000);
      } finally {
        if (action === 'manual') {
          setTimeout(() => setLoadAction(null), 300);
        } else {
          setLoadAction(null);
        }
      }
    },
    []
  );

  /**
   * Load orders if runner is on duty and outlet is open
   */
  const loadOrdersIfOnDuty = useCallback(
    async (action: 'initial' | 'manual' | 'socket' = 'socket') => {
      if (outletClosed) {
        logger.log('⏭️ Outlet closed, skipping order load');
        return;
      }

      // if (!runnerStatus?.is_on_duty) {
      //   logger.log('⏭️ Runner offline, skipping order load');
      //   return;
      // }

      logger.log(`📦 Runner on duty, loading orders [${action}]`);
      const coords = await getLocationCoords();

      if (coords) {
        await loadOrdersWithAction(coords.latitude, coords.longitude, action);
      }
    },
    [outletClosed, runnerStatus?.is_on_duty]
  );

  // ══════════════════════════════════════════════════════════════════════════
  // SOCKET LISTENERS
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Listen to runner status changes (online/offline)
   */
  useRunnerSocket((event, data) => {

if (!isFocused) return;

    logger.log('📡 Runner status event:', event);

    if (event === SOCKET_EVENTS.RUNNER_STATUS_CHANGED && data.runnerId === user?.id) {
      if (isPerformingActionRef.current) {
        logger.log('⏭️ Skipping runner status update - action in progress');
        isPerformingActionRef.current = false;
        return;
      }

      const newStatus = data.status;

      if (newStatus === 'offline') {
        logger.log('🔴 Runner went offline');
        setRunnerStatus((prev: any) => ({ ...prev, is_on_duty: false }));
        toast('You are now offline', 'info', 3000);
      } else if (newStatus === 'online') {
        logger.log('🟢 Runner is now online');
        setRunnerStatus((prev: any) => ({ ...prev, is_on_duty: true }));
        toast('You are now online', 'success', 3000);
        loadOrdersIfOnDuty('socket');
      }
    }
  });

  /**
   * Listen to outlet status (open/closed)
   */
  useOutletSocket((event, data) => {

if (!isFocused) return;

    logger.log('📡 Outlet event:', event);

    if (event === SOCKET_EVENTS.OUTLET_CLOSED && data.id === outlet?.id) {
      logger.log('🔴 Outlet closed');
      setOutletClosed(true);
      setRunnerStatus((prev: any) => ({ ...prev, is_on_duty: false }));
      toast(`${data?.name || 'Outlet'} is now closed`, 'alert', 5000);
    }

    if (event === SOCKET_EVENTS.OUTLET_OPENED && data.id === outlet?.id) {
      logger.log('🟢 Outlet opened');
      setOutletClosed(false);
      toast(`${data?.name || 'Outlet'} is now open!`, 'success', 3000);
    }
  });

  /**
   * Listen to order status updates (ready, assigned, accepted)
   */
  useOrderSocket((event, data) => {

    if (!isFocused) return;

    logger.log('📡 Order event:', event);

    if (event === SOCKET_EVENTS.ORDER_READY) {
      const orderId = data.orderId || data.order_id || data.id;

      if (isPerformingActionRef.current) {
        logger.log('⏭️ Skipping order ready - action in progress');
        isPerformingActionRef.current = false;
        return;
      }

      // toast(
      //   `Order #${orderId} is ready for pickup!`,
      //   'success',
      //   5000,
      //   () => {
      //     // navigation.navigate('CustomerInfoScreen', {
      //     //   orderId,
      //     // });
      //   }
      // );

      loadOrdersIfOnDuty('socket');
    }

    if (event === SOCKET_EVENTS.ORDER_ASSIGNED && data.runnerId !== user?.id) {
      logger.log('📦 Order assigned to another runner');
    }else if(event === SOCKET_EVENTS.ORDER_ASSIGNED){
      const orderId = data.orderId || data.order_id || data.id;
      logger.log('📦 Order assigned to this runner');
      //loadOrdersIfOnDuty('socket');
       navigation.navigate('CustomerInfoScreen', {
            orderId,
          });
    }

    if (event === SOCKET_EVENTS.ORDER_ACCEPTED) {
      if (isPerformingActionRef.current) {
        logger.log('⏭️ Skipping order accepted - action in progress');
        isPerformingActionRef.current = false;
        return;
      }
      loadOrdersIfOnDuty('socket');
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // NOTIFICATION SETUP
  // ══════════════════════════════════════════════════════════════════════════

  useNotificationSetup(true, saveToken, (data) => {
    logger.log('🔔 Notification tapped:', data);
    if (data?.screen === 'order') {
      navigation.navigate('CustomerInfoScreen', { orderId: data.order_id });
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // EFFECTS - INITIALIZATION
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Initialize home screen on first mount
   * Loads runner status and orders
   */
  useEffect(() => {
    const initialize = async () => {
      if (hasInitializedRef.current) {
        logger.log('⏭️ Already initialized');
        return;
      }

      logger.log('🚀 Initializing HomeScreen...');
      hasInitializedRef.current = true;

      try {
        // Load runner status
        const status = await loadRunnerStatus((assignment: any) => {
          logger.log('➡️ Navigating to active assignment');
          navigation.navigate('CustomerInfoScreen', { order: assignment });
        });

        // Use preloaded orders if available, otherwise load from API
        if (preLoadedOrders && preLoadedOrders.length > 0) {
          logger.log('✅ Using preloaded orders:', preLoadedOrders.length);
        } else if (status?.is_on_duty && !outletClosed) {
          const coords = await getLocationCoords();
          if (coords) {
            await loadOrdersWithAction(coords.latitude, coords.longitude, 'initial');
          }
        } else {
          logger.log('ℹ️ Runner offline or outlet closed, no orders loaded');
        }
      } catch (error) {
        logger.error('❌ Initialization error:', error);
      } finally {
        initialLoadCompleteRef.current = true;
      }
    };

    initialize();
  }, []);

  // ══════════════════════════════════════════════════════════════════════════
  // EFFECTS - APP STATE CHANGES
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Reload orders when app comes to foreground
   * Prevents excessive API calls with debouncing
   */
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [runnerStatus?.is_on_duty, outletClosed]);

  const handleAppStateChange = async (nextState: AppStateStatus) => {
    const isComingToForeground =
      appStateRef.current.match(/inactive|background/) && nextState === 'active';

    logger.log('📱 App state:', appStateRef.current, '→', nextState);
    appStateRef.current = nextState;

    if (!isComingToForeground || !initialLoadCompleteRef.current) {
      return;
    }

    // Debounce foreground fetch (max once per 10 seconds)
    const now = Date.now();
    if (now - lastForegroundFetchRef.current < 10000) {
      logger.log('⏭️ Too soon to fetch');
      return;
    }

    lastForegroundFetchRef.current = now;

    logger.log('🔄 App foreground - reloading status and orders');

    try {
      const status = await loadRunnerStatus((assignment: any) => {
        navigation.navigate('CustomerInfoScreen', { order: assignment });
      });

      if (status?.is_on_duty && !outletClosed) {
        await loadOrdersIfOnDuty('socket');
      }
    } catch (error) {
      logger.error('❌ Foreground refresh error:', error);
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // EFFECTS - SCREEN FOCUS
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Reload orders when screen comes into focus
   */
  useFocusEffect(
    useCallback(() => {
      if (!initialLoadCompleteRef.current) {
        logger.log('⏭️ Initial load not complete');
        return;
      }

      logger.log('👀 Screen focused - reloading');

      const reloadOnFocus = async () => {
        try {
          const status = await loadRunnerStatus((assignment: any) => {
            navigation.navigate('CustomerInfoScreen', { order: assignment });
          });

          if (status?.is_on_duty && !outletClosed) {
            await loadOrdersIfOnDuty('socket');
          }
        } catch (error) {
          logger.error('❌ Focus reload error:', error);
        }
      };

      reloadOnFocus();
    }, [navigation])//outletClosed, loadOrdersIfOnDuty, loadRunnerStatus, 
  );

  // ══════════════════════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Pull-to-refresh handler
   */
  const onRefresh = useCallback(async () => {
    if (!runnerStatus?.is_on_duty || outletClosed) {
      logger.log('⏭️ Cannot refresh - offline or outlet closed');
      return;
    }

    logger.log('🔄 Pull to refresh');
    setIsRefreshing(true);

    try {
      const coords = await getLocationCoords();
      if (coords) {
        await loadOrdersWithAction(coords.latitude, coords.longitude, 'manual');
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [runnerStatus?.is_on_duty, outletClosed, getLocationCoords, loadOrdersWithAction]);

  /**
   * Toggle runner duty (online/offline)
   */
  const handleTakeBreak = useCallback(async () => {
    if (outletClosed && !runnerStatus?.is_on_duty) {
      toast('Cannot go online - outlet is closed', 'error', 3000);
      return;
    }

    logger.log('🔄 Toggling duty status');
    isPerformingActionRef.current = true;

    try {
      const coords = await getLocationCoords();
      await toggleRunnerDuty(
        coords?.latitude,
        coords?.longitude,
        (assignment: any) => {
          navigation.navigate('CustomerInfoScreen', { order: assignment });
        }
      );
    } finally {
      setTimeout(() => {
        isPerformingActionRef.current = false;
      }, 2000);
    }
  }, [outletClosed, runnerStatus?.is_on_duty, getLocationCoords, toggleRunnerDuty, navigation, toast]);

  /**
   * Open order detail modal
   */
  const handlePressAcceptOrder = useCallback(
    (orderId: number) => {
      const order =
        preLoadedOrders?.find((o: any) => o.id === orderId) ||
        orders.find((o) => o.id === orderId);

      if (!order) {
        logger.warn('⚠️ Order not found:', orderId);
        return;
      }

      setSelectedOrder(order);
      setShowOrderModal(true);
    },
    [preLoadedOrders, orders]
  );

  /**
   * Accept selected order
   */
  const onPressAccept = useCallback(async () => {
    if (!selectedOrder?.id) {
      logger.warn('⚠️ No order selected');
      return;
    }

    logger.log('✅ Accepting order:', selectedOrder.id);
    isPerformingActionRef.current = true;

    try {
      await handleAcceptOrder(
        selectedOrder.id,
        (acceptedOrder: any) => {
          navigation.navigate('CustomerInfoScreen', {
            order: acceptedOrder ?? selectedOrder,
          });
        },
        () => {
          logger.log('📦 Order already assigned, refreshing');
          loadOrdersIfOnDuty('socket');
        }
      );
    } finally {
      setTimeout(() => {
        isPerformingActionRef.current = false;
      }, 2000);
      setShowOrderModal(false);
    }
  }, [selectedOrder, handleAcceptOrder, loadOrdersIfOnDuty, navigation]);

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER - CONDITIONAL STATES
  // ══════════════════════════════════════════════════════════════════════════

  const renderOrdersList = () => {
    if (showShimmer) {
      return (
        <View>
          <OrderCardShimmer />
          <OrderCardShimmer />
          <OrderCardShimmer />
        </View>
      );
    }

    if (displayOrders.length === 0) {
      return <EmptyState title="No orders available" subtitle="New orders will appear here" />;
    }

    return (
      <FlashList
        data={displayOrders}
        estimatedItemSize={100}
        removeClippedSubviews
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <OrderCard
            distance={item.distance}
            estimatedReadyAt={item.estimatedReadyAt}
            location={item.location}
            status={item.status}
            onAccept={() => handlePressAcceptOrder(item.id)}
            orcontainerStyle={{
              backgroundColor: Colors.cardbg,
              paddingVertical: vs(8),
            }}
          />
        )}
      />
    );
  };

  const renderContentState = () => {
    switch (screenState) {
      case 'outlet-closed':
        return (
          <EmptyState
            title="Outlet is Closed"
            subtitle="You've been set offline. Orders appear when outlet opens."
          />
        );

      case 'offline':
        return (
          <EmptyState
            title="You're on a break"
            subtitle="Resume duty to see orders"
          />
        );

      case 'loading':
      case 'empty':
      case 'orders':
      default:
        return renderOrdersList();
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER - MAIN COMPONENT
  // ══════════════════════════════════════════════════════════════════════════

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <CustomHeaderHome
        profileImage={user?.image_url}
        displayName={user?.display_name}
        location={outlet?.name}
        onNotificationPress={() => logger.log('Notification pressed')}
        NotificationIcon={<Notification />}
        onPress={() => navigation.navigate('ProfileScreen')}
      />

      {/* Date/Duty Card */}
      <View style={styles.headerSection}>
        <DateCard
          date={formatDate(runnerStatus?.last_clock_in)}
          deliveryCount={runnerStatus?.total_delivered || 0}
          takeBreakText={runnerStatus?.is_on_duty ? 'Take Break' : 'Resume Duty'}
          loading={isLoadingStatus}
          onTakeBreak={handleTakeBreak}
        />
      </View>

      {/* Orders List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={screenState === 'orders'}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing || showShimmer}
            onRefresh={onRefresh}
            colors={[Colors.orange]}
            tintColor={Colors.orange}
            enabled={runnerStatus?.is_on_duty === true && !outletClosed}
          />
        }
      >
        {renderContentState()}
      </ScrollView>

      {/* Order Detail Modal */}
      <BottomGradientModal
        visible={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        maxHeightPercentage={modalHeightPercentage}
        minHeightPercentage={0.85}
      >
        <OrderDetailModal
          order={selectedOrder}
          listHeight={listHeight}
          isLoadingOrders={isLoadingOrders}
          onAccept={onPressAccept}
          insets={insets}
        />
      </BottomGradientModal>

      {/* Permission Modal */}
      <PermissionFlowModal
        visible={showPermissionModal}
        onComplete={() => setShowPermissionModal(false)}
      />
    </View>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// SUBCOMPONENTS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Empty state component
 */
const EmptyState = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyTitle}>{title}</Text>
    <Text style={styles.emptySubtitle}>{subtitle}</Text>
  </View>
);

/**
 * Order detail modal content
 */
const OrderDetailModal = ({
  order,
  listHeight,
  isLoadingOrders,
  onAccept,
  insets,
}: {
  order: any;
  listHeight: number;
  isLoadingOrders: boolean;
  onAccept: () => void;
  insets: any;
}) => (
  <View style={styles.modalContent}>
    {/* Order Card */}
    <OrderCard
      orderID={order?.id}
      distance={order?.distance ?? '—'}
      estimatedReadyAt={order?.estimatedReadyAt ?? '—'}
      location={order?.location ?? '—'}
      status={order?.status ?? '—'}
      orcontainerStyle={styles.orderCardModal}
      rightText="Deliver to"
      showOrderButton={false}
      locationUnderline={false}
    />

    {/* Item Count */}
    <Text style={styles.itemCountText}>
      No. of Items: {order?.order_lines?.length ?? 0}
    </Text>

    {/* Items List */}
    <View style={[styles.listContainer, { height: listHeight }]}>
      <FlashList
        data={
          isLoadingOrders
            ? Array(3).fill({})
            : order?.order_lines ?? []
        }
        estimatedItemSize={30}
        keyExtractor={(item, index) => item?.id ? String(item.id) : String(index)}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) =>
          isLoadingOrders ? (
            <OrderItemShimmer />
          ) : (
            <RenderItem item={item} index={index} />
          )
        }
      />
    </View>

    {/* Accept Button */}
    <View style={[styles.buttonFooter, { paddingBottom: insets.bottom }]}>
      <CustomButton
        title="Accept Order"
        style={styles.acceptButton}
        onPress={onAccept}
      />
    </View>
  </View>
);

// ═════════════════════════════════════════════════════════════════════════════
// STYLES
// ═════════════════════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  // Header Section
  headerSection: {
    paddingHorizontal: ms(16),
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: ms(16),
    paddingBottom: vs(20),
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(60),
  },
  emptyTitle: {
    fontSize: fontSize(18),
    fontFamily: Typography.Bold.fontFamily,
    color: Colors.black1,
    marginBottom: vs(6),
  },
  emptySubtitle: {
    fontSize: fontSize(14),
    fontFamily: Typography.Regular.fontFamily,
    color: Colors.borderColor1,
    textAlign: 'center',
    paddingHorizontal: ms(32),
  },

  // Modal Content
  modalContent: {
    flex: 1,
    paddingHorizontal: ms(16),
  },
  orderCardModal: {
    backgroundColor: 'transparent',
  },
  listContainer: {
    flex: 1,
    minHeight: vs(60),
  },
  itemCountText: {
    paddingHorizontal: ms(16),
    fontSize: fontSize(16),
    fontFamily: Typography.SemiBold.fontFamily,
    paddingBottom: vs(10),
    color: Colors.black1,
  },

  // Button
  buttonFooter: {
    paddingTop: vs(12),
  },
  acceptButton: {
    borderRadius: ms(10),
    backgroundColor: Colors.orange,
    width: '90%',
    height: vs(50),
    alignSelf: 'center',
  },
});

export default HomeScreen;