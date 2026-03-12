// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   ActivityIndicator,
//   TouchableOpacity,
//   StatusBar,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { ArrowLeft } from 'lucide-react-native';
// import { FlashList } from '@shopify/flash-list';


// import GradientContainer from '../../components/Gradient/GradientContainer';
// import CustomHeader from '../../components/common/CustomHeader';
// import CustomButton from '../../components/Buttons/CustomButton';
// import BackButtonsvg from '../../assets/svg/BackButtonsvg';
// import { commonStyle } from '../../styles/CommonStyles';

// // ── Components ────────────────────────────────────────────────────────────
// import RenderItem from '../../components/RenderItem/RenderItem';
// import OrderItemShimmer from '../../components/OrderItemShimmer';

// // ── Utils ─────────────────────────────────────────────────────────────────
// import { ms, vs, fontSize, hp } from '../../utils/responsive';
// import { Typography } from '../../utils/typography';
// import Colors from '../../utils/colors';
// import { logger } from '../../utils/logger';

// // ── API ───────────────────────────────────────────────────────────────────
// import { getOrderById } from '../../services/Orders/order.api';
// import HistoryItem from '../../components/cards/HistoryItem';

// // ─────────────────────────────────────────────────────────────────────────
// // OrderHistoryDetails Screen
// // ─────────────────────────────────────────────────────────────────────────

// interface OrderHistoryDetailsProps {
//   navigation: any;
//   route: {
//     params: {
//       orderId: string | number;
//     };
//   };
// }

// const OrderHistoryDetails: React.FC<OrderHistoryDetailsProps> = ({ navigation, route }) => {
//   const { orderId } = route.params;

//   // ── State ───────────────────────────────────────────────────────────────
//   const [order, setOrder] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // ── Fetch Order Details ─────────────────────────────────────────────────
//   useEffect(() => {
//     const fetchOrderDetails = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         logger.log('📦 Fetching order details for orderId:', orderId);

//         const response = await getOrderById(orderId);
        
//         if (response?.success) {
//           logger.log('✅ Order details fetched:', response.data);
//           setOrder(response.data);
//         } else {
//           logger.log('❌ Failed to fetch order details');
//           setError('Failed to load order details');
//         }
//       } catch (err) {
//         logger.error('❌ Error fetching order:', err);
//         setError('Something went wrong');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (orderId) {
//       fetchOrderDetails();
//     }
//   }, [orderId]);

//   // ── Helpers ─────────────────────────────────────────────────────────────
//   const formatDate = (dateString: string) => {
//     if (!dateString) return '—';
    
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   const formatPrice = (cents: number | string) => {
//     const amount = typeof cents === 'string' ? parseInt(cents, 10) : cents;
//     return `$${(amount / 100).toFixed(2)}`;
//   };

//   const getStatusColor = (status: string) => {
//     switch (status?.toLowerCase()) {
//       case 'delivered':
//         return Colors.green2;
//       case 'cancelled':
//         return Colors.bright_red;
//       case 'picked_up':
//       case 'delivering':
//         return Colors.orange;
//       default:
//         return Colors.borderColor1;
//     }
//   };

//   const getStatusText = (status: string) => {
//     if (!status) return 'Unknown';
//     return status.split('_').map(word => 
//       word.charAt(0).toUpperCase() + word.slice(1)
//     ).join(' ');
//   };

//   // ── Render Loading ──────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container} edges={['top']}>
//         <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
        
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity
//             style={styles.backButton}
//             onPress={() => navigation.goBack()}
//           >
//             <ArrowLeft size={ms(24)} color={Colors.black} />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Order Details</Text>
//           <View style={{ width: ms(24) }} />
//         </View>

//         {/* Loading State */}
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color={Colors.orange} />
//           <Text style={styles.loadingText}>Loading order details...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // ── Render Error ────────────────────────────────────────────────────────
//   if (error || !order) {
//     return (
//       <SafeAreaView style={styles.container} edges={['top']}>
//         <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
        
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity
//             style={styles.backButton}
//             onPress={() => navigation.goBack()}
//           >
//             <ArrowLeft size={ms(24)} color={Colors.black} />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Order Details</Text>
//           <View style={{ width: ms(24) }} />
//         </View>

//         {/* Error State */}
//         <View style={styles.errorContainer}>
//           <Text style={styles.errorTitle}>😕 {error || 'Order not found'}</Text>
//           <Text style={styles.errorSubtitle}>Please try again later</Text>
//           <TouchableOpacity
//             style={styles.retryButton}
//             onPress={() => navigation.goBack()}
//           >
//             <Text style={styles.retryButtonText}>Go Back</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // ── Extract Data ────────────────────────────────────────────────────────
//   const {
//     id,
//     status,
//     total_cents,
//     currency = 'USD',
//     accepted_at,
//     delivered_at,
//     OrderLines = [],
//     User,
//     Outlet,
//     delivery_text,
//   } = order;

//   const itemCount = OrderLines.length;
//   const totalAmount = formatPrice(total_cents);

//   // ── Main Render ─────────────────────────────────────────────────────────
//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

//       {/* ── Header ──────────────────────────────────────────────────────── */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <ArrowLeft size={ms(24)} color={Colors.black} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Order Details</Text>
//         <View style={{ width: ms(24) }} />
//       </View>

//       {/* ── Content ─────────────────────────────────────────────────────── */}
//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* ── Order Info Card ──────────────────────────────────────────── */}
//         <View style={styles.infoCard}>
//           {/* Order ID & Status */}
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Order ID</Text>
//             <View style={styles.orderIdContainer}>
//               <Text style={styles.orderIdText}>#{id}</Text>
//               <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(status)}20` }]}>
//                 <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
//                   {getStatusText(status)}
//                 </Text>
//               </View>
//             </View>
//           </View>

//           {/* Divider */}
//           <View style={styles.divider} />

//           {/* Customer Info */}
//           {User && (
//             <>
//               <View style={styles.infoRow}>
//                 <Text style={styles.infoLabel}>Customer</Text>
//                 <Text style={styles.infoValue}>{User.display_name || '—'}</Text>
//               </View>
              
//               {User.phone && (
//                 <View style={styles.infoRow}>
//                   <Text style={styles.infoLabel}>Phone</Text>
//                   <Text style={styles.infoValue}>{User.phone}</Text>
//                 </View>
//               )}
              
//               <View style={styles.divider} />
//             </>
//           )}

//           {/* Outlet Info */}
//           {Outlet && (
//             <>
//               <View style={styles.infoRow}>
//                 <Text style={styles.infoLabel}>Outlet</Text>
//                 <Text style={styles.infoValue}>{Outlet.name || '—'}</Text>
//               </View>
              
//               <View style={styles.divider} />
//             </>
//           )}

//           {/* Delivery Location */}
//           {/* {delivery_text && (
//             <>
//               <View style={styles.infoRow}>
//                 <Text style={styles.infoLabel}>Delivery To</Text>
//                 <Text style={[styles.infoValue, styles.deliveryText]}>
//                   {delivery_text}
//                 </Text>
//               </View>
              
//               <View style={styles.divider} />
//             </>
//           )} */}

//           {/* Dates */}
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Ordered At</Text>
//             <Text style={styles.infoValue}>{formatDate(accepted_at)}</Text>
//           </View>

//           {delivered_at && (
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>Delivered At</Text>
//               <Text style={styles.infoValue}>{formatDate(delivered_at)}</Text>
//             </View>
//           )}

//           {/* Divider */}
//           <View style={styles.divider} />

//           {/* Total */}
//           <View style={styles.infoRow}>
//             <Text style={styles.totalLabel}>Total Amount</Text>
//             <Text style={styles.totalValue}>{totalAmount}</Text>
//           </View>
//         </View>

//         {/* ── Items Section ────────────────────────────────────────────── */}
//         <View style={styles.itemsSection}>
//           <View style={styles.itemsHeader}>
//             <Text style={styles.itemsTitle}>Order Items</Text>
//             <Text style={styles.itemsCount}>({itemCount} {itemCount === 1 ? 'item' : 'items'})</Text>
//           </View>

//           {/* Items List */}
//           <View style={styles.itemsList}>
//             {OrderLines.length === 0 ? (
//               <View style={styles.emptyItems}>
//                 <Text style={styles.emptyItemsText}>No items found</Text>
//               </View>
//             ) : (
//               <FlashList
//                 data={OrderLines}
//                 estimatedItemSize={80}
//                 keyExtractor={(item, index) => item?.id ? String(item.id) : String(index)}
//                 // renderItem={({ item, index }) => (
//                 //   <View style={styles.itemWrapper}>
//                 //     <RenderItem 
//                 //       item={item} 
//                 //       index={index}
//                 //       showDivider={index < OrderLines.length - 1}
//                 //     />
//                 //   </View>
//                 // )}
//                 renderItem={({ item, index }) => (
//     <HistoryItem item={item} index={index} />
//   )}
//                 scrollEnabled={false} // Parent ScrollView handles scrolling
//               />
//             )}
//           </View>
//         </View>

//         {/* Bottom Spacing */}
//         <View style={{ height: vs(20) }} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────
// // Styles
// // ─────────────────────────────────────────────────────────────────────────

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   backgroundColor: 'transparent',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: ms(16),
//     paddingVertical: vs(12),
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.borderColor,
//     backgroundColor: Colors.white,
//   },
//   backButton: {
//     padding: ms(8),
//   },
//   headerTitle: {
//     fontSize: fontSize(18),
//     fontFamily: Typography.SemiBold.fontFamily,
//     color: Colors.black,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingHorizontal: ms(16),
//     paddingTop: vs(16),
//   },

//   // ── Loading State ───────────────────────────────────────────────────────
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: vs(12),
//     fontSize: fontSize(16),
//     fontFamily: Typography.Regular.fontFamily,
//     color: Colors.borderColor1,
//   },

//   // ── Error State ─────────────────────────────────────────────────────────
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: ms(32),
//   },
//   errorTitle: {
//     fontSize: fontSize(20),
//     fontFamily: Typography.SemiBold.fontFamily,
//     color: Colors.black,
//     marginBottom: vs(8),
//     textAlign: 'center',
//   },
//   errorSubtitle: {
//     fontSize: fontSize(14),
//     fontFamily: Typography.Regular.fontFamily,
//     color: Colors.borderColor1,
//     textAlign: 'center',
//     marginBottom: vs(24),
//   },
//   retryButton: {
//     backgroundColor: Colors.orange,
//     paddingHorizontal: ms(32),
//     paddingVertical: vs(12),
//     borderRadius: ms(8),
//   },
//   retryButtonText: {
//     fontSize: fontSize(16),
//     fontFamily: Typography.SemiBold.fontFamily,
//     color: Colors.white,
//   },

//   // ── Info Card ───────────────────────────────────────────────────────────
//   infoCard: {
//     backgroundColor: Colors.white,
//     borderRadius: ms(12),
//     padding: ms(16),
//     marginBottom: vs(16),
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: vs(8),
//   },
//   infoLabel: {
//     fontSize: fontSize(14),
//     fontFamily: Typography.Regular.fontFamily,
//     color: Colors.borderColor1,
//     flex: 1,
//   },
//   infoValue: {
//     fontSize: fontSize(14),
//     fontFamily: Typography.Medium.fontFamily,
//     color: Colors.black,
//     textAlign: 'right',
//     flex: 1,
//   },
//   deliveryText: {
//     fontSize: fontSize(13),
//   },
//   orderIdContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: ms(8),
//   },
//   orderIdText: {
//     fontSize: fontSize(14),
//     fontFamily: Typography.SemiBold.fontFamily,
//     color: Colors.black,
//   },
//   statusBadge: {
//     paddingHorizontal: ms(12),
//     paddingVertical: vs(4),
//     borderRadius: ms(12),
//   },
//   statusText: {
//     fontSize: fontSize(12),
//     fontFamily: Typography.SemiBold.fontFamily,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: Colors.borderColor,
//     marginVertical: vs(4),
//   },
//   totalLabel: {
//     fontSize: fontSize(16),
//     fontFamily: Typography.Bold.fontFamily,
//     color: Colors.black,
//   },
//   totalValue: {
//     fontSize: fontSize(18),
//     fontFamily: Typography.Bold.fontFamily,
//     color: Colors.orange,
//   },

//   // ── Items Section ───────────────────────────────────────────────────────
//   itemsSection: {
//     marginBottom: vs(16),
//   },
//   itemsHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: vs(12),
//   },
//   itemsTitle: {
//     fontSize: fontSize(18),
//     fontFamily: Typography.Bold.fontFamily,
//     color: Colors.black,
//   },
//   itemsCount: {
//     fontSize: fontSize(14),
//     fontFamily: Typography.Regular.fontFamily,
//     color: Colors.borderColor1,
//     marginLeft: ms(8),
//   },
//   itemsList: {
//     // backgroundColor: Colors.white,
//     // borderRadius: ms(12),
//     // padding: ms(12),
//     // shadowColor: '#000',
//     // shadowOffset: { width: 0, height: 2 },
//     // shadowOpacity: 0.1,
//     // shadowRadius: 4,
//     // elevation: 3,
//     minHeight: vs(100), // Minimum height for FlashList
//   },
//   itemWrapper: {
//     paddingVertical: vs(4),
//   },
//   emptyItems: {
//     paddingVertical: vs(40),
//     alignItems: 'center',
//   },
//   emptyItemsText: {
//     fontSize: fontSize(14),
//     fontFamily: Typography.Regular.fontFamily,
//     color: Colors.borderColor1,
//   },
// });

// export default OrderHistoryDetails;


import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';

// ── Components ────────────────────────────────────────────────────────────
import RenderItem from '../../components/RenderItem/RenderItem';
import OrderItemShimmer from '../../components/OrderItemShimmer';
import GradientContainer from '../../components/Gradient/GradientContainer';
import CustomHeader from '../../components/common/CustomHeader';
import CustomButton from '../../components/Buttons/CustomButton';
import BackButtonsvg from '../../assets/svg/BackButtonsvg';
import HistoryItem from '../../components/cards/HistoryItem';

// ── Utils ─────────────────────────────────────────────────────────────────
import { ms, vs, fontSize, hp } from '../../utils/responsive';
import { Typography } from '../../utils/typography';
import Colors from '../../utils/colors';
import { logger } from '../../utils/logger';
import { commonStyle } from '../../styles/CommonStyles';

// ── API ───────────────────────────────────────────────────────────────────
import { getOrderById } from '../../services/Orders/order.api';

// ─────────────────────────────────────────────────────────────────────────
// OrderHistoryDetails Screen
// ─────────────────────────────────────────────────────────────────────────

interface OrderHistoryDetailsProps {
  navigation: any;
  route: {
    params: {
      orderId: string | number;
    };
  };
}

const OrderHistoryDetails: React.FC<OrderHistoryDetailsProps> = ({ navigation, route }) => {
  const { orderId } = route.params;

  // ── State ───────────────────────────────────────────────────────────────
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch Order Details ─────────────────────────────────────────────────
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        logger.log('📦 Fetching order details for orderId:', orderId);

        const response = await getOrderById(orderId);
        
        if (response?.success) {
          logger.log('✅ Order details fetched:', response.data);
          setOrder(response.data);
        } else {
          logger.log('❌ Failed to fetch order details');
          setError('Failed to load order details');
        }
      } catch (err) {
        logger.error('❌ Error fetching order:', err);
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  // ── Helpers ─────────────────────────────────────────────────────────────
  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (cents: number | string) => {
    const amount = typeof cents === 'string' ? parseInt(cents, 10) : cents;
    return `$${(amount / 100).toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return Colors.green2;
      case 'cancelled':
        return Colors.bright_red;
      case 'picked_up':
      case 'delivering':
        return Colors.orange;
      default:
        return Colors.borderColor1;
    }
  };

  const getStatusText = (status: string) => {
    if (!status) return 'Unknown';
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // ── Render Loading ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <GradientContainer
        colors={["#FFF7D0", "#A9EFF2"]}
        style={styles.container}
        locations={[0, 1]}
      >
        <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

        {/* Header */}
        <CustomHeader
          title="Order Details"
          leftComponent={
            <CustomButton
              onPress={() => navigation.goBack()}
              icon={<BackButtonsvg fill="black" />}
              style={[commonStyle.TopbackButtonStyle, { backgroundColor: Colors.aquablue }]}
            />
          }
        />

        {/* Loading State */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.orange} />
          <Text style={styles.loadingText}>Loading order details...</Text>
        </View>
      </GradientContainer>
    );
  }

  // ── Render Error ────────────────────────────────────────────────────────
  if (error || !order) {
    return (
      <GradientContainer
        colors={["#FFF7D0", "#A9EFF2"]}
        style={styles.container}
        locations={[0, 1]}
      >
        <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

        {/* Header */}
        <CustomHeader
          title="Order Details"
          leftComponent={
            <CustomButton
              onPress={() => navigation.goBack()}
              icon={<BackButtonsvg fill="black" />}
              style={[commonStyle.TopbackButtonStyle, { backgroundColor: Colors.aquablue }]}
            />
          }
        />

        {/* Error State */}
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>😕 {error || 'Order not found'}</Text>
          <Text style={styles.errorSubtitle}>Please try again later</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </GradientContainer>
    );
  }

  // ── Extract Data ────────────────────────────────────────────────────────
  const {
    id,
    status,
    total_cents,
    currency = 'USD',
    accepted_at,
    delivered_at,
    items = [],
    User,
    Outlet,
    delivery_text,
  } = order;

  const itemCount = items.length;
  const totalAmount = formatPrice(total_cents);

  // ── Main Render ─────────────────────────────────────────────────────────
  return (
    <GradientContainer
      colors={["#FFF7D0", "#A9EFF2"]}
      style={styles.container}
      locations={[0, 1]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <CustomHeader
        title="Order Details"
        leftComponent={
          <CustomButton
            onPress={() => navigation.goBack()}
            icon={<BackButtonsvg fill="black" />}
            style={[commonStyle.TopbackButtonStyle, { backgroundColor: Colors.aquablue }]}
          />
        }
      />

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Order Info Card ──────────────────────────────────────────── */}
        <View style={styles.infoCard}>
          {/* Order ID & Status */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order ID</Text>
            <View style={styles.orderIdContainer}>
              <Text style={styles.orderIdText}>#{id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(status)}20` }]}>
                <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
                  {getStatusText(status)}
                </Text>
              </View>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Customer Info */}
          {User && (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Customer</Text>
                <Text style={styles.infoValue}>{User.display_name || '—'}</Text>
              </View>
              
              {User.phone && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{User.phone}</Text>
                </View>
              )}
              
              <View style={styles.divider} />
            </>
          )}

          {/* Outlet Info */}
          {Outlet && (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Outlet</Text>
                <Text style={styles.infoValue}>{Outlet.name || '—'}</Text>
              </View>
              
              <View style={styles.divider} />
            </>
          )}

          {/* Dates */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ordered At</Text>
            <Text style={styles.infoValue}>{formatDate(accepted_at)}</Text>
          </View>

          {delivered_at && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Delivered At</Text>
              <Text style={styles.infoValue}>{formatDate(delivered_at)}</Text>
            </View>
          )}

          {/* Divider */}
          <View style={styles.divider} />

          {/* Total */}
          <View style={styles.infoRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>{totalAmount}</Text>
          </View>
        </View>

        {/* ── Items Section ────────────────────────────────────────────── */}
        <View style={styles.itemsSection}>
          <View style={styles.itemsHeader}>
            <Text style={styles.itemsTitle}>Order Items</Text>
            <Text style={styles.itemsCount}>({itemCount} {itemCount === 1 ? 'item' : 'items'})</Text>
          </View>

          {/* Items List */}
          <View style={styles.itemsList}>
            {items.length === 0 ? (
              <View style={styles.emptyItems}>
                <Text style={styles.emptyItemsText}>No items found</Text>
              </View>
            ) : (
              <FlashList
                data={items}
                estimatedItemSize={80}
                keyExtractor={(item, index) => item?.id ? String(item.id) : String(index)}
                renderItem={({ item, index }) => (
                  //   <RenderItem item={item} index={index} />
                   <HistoryItem item={item} index={index} />
                )}
                scrollEnabled={false}
              />
            )}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: vs(20) }} />
      </ScrollView>
    </GradientContainer>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ms(16),
    paddingTop: vs(16),
  },

  // ── Loading State ───────────────────────────────────────────────────────
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: vs(12),
    fontSize: fontSize(16),
    fontFamily: Typography.Regular.fontFamily,
    color: Colors.borderColor1,
  },

  // ── Error State ─────────────────────────────────────────────────────────
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ms(32),
  },
  errorTitle: {
    fontSize: fontSize(20),
    fontFamily: Typography.SemiBold.fontFamily,
    color: Colors.black,
    marginBottom: vs(8),
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: fontSize(14),
    fontFamily: Typography.Regular.fontFamily,
    color: Colors.borderColor1,
    textAlign: 'center',
    marginBottom: vs(24),
  },
  retryButton: {
    backgroundColor: Colors.orange,
    paddingHorizontal: ms(32),
    paddingVertical: vs(12),
    borderRadius: ms(8),
  },
  retryButtonText: {
    fontSize: fontSize(16),
    fontFamily: Typography.SemiBold.fontFamily,
    color: Colors.white,
  },

  // ── Info Card ───────────────────────────────────────────────────────────
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: ms(16),
    marginBottom: vs(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: vs(8),
  },
  infoLabel: {
    fontSize: fontSize(14),
    fontFamily: Typography.Regular.fontFamily,
    color: Colors.borderColor1,
    flex: 1,
  },
  infoValue: {
    fontSize: fontSize(14),
    fontFamily: Typography.Medium.fontFamily,
    color: Colors.black,
    textAlign: 'right',
    flex: 1,
  },
  deliveryText: {
    fontSize: fontSize(13),
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
  },
  orderIdText: {
    fontSize: fontSize(14),
    fontFamily: Typography.SemiBold.fontFamily,
    color: Colors.black,
  },
  statusBadge: {
    paddingHorizontal: ms(12),
    paddingVertical: vs(4),
    borderRadius: ms(12),
  },
  statusText: {
    fontSize: fontSize(12),
    fontFamily: Typography.SemiBold.fontFamily,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderColor,
    marginVertical: vs(4),
  },
  totalLabel: {
    fontSize: fontSize(16),
    fontFamily: Typography.Bold.fontFamily,
    color: Colors.black,
  },
  totalValue: {
    fontSize: fontSize(18),
    fontFamily: Typography.Bold.fontFamily,
    color: Colors.orange,
  },

  // ── Items Section ───────────────────────────────────────────────────────
  itemsSection: {
    marginBottom: vs(16),
  },
  itemsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(12),
  },
  itemsTitle: {
    fontSize: fontSize(18),
    fontFamily: Typography.Bold.fontFamily,
    color: Colors.black,
  },
  itemsCount: {
    fontSize: fontSize(14),
    fontFamily: Typography.Regular.fontFamily,
    color: Colors.borderColor1,
    marginLeft: ms(8),
  },
  itemsList: {
    minHeight: vs(100),
  },
  itemWrapper: {
    paddingVertical: vs(4),
  },
  emptyItems: {
    paddingVertical: vs(40),
    alignItems: 'center',
  },
  emptyItemsText: {
    fontSize: fontSize(14),
    fontFamily: Typography.Regular.fontFamily,
    color: Colors.borderColor1,
  },
});

export default OrderHistoryDetails;