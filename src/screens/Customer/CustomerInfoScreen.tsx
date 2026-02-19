import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import {
  FlatList, ScrollView,
  StyleSheet, Text, View, ActivityIndicator,
  Image,
  Linking,
  BackHandler,
} from 'react-native';
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
import { useOrderDetail } from '../../hooks/useOrderDetail';
import { pickedOrder } from '../../services/Orders/order.api';
import { logger } from '../../utils/logger';
import { useMapLocation } from '../../hooks/useMapLocation';
import MapViewComponent from '../../components/Map/MapViewComponent';
import { AuthContext } from '../../context/AuthContext';
import { useToast } from '../../hooks/ToastProvider';
import { useFocusEffect } from '@react-navigation/native';

const CustomerInfoScreen = ({ navigation, route }) => {
  const [showSlideModal, setShowSlideModal]     = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isPickingUp, setIsPickingUp]           = useState(false);
  const [isDelivering, setIsDelivering]         = useState(false);
  const { order, setOrder, isLoading, fetchOrderDetail, deliverOrder } = useOrderDetail();
  const { user } = useContext(AuthContext) || {};
  const { toast } = useToast();
  // ── Run-once guard — prevents re-fetching when order/status changes cause re-renders ──
  const hasFetchedRef = useRef(false);


// ── 1. Disable Back Button ───────────────────────────
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Return true to stop the default back behavior
        return true;
      };

      // Add listener for hardware back button (Android)
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

// Also disable back gesture/header button via navigation options
  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
  }, [navigation]);
  // ── Order status ───────────────────────────────
  logger.log('orderStatus', order?.status);
  const orderStatus = order?.status ?? 'picked_up';
  const isPickedUp  = orderStatus === 'picked_up';

  // ── Outlet ─────────────────────────────────────
  const outletName    = order?.Outlet?.name         ?? '';
  const outletAddress = order?.Outlet?.address      ?? '';
  const outletLat     = order?.Outlet?.location_lat ?? null;
  const outletLng     = order?.Outlet?.location_lng ?? null;

  // ── Customer ────────────────────────────────────
  const customerName  = order?.User?.display_name   ?? 'Customer';
  const customerPhone = order?.User?.phone          ?? '';
  const customerImage = order?.User?.image_url      ??
    'https://randomuser.me/api/portraits/women/44.jpg';
  const userId        = order?.User?.id             ?? '—';

  // ── Order ───────────────────────────────────────
  const orderId      = order?.id                    ?? '—';
  const customerNote = order?.customer_note         ?? 'No special instructions';
  const orderLines   = order?.OrderLines            ?? [];
  const totalCents   = parseInt(order?.total_cents ?? '0', 10);
  const currency     = order?.currency              ?? 'USD';

  // ── Delivery ────────────────────────────────────
 
  const deliveryLocation = order?.delivery_text     ||
                           outletAddress            ||
                           'Resort pickup';

// ── Target coords based on status ─────────────
const targetLat = isPickedUp ? (order?.delivery_lat ?? outletLat) : outletLat;
const targetLng = isPickedUp ? (order?.delivery_lng ?? outletLng) : outletLng;
logger.log('targetLat', targetLat);
logger.log('targetLng', targetLng);

// ✅ Pass targets directly — hook reacts to changes
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

// ── Stable ref to latest runnerCoords so fetchRoute effect doesn't loop ──
const runnerCoordsRef = useRef(runnerCoords);
useEffect(() => { runnerCoordsRef.current = runnerCoords; }, [runnerCoords]);

// Fetch route once coords + target are ready.
// Deps: only targetLat/targetLng — so route re-fetches when destination changes
// (e.g. picked_up → delivery coords) but NOT on every runnerCoords GPS tick.
useEffect(() => {
  logger.log('useEffect run ')
  if (runnerCoordsRef.current && targetLat && targetLng) {
    fetchRoute(targetLat, targetLng);
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [targetLat, targetLng]); // ← intentional: fetchRoute omitted to break the loop

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     fetchRunnerLocation();
  //   }, 5000);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [fetchRunnerLocation]);

logger.log('mapRegion', mapRegion);
logger.log('runnerCoords', runnerCoords);
logger.log('distance', distance);
logger.log('isLoadingLocation', isLoadingLocation);
logger.log('outletName', outletName);
  useEffect(() => {
    // Guard: only run once on mount — order/status changes must NOT re-trigger this
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const routeOrder = route?.params?.order;
    if (routeOrder?.OrderLines) {
      // Full order already attached to nav params — use it directly, no network call
      setOrder(routeOrder);
    } else {
      // Only have a partial order reference — fetch full details once
      const newOrderId = routeOrder?.order?.id ?? routeOrder?.id;
      fetchOrderDetail(newOrderId ? Number(newOrderId) : undefined);
    }

    // Fetch runner location once on mount
    fetchRunnerLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← intentionally empty: run once on mount only

  // ✅ Update map target when order status changes
//   useEffect(() => {
//     if (isPickedUp && deliveryLat && deliveryLng) {
//       logger.log('Updating target to customer location', { deliveryLat, deliveryLng });
//       setTargetLat(deliveryLat);
//       setTargetLng(deliveryLng);
//     } else if (!isPickedUp && outletLat && outletLng) {
//       logger.log('Updating target to outlet location', { outletLat, outletLng });
//       setTargetLat(outletLat);
//       setTargetLng(outletLng);
//     }
//   }, [isPickedUp, deliveryLat, deliveryLng, outletLat, outletLng, setTargetLat, setTargetLng]);


  // ── Picked up handler ───────────────────────────
  const handlePickedUp = async () => {
    try {
      setIsPickingUp(true);
      const currentOrderId = order?.id;           // capture before any async
      const res = await pickedOrder(currentOrderId);
      if (res?.success) {
        // Fetch updated order — this updates `order` state once, not in a loop
        await fetchOrderDetail(Number(currentOrderId));
      }
    } catch (e) {
      logger.log('handlePickedUp error', e);
    } finally {
      setIsPickingUp(false);
    }
  };

  // ── Deliver order handler ────────────────────────
const handleDeliverOrder = async () => {
  try {
    setIsDelivering(true);
    const currentOrderId = order?.id;
    const res = await deliverOrder(Number(currentOrderId));

    // Only show modal when API confirms success — toast is already
    // handled inside deliverOrder in the hook for both cases
    if (res?.success) {
      setShowSuccessModal(true);
    }
  } catch (e) {
    logger.log('handleDeliverOrder error', e);
  } finally {
    setIsDelivering(false);
  }
};

  // if (isLoading) {
  //   return (
  //     <View style={styles.loaderContainer}>
  //       <ActivityIndicator size="large" color={Colors.orange} />
  //       <Text style={styles.loaderText}>Loading order details...</Text>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* ── Map ── */}
        <View style={styles.mapContainer}>
          {mapRegion ? (
            <>
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
  customerLat={order?.delivery_lat}
  customerLng={order?.delivery_lng}
/>
            </>
          ) : (
            <View style={[styles.map, styles.fallback]}>
              <ActivityIndicator size="small" color={Colors.orange} />
              <Text style={styles.fallbackText}>Loading map...</Text>
            </View>
          )}
        </View>

        <View style={styles.contentContainer}>

          {/* ── Outlet view (accepted) ── */}
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
                  
                  {/* <View style={styles.outletIconContainer}>
                    <Store size={ms(24)} color={Colors.orange} />
                  </View> */}
                  <View style={styles.outletInfo}>
                    <Text style={styles.outletLabel}>Pick up from</Text>
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
              </View>

 <View style={styles.infoContainer}>
                <InfoRow
                  Icon={<Map size={16} color={Colors.borderColor1} />}
                  title="Distance"
                  subtitle={distance}
                  IconPosition="right"
                  subtitleStyle={styles.subtextStyle}
                  iconStyle={styles.iconStyle}
                />
              </View>
{/* NEW: Inline Order Details for Outlet View */}
      <View style={styles.inlineOrderDetails}>
        <Text style={styles.orderDetailsText}>
          Order Items 
          <Text style={styles.nOftext}> ({orderLines.length})</Text>
        </Text>
        <View style={styles.dottedLine} />
        {orderLines.map((item, index) => (
          <RenderItem
            key={item.id}
            item={{
              id: item.id,
              quantity: item.quantity,
              price: item.line_total_cents,
              menu_item: {
                name: item.MenuItem?.name,
                description: item.MenuItem?.description,
                image_url: item.MenuItem?.image_url,
                item_type: item.MenuItem?.item_type,
              },
              options: [],
            }}
            index={index}
          />
        ))}
        
        {/* <CustomButton
          title={isPickingUp ? 'Confirming...' : 'Picked Up from Restaurant'}
          style={[styles.pickedButton, isPickingUp && styles.pickedButtonDisabled]}
          disabled={isPickingUp}
          onPress={handlePickedUp}
        /> */}
      </View>

             

              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Order Total</Text>
                <Text style={styles.totalValue}>
                  ${(totalCents / 100).toFixed(2)} {currency}
                </Text>
              </View>

  <CustomButton
          title={isPickingUp ? 'Confirming...' : 'Confirm Pickup from Restaurant'}
          style={[styles.pickedButton, isPickingUp && styles.pickedButtonDisabled]}
          disabled={isPickingUp}
          onPress={handlePickedUp}
        />

            </>
          )}

          {/* ── Customer view (picked) ── */}
          {isPickedUp && (
            <>
              <CustomerInfoCard
                orderId={String(orderId)}
                customerId={String(userId)}
                name={customerName}
                room={outletName}
                image={customerImage}
               onCall={() => {
    const phoneNumber = `tel:${customerPhone}`;
    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (!supported) {
          
      toast('Phone calls are not supported on this device', 'error', 3000);
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  }}
                onMessage={() => console.log('Message')}
                style={styles.customerInfoCardStyle}
              />

              <View style={styles.infoRowStyle}>
                <Text style={styles.titleNote}>Customer Note</Text>
                <Text style={styles.descriptionTextStyle}>{customerNote}</Text>
              </View>

              <View style={styles.infoContainer}>
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
              </View>

              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Order Total</Text>
                <Text style={styles.totalValue}>
                  ${(totalCents / 100).toFixed(2)} {currency}
                </Text>
              </View>
            </>
          )}

        </View>
        <View style={{ height: hp(35) }} />
      </ScrollView>

      {/* ── Bottom Sheet ── */}

{isPickedUp && (
    <>

      <BottomGradientBottomSheet
        visible={showSlideModal}
        onClose={() => setShowSlideModal(false)}
      >
        <View style={styles.bottomSheetContent}>
          <View style={styles.modalLine} />
          <Text style={styles.orderDetailsText}>
            Order Details
            <Text style={styles.nOftext}> (no of items: {orderLines.length})</Text>
          </Text>
          <View style={[styles.dottedLine, { marginBottom: vs(10) }]} />

          <FlatList
            data={orderLines}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: ms(16) }}
            renderItem={({ item, index }) => (
              <RenderItem
                item={{
                  id:       item.id,
                  quantity: item.quantity,
                  price:    item.line_total_cents,
                  menu_item: {
                    name:        item.MenuItem?.name,
                    description: item.MenuItem?.description,
                    image_url:   item.MenuItem?.image_url,
                    item_type:   item.MenuItem?.item_type,
                  },
                  options: [],
                }}
                index={index}
              />
            )}
          />

          {!isPickedUp ? (
            <CustomButton
              title={isPickingUp ? 'Confirming...' : 'Confirm Pickup from Restaurant'}
              style={[styles.pickedButton, isPickingUp && styles.pickedButtonDisabled]}
              disabled={isPickingUp}
              onPress={handlePickedUp}
            />
          ) : (
            <CustomButton
              title={isDelivering ? 'Delivering...' : 'Mark as Delivered'}
              style={[styles.acceptButton, isDelivering && { opacity: 0.7 }]}
              disabled={isDelivering}
              onPress={handleDeliverOrder}
            />
          )}
        </View>
      </BottomGradientBottomSheet>
</>
  )}
      <SuccessModal
        icon={Greenticksvg}
        visible={showSuccessModal}
       // onClose={() => setShowSuccessModal(false)}
       onClose={() => {}} 
       onPress={() => {
          setShowSuccessModal(false);
          navigation.navigate('Home');
        }}
        title="Successfully Delivered!"
        message="Your order has been delivered successfully."
      />
    </View>
  );
};

export default CustomerInfoScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    gap: vs(12),
  },
  loaderText: {
    fontSize: fontSize(14),
    fontFamily: Typography.Regular.fontFamily,
    color: Colors.borderColor1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  mapContainer: {
    marginBottom: ms(16),
  },
  map: {
    width: '100%',
    height: hp(38),
  },
  fallback: {
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
  imageStyle: {
    height: hp(42),
    resizeMode: 'cover',
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: ms(16),
    gap: ms(12),
  },
  // ── Outlet card ──────────────────────────
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
  markerImage: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(24),
  },
  outletIconContainer: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(24),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outletInfo: {
    flex: 1,
  },
  outletLabel: {
    fontSize: fontSize(12),
    fontFamily: Typography.Regular.fontFamily,
    color: Colors.borderColor1,
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
  pickedButton: {
  backgroundColor: Colors.orange,
  alignSelf: 'center',
  marginBottom: ms(20),
  borderRadius: ms(15),
  },
  // ── Customer card ─────────────────────────
  customerInfoCardStyle: {
    maxHeight: hp(20),
  },
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
  infoContainer: {
    backgroundColor: Colors.customerInfoCardBg,
    paddingHorizontal: ms(16),
    borderRadius: ms(14),
    paddingTop: vs(8),
  },
  subtextStyle: {
    marginLeft: 0,
  },
  iconStyle: {
    marginLeft: 5,
  },
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
  // ── Bottom Sheet ──────────────────────────
  modalLine: {
    width: ms(50),
    height: vs(4),
    backgroundColor: Colors.black,
    alignSelf: 'center',
    borderRadius: ms(10),
    marginVertical: vs(10),
  },
  inlineOrderDetails: {
    backgroundColor: Colors.customerInfoCardBg,
    borderRadius: ms(14),
    paddingBottom: vs(10),
    marginTop: ms(4),
  },
  // Ensure the button inside the inline view has some margin

  orderDetailsText: {
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
  acceptButton: {
    backgroundColor: Colors.green2,
    alignSelf: 'center',
    marginBottom: ms(20),
    borderRadius: ms(15),
  },
  dottedLine: {
    borderBottomWidth: 1.4,
    borderBottomColor: '#E4E4EB',
    borderStyle: 'dashed',
    marginVertical: ms(6),
  },
  bottomSheetContent: {
    flex: 1,
  },
  pickedButtonDisabled: {
    opacity: 0.7,
  },
});
