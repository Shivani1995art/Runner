import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet, View, ScrollView, StatusBar,
  Text, Platform, RefreshControl
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// ── Components ───────────────────────────────────────────────────────────────
import CustomHeaderHome from '../../components/common/CustomHeaderHome';
import DateCard from '../../components/cards/DateCard';
import OrderCard from '../../components/cards/OrderCard';
import RenderItem from '../../components/RenderItem/RenderItem';
import CustomButton from '../../components/Buttons/CustomButton';
import BottomGradientModal from '../../components/modals/BottomGradientModal';
import OrderCardShimmer from '../../components/OrderCardShimmer';
import OrderItemShimmer from '../../components/OrderItemShimmer';
import { FlashList } from '@shopify/flash-list';

// ── SVGs ─────────────────────────────────────────────────────────────────────
import Notification from '../../assets/svg/Notification';

// ── Hooks ────────────────────────────────────────────────────────────────────
import { useContext } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { useUserLocation } from '../../hooks/useUserLocation';
import { useToast } from '../../hooks/ToastProvider';
import { useAuth } from '../../hooks/useAuth';
import useNotificationSetup from '../../hooks/useNotificationSetup';

// ── Context ───────────────────────────────────────────────────────────────────
import { AuthContext } from '../../context/AuthContext';

// ── Services ──────────────────────────────────────────────────────────────────
import LocationService from '../../hooks/LocationModule.android';

// ── Utils ─────────────────────────────────────────────────────────────────────
import { vs, ms, fontSize, hp } from '../../utils/responsive';
import { Typography } from '../../utils/typography';
import Colors from '../../utils/colors';
import { logger } from '../../utils/logger';
import NotificationAlertDialog from '../../components/modals/NotificationAlertDialog';
import NotificationService from '../../services/NotificationService/NotificationService';
import { useAppPermissions } from '../../hooks/useAppPermissions';
import PermissionFlowModal from '../../components/modals/PermissionFlowModal';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const formatDate = (date?: string) => {
  const d = date ? new Date(date) : new Date();
  return d.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// HomeScreen
// ─────────────────────────────────────────────────────────────────────────────

const HomeScreen = ({ navigation, route }) => {
  const [showPermissionModal, setShowPermissionModal] = useState(false);
// Inside your component:
const insets = useSafeAreaInsets();
 // ── Notification Alert Dialog State ────────────────────────────────────────
  const [notifAlert, setNotifAlert] = useState<{
    visible: boolean;
    title: string;
    body: string;
  }>({ visible: false, title: '', body: '' });

  // ── Local State ─────────────────────────────────────────────────────────────
  const [showSlideModal, setShowSlideModal]   = useState(false);
  const [selectedOrder, setSelectedOrder]     = useState<any>(null);
  const [isRefreshing, setIsRefreshing]       = useState(false);

  // ── Context ──────────────────────────────────────────────────────────────────
  const { user, outlet } = useContext(AuthContext);

  // ── Hooks ────────────────────────────────────────────────────────────────────

  const { saveToken }   = useAuth();
  const { location: iosLocation, refetch: fetchIOSLocation }  = useUserLocation();
  const { ensureLocationAccess } = useAppPermissions();
  const {
    orders,
    loadOrders,
    loadRunnerStatus,
    runnerStatus,
    setRunnerStatus,
    toggleRunnerDuty,
    isLoadingOrders,
    isLoadingStatus,
    isAccepting,
    handleAcceptOrder,
  } = useOrders();

  // ── Route Params ─────────────────────────────────────────────────────────────
  // initialStatus is passed from AppBootstrap to avoid a duplicate API call on mount
  const initialStatus = route?.params?.initialStatus;

  // ─────────────────────────────────────────────────────────────────────────────
  // Notification Setup
  // Handles FCM token save + notification tap navigation for both iOS & Android
  // ─────────────────────────────────────────────────────────────────────────────
  useNotificationSetup(true, saveToken, (data) => {
    logger.log('Notification tapped, data:', data);
    if (data?.screen === 'order') {
      navigation.navigate('CustomerInfoScreen', { orderId: data.order_id });
    }
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Location Helpers
  // ─────────────────────────────────────────────────────────────────────────────

  /** Android: fetch native GPS location */
  const fetchAndroidLocation = async () => {
    try {
      const locationData = await LocationService.getCurrentLocation();
      return { latitude: locationData.latitude, longitude: locationData.longitude };
    } catch (error) {
      logger.error('Error fetching Android location:', error);
      return { latitude: 0, longitude: 0 };
    }
  };


const fetchLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
  const access = await ensureLocationAccess();

  if (access.status === 'NO_PERMISSION') {
    setShowPermissionModal(true);
    return null;
  }

  if (access.status === 'SERVICES_DISABLED') {
    setShowPermissionModal(true);
    return null;
  }

  // Only now fetch location
  return await LoadLocation();
};

  /** Unified location fetch for both platforms */
  // const LoadLocation = async () => {
  //   if (Platform.OS === 'android') return await fetchAndroidLocation();
  //   logger.log('Fetching iOS location...');
  //   return await fetchIOSLocation();
  // };


const LoadLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
  try {
    if (Platform.OS === 'android') {
      return await fetchAndroidLocation();
    }

    logger.log('Fetching iOS location...');
    return await fetchIOSLocation();
  } catch (e) {
    logger.log('LoadLocation error:', e);
    return null;
  }
};

  // ── Register foreground alert handler ──────────────────────────────────────
  // useEffect(() => {
  //   const handler = (title: string, body: string) => {
  //     setNotifAlert({ visible: true, title, body });
  //   };

  //   NotificationService.addForegroundAlertHandler(handler);

  //   return () => {
  //     NotificationService.removeForegroundAlertHandler(handler);
  //   };
  // }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // Initial Load (on mount)
  // 1. Use initialStatus from AppBootstrap if available (skip extra API call)
  // 2. Otherwise fetch runner status fresh
  // 3. If on duty → fetch location → load available orders
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      let status = initialStatus;

      if (!status) {
        // No status passed — fetch fresh from API
        const fetchedStatus = await loadRunnerStatus((assignment) => {
          navigation.navigate('CustomerInfoScreen', { order: assignment });
        });
        status = fetchedStatus;
      } else {
        // Use pre-fetched status from AppBootstrap
        setRunnerStatus(status);
        logger.log('Using initialStatus from AppBootstrap:', status);
      }

      // Load orders only if runner is on duty
      if (status?.is_on_duty) {
        const coords = await fetchLocation();
        logger.log('Initial load coords:', coords);
        if (coords?.latitude && coords?.longitude) {
          await loadOrders(coords.latitude, coords.longitude);
        }
      }
    };

    init();
  }, [initialStatus]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Reload Orders on Screen Focus
  // Refreshes order list every time user navigates back to this screen
  // (e.g. after completing a delivery from CustomerInfoScreen)
  // ─────────────────────────────────────────────────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      // Skip the very first focus since useEffect above handles initial load
      if (!runnerStatus) return;

      const reloadOnFocus = async () => {
        if (!runnerStatus?.is_on_duty) return;

        const coords = await fetchLocation();
        logger.log('Focus reload coords:', coords);
        if (coords?.latitude && coords?.longitude) {
          await loadOrders(coords.latitude, coords.longitude);
        }
      };

      reloadOnFocus();
    }, [runnerStatus?.is_on_duty])
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // Pull-to-Refresh
  // ─────────────────────────────────────────────────────────────────────────────
  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const coords = await fetchLocation();
      logger.log('Refresh coords:', coords);
      if (coords?.latitude && coords?.longitude) {
        await loadOrders(coords.latitude, coords.longitude);
      }
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // Order Helpers
  // ─────────────────────────────────────────────────────────────────────────────

  /** Re-fetch orders after an "already assigned" conflict */
  const refreshOrders = async () => {
    if (!runnerStatus?.is_on_duty) return;
    const coords = await fetchLocation();
    if (coords?.latitude && coords?.longitude) {
      await loadOrders(coords.latitude, coords.longitude);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────────────────────

  const handleNotificationPress = () => console.log('Notification pressed');

  /** Toggle on/off duty — fetches location first */
  const handleTakeBreak = async () => {
    logger.log('handleTakeBreak');
    const coords = await fetchLocation();
    await toggleRunnerDuty(coords?.latitude, coords?.longitude, (assignment: any) => {
      logger.log('Assignment received:', assignment);
      navigation.navigate('CustomerInfoScreen', { order: assignment });
    });
  };

  /** Open order detail modal */
  const handlePressAcceptOrder = async (orderId: number) => {
    const order = orders.find((o) => o.id === orderId);
    setSelectedOrder(order);
    setShowSlideModal(true);
  };

  /** Confirm accept from modal */
  const onPressAccept = async () => {
    try {
      await handleAcceptOrder(
        selectedOrder?.id,
        (acceptedOrder) => {
          logger.log('Accepted order:', acceptedOrder);
          navigation.navigate('CustomerInfoScreen', {
            order: acceptedOrder ?? selectedOrder,
          });
        },
        () => {
          logger.log('Order already assigned — refreshing list');
          refreshOrders();
        }
      );
    } catch (error) {
      logger.log('Accept order error:', error);
    } finally {
      setShowSlideModal(false);
    }
  };

  // ── Modal height based on number of items ────────────────────────────────────
  const itemCount              = selectedOrder?.order_lines?.length ?? 0;
 // const modalHeightPercentage  = itemCount <= 1 ? 0.52 : 0.60;
// List height: fixed when >2 items so button stays visible, auto when ≤2
// ── Modal height grows with item count ───────────────────────────────────────


const modalHeightPercentage = itemCount <= 1 ? 0.50
  : itemCount === 2             ? 0.60
  : itemCount === 3             ? 0.65
  : 0.75; // 4+ items → 75% of screen

// List height also grows with items
const listHeight = itemCount <= 1 ? hp(30)
  : itemCount === 2              ? hp(20)
  : itemCount === 3              ? hp(28)
  : hp(38); // 4+ items → fixed scrollable height
  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <CustomHeaderHome
        profileImage={user?.image_url}
        displayName={user?.display_name}
        location={outlet?.name}
        onNotificationPress={handleNotificationPress}
        NotificationIcon={<Notification />}
        onPress={() => navigation.navigate('ProfileScreen')}
      />

      {/* ── Date / Duty Card ─────────────────────────────────────────────────── */}
      <View style={{ paddingHorizontal: ms(16) }}>
        <DateCard
          date={formatDate(runnerStatus?.last_clock_in)}
          deliveryCount={runnerStatus?.total_delivered || 0}
          takeBreakText={runnerStatus?.is_on_duty ? 'Take Break' : 'Resume Duty'}
          loading={isLoadingStatus}
          onTakeBreak={handleTakeBreak}
        />
      </View>

      {/* ── Orders List ──────────────────────────────────────────────────────── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[Colors.orange]}
            tintColor={Colors.orange}
          />
        }
      >
        {/* Off duty */}
        {runnerStatus?.is_on_duty === false ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>You're on a break</Text>
            <Text style={styles.emptySubtitle}>Resume duty to see available orders</Text>
          </View>

        /* Loading skeletons */
        ) : isLoadingOrders || isRefreshing ? (
          <>
            <OrderCardShimmer />
            <OrderCardShimmer />
            <OrderCardShimmer />
          </>

        /* Empty state */
        ) : orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No orders available</Text>
            <Text style={styles.emptySubtitle}>New orders will appear here</Text>
          </View>

        /* Orders list */
        ) : (
          <FlashList
            data={orders}
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
                orcontainerStyle={{ backgroundColor: Colors.cardbg, paddingVertical: vs(8) }}
              />
            )}
          />
        )}
      </ScrollView>

      {/* ── Order Detail Modal ───────────────────────────────────────────────── */}
      <BottomGradientModal
        visible={showSlideModal}
        onClose={() => setShowSlideModal(false)}
        maxHeightPercentage={modalHeightPercentage}
        minHeightPercentage={0.85}
      >
       <View style={styles.modalContent}>

  {/* Order summary */}
  <OrderCard
  orderID={selectedOrder?.id}
    distance={selectedOrder?.distance ?? '—'}
    estimatedReadyAt={selectedOrder?.estimatedReadyAt ?? '—'}
    location={selectedOrder?.location ?? '—'}
    status={selectedOrder?.status ?? '—'}
    orcontainerStyle={styles.orcontainerStyle}
    rightText="Deliver to"
    showOrderButton={false}
    locationUnderline={false}
  />

  {/* Item count */}
  <Text style={styles.itemCountText}>
    No. of Items: {selectedOrder?.order_lines?.length ?? 0}
  </Text>

  {/* Items list — flex:1 so it takes remaining space above button */}
    <View style={[styles.listContainer, { height: listHeight }]}>
    <FlashList
      data={isLoadingOrders ? Array(3).fill({}) : (selectedOrder?.order_lines ?? [])}
      estimatedItemSize={30}
      keyExtractor={(item, index) => item?.id ? String(item.id) : String(index)}
      showsVerticalScrollIndicator={false}
      renderItem={({ item, index }) =>
        isLoadingOrders
          ? <OrderItemShimmer />
          : <RenderItem item={item} index={index} />
      }
          // ✅ Button lives inside the list — no gap ever
    // ListFooterComponent={
    //   <View style={styles.buttonFooter}>
    //     <CustomButton
    //       title="Accept Order"
    //       style={styles.acceptButton}
    //       onPress={onPressAccept}
    //     />
    //   </View>
    // }
    />
  </View>

  {/* Accept button — pinned to bottom */}
 <View
  style={[
    styles.buttonFooter,
    { bottom: insets.bottom }
  ]}
>
    <CustomButton
      title="Accept Order"
      style={styles.acceptButton}
      onPress={onPressAccept}
    />
  </View>

</View>
      </BottomGradientModal>


  <PermissionFlowModal
        visible={showPermissionModal}
        onComplete={() => setShowPermissionModal(false)}
      />

 {/* <NotificationAlertDialog
         visible={notifAlert.visible}
        title={notifAlert.title}
        body={notifAlert.body}
        onOk={() => setNotifAlert({ visible: false, title: '', body: '' })}
        onCancel={() => setNotifAlert({ visible: false, title: '', body: '' })}
      /> */}

    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:          { flex: 1, backgroundColor: Colors.white },
  scrollView:         { flex: 1 },
  scrollViewContent:  { paddingHorizontal: ms(16), paddingBottom: vs(20) },
 modalContent: {
    flex: 1,
    paddingHorizontal: ms(16),
   // paddingTop: vs(8),
  },
  listContainer: {
  flex: 1,                    // ← takes ALL space between itemCountText and button
  minHeight: vs(60),          // ← at least visible even with 1 item
},
  buttonFooter: {
    paddingTop: vs(12),
    //paddingBottom: vs(24),
  },
  acceptButton: {
    borderRadius: ms(10),
    backgroundColor: Colors.orange,
    width: '90%',
    height: vs(50),
    alignSelf: 'center',
  },
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
  },

  acceptButton: {
    borderRadius: ms(10),
    backgroundColor: Colors.orange,
    width: '90%',
    height: vs(50),
    alignSelf: 'center',
  },
  itemCountText: {
    paddingHorizontal: ms(16),
    fontSize: fontSize(16),
    fontFamily: Typography.SemiBold.fontFamily,
    paddingBottom: vs(10),
    fontWeight: '700',
    color: Colors.black1,
  },
  orcontainerStyle: {
    backgroundColor: 'transparent',
  },
});

export default HomeScreen;