import React, { useEffect, useState, useCallback, useContext } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { hp, ms, s, vs } from '../../utils/responsive';
import OrderHeaderCard from './OrderHeaderCard';
import { useNavigation } from '@react-navigation/native';
import RenderItem from '../RenderItem/RenderItem';
import Colors from '../../utils/colors';
import { Typography } from '../../utils/typography';
import { apiClient } from '../../api/axios';
import { ENDPOINTS } from '../../api/endpoints';
import { logger } from '../../utils/logger';
import { LoaderContext } from '../../context/LoaderContext';

interface OrderItem {
  id: number;
  menu_item: {
    id: number;
    name: string;
    description: string;
    price: string;
    image_url: string[];
    options: any[];
  };
  quantity: number;
}

interface Order {
  order_id: number;
  status: string;
  delivery_status: string;
  timestamps: {
    assigned_at: string;
    delivered_at: string | null;
    estimated_delivery_time: string | null;
  };
  items: OrderItem[];
  customer: {
    id: number;
    name: string;
    phone: string;
    image_url: string | null;
  };
  outlet: {
    id: number;
    name: string;
    image_url: string;
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface ApiResponse {
  total_orders: number;
  current_page: number;
  total_pages: number;
  orders: Order[];
}

const PREVIEW_COUNT = 3;

const OrderHistoryCard = () => {
  const navigation = useNavigation();
  const { show, hide } = useContext(LoaderContext);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (page: number, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setError(null);
    }

    try {
      show();
      const response = await apiClient.get<ApiResponse>(ENDPOINTS.RUNNER_ORDERS.HISTORY, {
        params: { page, limit: 10 },
      });

      logger.log('Order history response:', response.data);

      const { orders: newOrders, total_pages } = response.data;

      setOrders(prev => isLoadMore ? [...prev, ...newOrders] : newOrders);
      setTotalPages(total_pages);
      setCurrentPage(page);
    } catch (err: any) {
      logger.error('Error fetching order history:', err);
      setError(err?.response?.data?.message || 'Failed to load order history');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      hide();
    }
  }, []);

  useEffect(() => {
    fetchOrders(1);
  }, []);

  const handleLoadMore = () => {
    // if (!loadingMore && currentPage < totalPages) {
    //   fetchOrders(currentPage + 1, true);
    // }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return Colors.green2 || '#1BA09C';
      case 'pending': return '#F59E0B';
      case 'cancelled': return '#EF4444';
      default: return Colors.borderColor1;
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTotalPrice = (items: OrderItem[]) => {
    const total = items.reduce((sum, item) => {
      return sum + (parseFloat(item.menu_item.price) * item.quantity) / 100;
    }, 0);
    return total.toFixed(2);
  };

  // if (loading) {
  //   return (
  //     <View style={styles.centered}>
  //       <ActivityIndicator size="large" color={Colors.aquablue || '#A9EFF2'} />
  //     </View>
  //   );
  // }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorEmoji}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => fetchOrders(1)}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorEmoji}>📦</Text>
        <Text style={styles.errorText}>No orders yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(order) => order.order_id.toString()}
      contentContainerStyle={{ padding: s(10) }}
      showsVerticalScrollIndicator={false}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator
            size="small"
            color={Colors.aquablue || '#A9EFF2'}
            style={{ marginVertical: vs(16) }}
          />
        ) : null
      }
      
      renderItem={({ item: order }) => {
        const previewItems = order.items.slice(0, PREVIEW_COUNT);

        return (
          <TouchableOpacity
            style={styles.cardContainer}
            activeOpacity={0.85}
            // onPress={() =>
            //   navigation.navigate('OrderHistoryDetails', {
            //     orderId: order.order_id,
            //     items: order.items,
            //     restaurant: {
            //       name: order.outlet.name,
            //       subtitle: `Customer: ${order.customer.name}`,
            //       image: order.outlet.image_url,
            //       totalPrice: getTotalPrice(order.items),
            //     },
            //   })
            // }
          >
            {/* Header */}
            <OrderHeaderCard
              title={order.outlet.name}
              subtitle={`Customer: ${order.customer.name} · ${order.customer.phone}`}
              price={getTotalPrice(order.items)}
              image={order.outlet.image_url}
            />

            <View style={[styles.dottedLine, { marginBottom: vs(10) }]} />

            {/* Preview Items */}
            <View style={{ paddingHorizontal: ms(14) }}>
            {previewItems.map((item, index) => (
                 <RenderItem
                  key={item.id}
                  index={index}
                  item={{
                    id:       item.id,
                    quantity: item.quantity,
                    price:    item.menu_item.price,
                    menu_item: {
                      name:        item.menu_item.name,
                      description: item.menu_item.description,
                      image_url:   item.menu_item.image_url,
                      item_type:   item.menu_item.item_type,
                    },
                    options: [],
                  }}
                />
              ))}

              {order.items.length > PREVIEW_COUNT && (
                <Text style={styles.moreItems}>
                  +{order.items.length - PREVIEW_COUNT} more item{order.items.length - PREVIEW_COUNT > 1 ? 's' : ''}
                </Text>
              )}
            </View>

            <View style={styles.dottedLine} />

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={[styles.statusBadge, { color: getStatusColor(order.status) }]}>
                ● {getStatusLabel(order.status)}
              </Text>
              {order.timestamps.delivered_at && (
                <Text style={styles.infotext}>
                  {formatDate(order.timestamps.delivered_at)}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default OrderHistoryCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: ms(16),
    marginBottom: vs(16),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    paddingBottom: vs(10),
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(5),
    gap: ms(8),
  },
  itemQty: {
    fontSize: ms(13),
    color: Colors.borderColor1,
    fontFamily: Typography.Medium.fontFamily,
    minWidth: ms(28),
  },
  itemName: {
    flex: 1,
    fontSize: ms(13),
    color: '#1C1C1C',
    fontFamily: Typography.Medium.fontFamily,
  },
  itemPrice: {
    fontSize: ms(13),
    color: '#1C1C1C',
    fontFamily: Typography.SemiBold?.fontFamily || Typography.Medium.fontFamily,
    fontWeight: '600',
  },
  moreItems: {
    fontSize: ms(12),
    color: Colors.borderColor1,
    fontFamily: Typography.Medium.fontFamily,
    marginTop: vs(2),
    marginBottom: vs(6),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ms(14),
    marginTop: vs(6),
  },
  statusBadge: {
    fontSize: ms(12),
    fontFamily: Typography.Medium.fontFamily,
    fontWeight: '600',
  },
  infotext: {
    fontSize: ms(11),
    color: Colors.borderColor1,
    fontFamily: Typography.Medium.fontFamily,
    fontWeight: '500',
  },
  dottedLine: {
    borderBottomWidth: 1.4,
    borderBottomColor: '#E4E4EB',
    borderStyle: 'dashed',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: ms(20),
    gap: vs(12),
  },
  errorEmoji: {
    fontSize: ms(48),
  },
  errorText: {
    fontSize: ms(15),
    color: '#686B78',
    textAlign: 'center',
    fontFamily: Typography.Medium.fontFamily,
  },
  retryBtn: {
    marginTop: vs(8),
    paddingHorizontal: ms(24),
    paddingVertical: vs(10),
    backgroundColor: Colors.aquablue || '#A9EFF2',
    borderRadius: ms(10),
  },
  retryText: {
    fontSize: ms(14),
    fontWeight: '600',
    color: '#1C1C1C',
    fontFamily: Typography.Medium.fontFamily,
  },
});


// import React, { useEffect, useState, useCallback } from 'react';
// import { StyleSheet, View, FlatList, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
// import { hp, ms, s, vs } from '../../utils/responsive';
// import OrderHeaderCard from './OrderHeaderCard';
// import { useNavigation } from '@react-navigation/native';
// import RenderItem from '../RenderItem/RenderItem';
// import Colors from '../../utils/colors';
// import { Typography } from '../../utils/typography';
// import { apiClient } from '../../api/axios';
// import { ENDPOINTS } from '../../api/endpoints';
// import { logger } from '../../utils/logger';

// interface OrderItem {
//   id: number;
//   menu_item: {
//     id: number;
//     name: string;
//     description: string;
//     price: string;
//     image_url: string[];
//     item_type?: string;
//     options: any[];
//   };
//   quantity: number;
// }

// interface Order {
//   order_id: number;
//   status: string;
//   delivery_status: string;
//   timestamps: {
//     assigned_at: string;
//     delivered_at: string | null;
//     estimated_delivery_time: string | null;
//   };
//   items: OrderItem[];
//   customer: {
//     id: number;
//     name: string;
//     phone: string;
//     image_url: string | null;
//   };
//   outlet: {
//     id: number;
//     name: string;
//     image_url: string;
//     location: {
//       lat: number;
//       lng: number;
//     };
//   };
// }

// interface ApiResponse {
//   total_orders: number;
//   current_page: number;
//   total_pages: number;
//   orders: Order[];
// }

// const PREVIEW_COUNT = 3;

// const OrderHistoryCard = () => {
//   const navigation = useNavigation();

//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [error, setError] = useState<string | null>(null);

//   const fetchOrders = useCallback(async (page: number, isLoadMore = false) => {
//     if (isLoadMore) {
//       setLoadingMore(true);
//     } else {
//       setLoading(true);
//       setError(null);
//     }

//     try {
//      const response = await apiClient.get<ApiResponse>(ENDPOINTS.RUNNER_ORDERS.HISTORY, {
//          params: { page, limit: 10 },
//        });

//       logger.log('Order history response:', response.data);

//       const { orders: newOrders, total_pages } = response.data;

//       setOrders(prev => isLoadMore ? [...prev, ...newOrders] : newOrders);
//       setTotalPages(total_pages);
//       setCurrentPage(page);
//     } catch (err: any) {
//       logger.error('Error fetching order history:', err);
//       setError(err?.response?.data?.message || 'Failed to load order history');
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchOrders(1);
//   }, []);

//   const handleLoadMore = () => {
//     if (!loadingMore && currentPage < totalPages) {
//       fetchOrders(currentPage + 1, true);
//     }
//   };

//   const getStatusLabel = (status: string) => {
//     switch (status) {
//       case 'delivered': return 'Delivered';
//       case 'pending': return 'Pending';
//       case 'cancelled': return 'Cancelled';
//       default: return status;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'delivered': return Colors.green2 || '#1BA09C';
//       case 'pending': return '#F59E0B';
//       case 'cancelled': return '#EF4444';
//       default: return Colors.borderColor1;
//     }
//   };

//   const formatDate = (dateStr: string | null) => {
//     if (!dateStr) return '';
//     const date = new Date(dateStr);
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   const getTotalPrice = (items: OrderItem[]) => {
//     const total = items.reduce((sum, item) => {
//       return sum + (parseFloat(item.menu_item.price) * item.quantity) / 100;
//     }, 0);
//     return total.toFixed(2);
//   };

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color={Colors.aquablue || '#A9EFF2'} />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.centered}>
//         <Text style={styles.errorEmoji}>⚠️</Text>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity style={styles.retryBtn} onPress={() => fetchOrders(1)}>
//           <Text style={styles.retryText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   if (orders.length === 0) {
//     return (
//       <View style={styles.centered}>
//         <Text style={styles.errorEmoji}>📦</Text>
//         <Text style={styles.errorText}>No orders yet</Text>
//       </View>
//     );
//   }

//   return (
//     <FlatList
//       data={orders}
//       keyExtractor={(order) => order.order_id.toString()}
//       contentContainerStyle={{ padding: s(10) }}
//       showsVerticalScrollIndicator={false}
//       onEndReached={handleLoadMore}
//       onEndReachedThreshold={0.5}
//       ListFooterComponent={
//         loadingMore ? (
//           <ActivityIndicator
//             size="small"
//             color={Colors.aquablue || '#A9EFF2'}
//             style={{ marginVertical: vs(16) }}
//           />
//         ) : null
//       }
//       renderItem={({ item: order }) => {
//         const previewItems = order.items.slice(0, PREVIEW_COUNT);

//         return (
//           <TouchableOpacity
//             style={styles.cardContainer}
//             activeOpacity={0.85}
           
//           >
//             {/* Header */}
//             {/* <OrderHeaderCard
//               title={order.outlet.name}
//               subtitle={`Customer: ${order.customer.name} · ${order.customer.phone}`}
//               price={getTotalPrice(order.items)}
//               image={order.outlet.image_url}
//             /> */}

//             <View style={[styles.dottedLine, { marginBottom: vs(10) }]} />

//             {/* Preview Items */}
//             <View style={{ paddingHorizontal: ms(14) }}>
//               {previewItems.map((item, index) => (
//                 <RenderItem
//                   key={item.id}
//                   index={index}
//                   item={{
//                     id:       item.id,
//                     quantity: item.quantity,
//                     price:    item.menu_item.price,
//                     menu_item: {
//                       name:        item.menu_item.name,
//                       description: item.menu_item.description,
//                       image_url:   item.menu_item.image_url,
//                       item_type:   item.menu_item.item_type,
//                     },
//                     options: [],
//                   }}
//                 />
//               ))}

//               {order.items.length > PREVIEW_COUNT && (
//                 <Text style={styles.moreItems}>
//                   +{order.items.length - PREVIEW_COUNT} more item{order.items.length - PREVIEW_COUNT > 1 ? 's' : ''}
//                 </Text>
//               )}
//             </View>

//             <View style={styles.dottedLine} />

//             {/* Footer */}
//             <View style={styles.footer}>
//               <Text style={[styles.statusBadge, { color: getStatusColor(order.status) }]}>
//                 ● {getStatusLabel(order.status)}
//               </Text>
//               {order.timestamps.delivered_at && (
//                 <Text style={styles.infotext}>
//                   {formatDate(order.timestamps.delivered_at)}
//                 </Text>
//               )}
//             </View>
//           </TouchableOpacity>
//         );
//       }}
//     />
//   );
// };

// export default OrderHistoryCard;

// const styles = StyleSheet.create({
//   cardContainer: {
//     backgroundColor: '#fff',
//     borderRadius: ms(16),
//     marginBottom: vs(16),
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     paddingBottom: vs(10),
//   },
//   moreItems: {
//     fontSize: ms(12),
//     color: Colors.borderColor1,
//     fontFamily: Typography.Medium.fontFamily,
//     marginTop: vs(2),
//     marginBottom: vs(6),
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: ms(14),
//     marginTop: vs(6),
//   },
//   statusBadge: {
//     fontSize: ms(12),
//     fontFamily: Typography.Medium.fontFamily,
//     fontWeight: '600',
//   },
//   infotext: {
//     fontSize: ms(11),
//     color: Colors.borderColor1,
//     fontFamily: Typography.Medium.fontFamily,
//     fontWeight: '500',
//   },
//   dottedLine: {
//     borderBottomWidth: 1.4,
//     borderBottomColor: '#E4E4EB',
//     borderStyle: 'dashed',
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: ms(20),
//     gap: vs(12),
//   },
//   errorEmoji: {
//     fontSize: ms(48),
//   },
//   errorText: {
//     fontSize: ms(15),
//     color: '#686B78',
//     textAlign: 'center',
//     fontFamily: Typography.Medium.fontFamily,
//   },
//   retryBtn: {
//     marginTop: vs(8),
//     paddingHorizontal: ms(24),
//     paddingVertical: vs(10),
//     backgroundColor: Colors.aquablue || '#A9EFF2',
//     borderRadius: ms(10),
//   },
//   retryText: {
//     fontSize: ms(14),
//     fontWeight: '600',
//     color: '#1C1C1C',
//     fontFamily: Typography.Medium.fontFamily,
//   },
// });