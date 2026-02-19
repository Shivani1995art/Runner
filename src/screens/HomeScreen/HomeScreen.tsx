import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, ScrollView, StatusBar, Text, Platform, PermissionsAndroid, RefreshControl } from 'react-native';
import CustomHeaderHome from '../../components/common/CustomHeaderHome';
import DateCard from '../../components/cards/DateCard';
import OrderCard from '../../components/cards/OrderCard';
import { vs, ms, fontSize, hp } from '../../utils/responsive';
import Colors from '../../utils/colors';
import Notification from '../../assets/svg/Notification'
import LocationService from '../../hooks/LocationModule.android'
import BottomGradientModal from '../../components/modals/BottomGradientModal';
import CustomButton from '../../components/Buttons/CustomButton';
import { Typography } from '../../utils/typography';
import RenderItem from '../../components/RenderItem/RenderItem';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useOrders } from '../../hooks/useOrders';
import { useUserLocation } from '../../hooks/useUserLocation'
import { logger } from '../../utils/logger';
import { useAppPermissions } from '../../hooks/useAppPermissions';
import PermissionFlowModal from '../../components/modals/PermissionFlowModal';
import { FlashList } from '@shopify/flash-list';
import OrderCardShimmer from '../../components/OrderCardShimmer';
import { useToast } from '../../hooks/ToastProvider';
import OrderItemShimmer from '../../components/OrderItemShimmer';

const formatDate = (date?: string) => {
  const d = date ? new Date(date) : new Date();
  return d.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const HomeScreen = ({ navigation, route }) => {
  const [showSlideModal, setShowSlideModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showPermission, setShowPermission] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [AndroidLocationLoading, setAndroidLocationLoading] = useState(false);

  const { checkLocationPermission } = useAppPermissions();
  const { toast } = useToast();
  const { user, outlet } = useContext(AuthContext);
  const { location: iosLocation, loading: iosLocationLoading, refetch: fetchIOSLocation } = useUserLocation();
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
//logger.log('runnerStatus', runnerStatus);
  // Get initialStatus from route params (passed from AppBootstrap)
  const initialStatus = route?.params?.initialStatus;

  // ── Location helpers ────────────────────────────────────────────────────────
  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'ios') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'CabanaBoy needs access to your location to find nearby resorts',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      logger.error('Permission error:', err);
      return false;
    }
  };

  const fetchAndroidLocation = async () => {
    setAndroidLocationLoading(true);
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        logger.log('Location permission denied');
        setAndroidLocationLoading(false);
        return null;
      }
      const locationData = await LocationService.getCurrentLocation();
      setAndroidLocationLoading(false);
      return { latitude: locationData.latitude, longitude: locationData.longitude };
    } catch (error) {
      logger.error('Error fetching Android native location:', error);
      setAndroidLocationLoading(false);
      return { latitude: 0, longitude: 0 };
    }
  };

  const fetchLocation = async () => {
    if (Platform.OS === 'android') return await fetchAndroidLocation();
    logger.log('calling for ios');
    return await fetchIOSLocation();
  };

  // ── Initial load ────────────────────────────────────────────────────────────
  // 1. Check location permission → show modal if denied
  // 2. Use initialStatus from AppBootstrap if available (avoids duplicate API call)
  // 3. If on duty + no active assignment → load available orders
  // ───────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const hasLocationPermission = await checkLocationPermission();
      if (!hasLocationPermission) {
        setShowPermission(true);
        return;
      }

      let status = initialStatus;

      // If no initialStatus passed (e.g., user navigated back from another screen),
      // fetch it now
      if (!status) {
        const fetchedStatus = await loadRunnerStatus((assignment) => {
          navigation.navigate('CustomerInfoScreen', { order: assignment });
        });
        status = fetchedStatus;
      } else {
        // Use the status passed from AppBootstrap
        setRunnerStatus(status);
        logger.log('Using initialStatus from AppBootstrap:', status);
      }

      // If ON duty and no active assignment → load orders
      if (status?.is_on_duty) {
        const coords = await fetchLocation();
        logger.log('coords', coords);
        if (coords?.latitude && coords?.longitude) {
          await loadOrders(coords.latitude, coords.longitude);
        }
      }
    };

    init();
  }, [initialStatus]);

  // ── Pull-to-refresh ─────────────────────────────────────────────────────────
  // Only fetch orders if runner is on duty (checked via local runnerStatus state)
  // ───────────────────────────────────────────────────────────────────────────
  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Refresh status first
      // const status = await loadRunnerStatus((assignment) => {
      //   navigation.navigate('CustomerInfoScreen', { order: assignment });
      // });
logger.log('runnerStatus', runnerStatus);
      // Only load orders if on duty + no active assignment
    //  if (runnerStatus?.is_on_duty) {
        const coords = await fetchLocation();
        logger.log('coords', coords);
        if (coords?.latitude && coords?.longitude) {
          await loadOrders(coords.latitude, coords.longitude);
        }
     // }
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // ── Refresh orders after "already assigned" ────────────────────────────────
  const refreshOrders = async () => {
    if (!runnerStatus?.is_on_duty) return; // local check

    const coords = await fetchLocation();
    if (coords?.latitude && coords?.longitude) {
      await loadOrders(coords.latitude, coords.longitude);
    }
  };

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleNotificationPress = () => console.log('Notification pressed');

  const handleTakeBreak = async () => {
    logger.log('handleTakeBreak');
    const coords = await fetchLocation();
    await toggleRunnerDuty(coords?.latitude, coords?.longitude, (assignment: any) => {
      logger.log('Assignment received:', assignment);
      navigation.navigate('CustomerInfoScreen', { order: assignment });
    });
  };

  const PressAcceptOrder = async (orderId: number) => {
    const order = orders.find(o => o.id === orderId);
    setSelectedOrder(order);
    setShowSlideModal(true);
  };

  const onPressAccept = async () => {
    await handleAcceptOrder(
      selectedOrder?.id,
      (acceptedOrder) => {
        logger.log('====acceptedOrder======', acceptedOrder);
        setShowSlideModal(false);
        navigation.navigate('CustomerInfoScreen', {
          order: acceptedOrder ?? selectedOrder,
        });
      },
      () => {
        logger.log('====Already assigned path======');
        setShowSlideModal(false);
        refreshOrders();
      },
    );
  };
const itemCount = selectedOrder?.order_lines?.length ?? 0;

const modalHeightPercentage = itemCount <= 1 ? 0.52 : 0.60;


  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <CustomHeaderHome
        profileImage={user?.image_url}
        displayName={user?.display_name}
        location={outlet?.name}
        onNotificationPress={handleNotificationPress}
        NotificationIcon={<Notification />}
        onPress={() => navigation.navigate('ProfileScreen')}
      />

      <View style={{ paddingHorizontal: ms(16) }}>
        <DateCard
          date={formatDate(runnerStatus?.last_clock_in)}
          deliveryCount={runnerStatus?.total_delivered || 0}
          takeBreakText={runnerStatus?.is_on_duty ? 'Take Break' : 'Resume Duty'}
          loading={isLoadingStatus}
          onTakeBreak={handleTakeBreak}
        />
      </View>

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
        {runnerStatus?.is_on_duty === false ? (
          <View style={styles.offDutyContainer}>
            <Text style={styles.offDutyText}>You're on a break</Text>
            <Text style={styles.offDutySubText}>Resume duty to see available orders</Text>
          </View>

        ) : isLoadingOrders || isRefreshing ? (
          <>
            <OrderCardShimmer />
            <OrderCardShimmer />
            <OrderCardShimmer />
          </>

        ) : orders.length === 0 ? (
          <View style={styles.offDutyContainer}>
            <Text style={styles.offDutyText}>No orders available</Text>
            <Text style={styles.offDutySubText}>New orders will appear here</Text>
          </View>

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
                onAccept={() => PressAcceptOrder(item.id)}
                orcontainerStyle={{ backgroundColor: Colors.cardbg,paddingVertical: vs(8) }}
              />
            )}
          />
        )}
      </ScrollView>

      {/* ── Order detail modal ──────────────────────────────────────────────── */}
      <BottomGradientModal
       visible={showSlideModal}
  onClose={() => {
    logger.log('showSlideModal', showSlideModal);
    setShowSlideModal(false);
  }}
  maxHeightPercentage={modalHeightPercentage}
  minHeightPercentage={0.40}
      >
        <View style={{ paddingHorizontal: ms(16), paddingBottom: vs(20), flex: 1 }}>
          <OrderCard
            distance={selectedOrder?.distance ?? '—'}
            estimatedReadyAt={selectedOrder?.estimatedReadyAt ?? '—'}
            location={selectedOrder?.location ?? '—'}
            status={selectedOrder?.status ?? '—'}
            orcontainerStyle={styles.orcontainerStyle}
           // timechipStyle={styles.timeChipStyle}
            rightText='Deliver to'
            showOrderButton={false}
           // timeText={{ color: Colors.black }}
           // ClockColor='black'
            locationUnderline={false}
          />

          <Text style={styles.NoOftextStyle}>
            No. of Items: {selectedOrder?.order_lines?.length ?? 0}
          </Text>

          <View style={{ flex: 1, marginBottom: hp(1)}}>
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
            />
          </View>

          <CustomButton
            title='Accept Order'
            style={styles.acceptButton}
            loading={isAccepting}
            onPress={onPressAccept}
          />
        </View>
      </BottomGradientModal>




      <PermissionFlowModal
        visible={showPermission}
        onComplete={async () => {
          setShowPermission(false);
          
          // Check status first
          const status = await loadRunnerStatus((assignment) => {
            navigation.navigate('CustomerInfoScreen', { order: assignment });
          });

          // Only fetch orders if on duty
          if (status?.isOnDuty && !status?.hasActiveAssignment) {
            const coords = await fetchLocation();
            if (coords?.latitude && coords?.longitude) {
              await loadOrders(coords.latitude, coords.longitude);
            }
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scrollView: { flex: 1 },
  scrollViewContent: { paddingHorizontal: ms(16), paddingBottom: vs(20) },
  offDutyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: vs(60) },
  offDutyText: { fontSize: fontSize(18), fontFamily: Typography.Bold.fontFamily, color: Colors.black1, marginBottom: vs(6) },
  offDutySubText: { fontSize: fontSize(14), fontFamily: Typography.Regular.fontFamily, color: Colors.borderColor1 },


  floatingButtonContainer: {
  position: 'absolute',
  bottom: vs(16),
  left: ms(16),
  right: ms(16),
},


  acceptButton: {
    borderRadius: ms(10),
    backgroundColor: Colors.orange,
    width: '90%',
    height: vs(50),
    alignSelf: 'center',
  },
  NoOftextStyle: {
    paddingHorizontal: ms(16),
    fontSize: fontSize(16),
    fontFamily: Typography.SemiBold.fontFamily,
    paddingBottom: vs(10),
    fontWeight: '700',
    color: Colors.black1,
  },
  orcontainerStyle: { backgroundColor: 'transparent'},
    timeChipStyle: {
    flexDirection: 'row',
    alignItems: 'center',
   
  },
});

export default HomeScreen;