// import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
// import { getAvailableOrders, getRunnerStatus, setRunnerStatus, acceptOrder as acceptOrderApi } from '../services/Orders/order.api';
// import { logger } from '../utils/logger';
// import { socketService } from '../services/Socket/SocketService';
// import { SOCKET_EVENTS, ALL_ORDER_EVENTS, RunnerSTATUS_EVENTS } from '../services/Socket/SocketEvents';
// import { useAuth } from '../hooks/useAuth';
// import { useToast } from '../hooks/ToastProvider';

// // ────────────────────────────────────────────────────────────────────────────
// // TYPES
// // ────────────────────────────────────────────────────────────────────────────
// export interface Order {
//   id: number;
//   distance: string;
//   time_remaining: number;
//   delivery_address?: string;
//   delivery_text?: string;
//   estimated_ready_at?: string;
//   location: string;
//   estimatedReadyAt: string | null;
//   time: string;
//   [key: string]: any;
// }

// export interface RunnerStatus {
//   is_on_duty: boolean;
//   current_assignment?: any;
//   total_delivered?: number;
//   [key: string]: any;
// }

// export interface OrdersState {
//   orders: Order[];
//   activeAssignment: any | null;
//   runnerStatus: RunnerStatus | null;
//   isLoadingOrders: boolean;
//   isLoadingStatus: boolean;
//   isAccepting: boolean;
//   lastFetchTime: number | null;
//   error: string | null;
// }

// export type OrdersAction =
//   | { type: 'SET_ORDERS'; payload: Order[] }
//   | { type: 'ADD_ORDER'; payload: Order }
//   | { type: 'REMOVE_ORDER'; payload: number }
//   | { type: 'SET_ACTIVE_ASSIGNMENT'; payload: any }
//   | { type: 'SET_RUNNER_STATUS'; payload: RunnerStatus }
//   | { type: 'SET_IS_LOADING_ORDERS'; payload: boolean }
//   | { type: 'SET_IS_LOADING_STATUS'; payload: boolean }
//   | { type: 'SET_IS_ACCEPTING'; payload: boolean }
//   | { type: 'SET_ERROR'; payload: string | null }
//   | { type: 'SET_LAST_FETCH_TIME'; payload: number }
//   | { type: 'RESET_ORDERS' };

// // ────────────────────────────────────────────────────────────────────────────
// // INITIAL STATE
// // ────────────────────────────────────────────────────────────────────────────
// const initialState: OrdersState = {
//   orders: [],
//   activeAssignment: null,
//   runnerStatus: null,
//   isLoadingOrders: false,
//   isLoadingStatus: false,
//   isAccepting: false,
//   lastFetchTime: null,
//   error: null,
// };

// // ────────────────────────────────────────────────────────────────────────────
// // REDUCER
// // ────────────────────────────────────────────────────────────────────────────
// const ordersReducer = (state: OrdersState, action: OrdersAction): OrdersState => {
//   switch (action.type) {
//     case 'SET_ORDERS':
//       return { ...state, orders: action.payload };

//     case 'ADD_ORDER':
//       // Prevent duplicates
//       if (state.orders.some(o => o.id === action.payload.id)) {
//         return state;
//       }
//       return { ...state, orders: [action.payload, ...state.orders] };

//     case 'REMOVE_ORDER':
//       return { ...state, orders: state.orders.filter(o => o.id !== action.payload) };

//     case 'SET_ACTIVE_ASSIGNMENT':
//       return { ...state, activeAssignment: action.payload };

//     case 'SET_RUNNER_STATUS':
//       return { ...state, runnerStatus: action.payload };

//     case 'SET_IS_LOADING_ORDERS':
//       return { ...state, isLoadingOrders: action.payload };

//     case 'SET_IS_LOADING_STATUS':
//       return { ...state, isLoadingStatus: action.payload };

//     case 'SET_IS_ACCEPTING':
//       return { ...state, isAccepting: action.payload };

//     case 'SET_ERROR':
//       return { ...state, error: action.payload };

//     case 'SET_LAST_FETCH_TIME':
//       return { ...state, lastFetchTime: action.payload };

//     case 'RESET_ORDERS':
//       return { ...state, orders: [], activeAssignment: null, runnerStatus: null };

//     default:
//       return state;
//   }
// };

// // ────────────────────────────────────────────────────────────────────────────
// // CONTEXT
// // ────────────────────────────────────────────────────────────────────────────
// interface OrdersContextType {
//   state: OrdersState;
//   loadOrders: (latitude?: number, longitude?: number) => Promise<void>;
//   loadRunnerStatus: (onActiveOrder?: (order: any) => void) => Promise<any>;
//   toggleRunnerDuty: (latitude?: number, longitude?: number) => Promise<void>;
//   handleAcceptOrder: (orderId: number, onSuccess?: (order: any) => void) => Promise<void>;
//   syncOrders: () => Promise<void>;
//   dispatchAction: (action: OrdersAction) => void;
// }

// const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

// // ────────────────────────────────────────────────────────────────────────────
// // PROVIDER COMPONENT
// // ────────────────────────────────────────────────────────────────────────────
// interface OrdersProviderProps {
//   children: React.ReactNode;
//   cacheTimeoutMs?: number;
// }

// export const OrdersProvider: React.FC<OrdersProviderProps> = ({
//   children,
//   cacheTimeoutMs = 30000, // 30 seconds cache
// }) => {
//   const [state, dispatch] = useReducer(ordersReducer, initialState);
//   const { toast } = useToast();
//   const { user } = useAuth();
//   const locationRef = useRef<{ latitude: number; longitude: number } | null>(null);
//   const socketListenersRef = useRef<Map<string, Function>>(new Map());

//   // ── getCurrentLocation ──────────────────────────────────────────────────────
//   const getCurrentLocation = useCallback(
//     (): Promise<{ latitude: number; longitude: number }> => {
//       return new Promise((resolve, reject) => {
//         if (typeof navigator === 'undefined' || !navigator.geolocation) {
//           reject(new Error('Geolocation not supported'));
//           return;
//         }

//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             const location = {
//               latitude: position.coords.latitude,
//               longitude: position.coords.longitude,
//             };
//             locationRef.current = location;
//             resolve(location);
//           },
//           (error) => {
//             logger.log('Geolocation error:', error);
//             reject(new Error('Failed to get location'));
//           }
//         );
//       });
//     },
//     []
//   );

//   // ── mapOrderData ────────────────────────────────────────────────────────────
//   const mapOrderData = useCallback((order: any): Order => ({
//     ...order,
//     distance:
//       parseFloat(order.distance?.kilometers) > 0
//         ? `${order.distance.kilometers} km`
//         : `${order.distance?.meters ?? 0} m`,
//     location: order.delivery_address || order.delivery_text || 'Resort pickup',
//     estimatedReadyAt: order.estimated_ready_at ?? null,
//     time: `${order.time_remaining ?? 0} min`,
//   }), []);

//   // ── loadOrders ──────────────────────────────────────────────────────────────
//   const loadOrders = useCallback(
//     async (latitude?: number, longitude?: number) => {
//       try {
//         dispatch({ type: 'SET_IS_LOADING_ORDERS', payload: true });
//         dispatch({ type: 'SET_ERROR', payload: null });

//         let finalLatitude = latitude;
//         let finalLongitude = longitude;

//         if (finalLatitude === undefined || finalLongitude === undefined) {
//           const location = await getCurrentLocation();
//           finalLatitude = location.latitude;
//           finalLongitude = location.longitude;
//         }

//         const ordersRes = await getAvailableOrders(finalLatitude, finalLongitude);

//         if (!ordersRes?.success) {
//           dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch orders' });
//           return;
//         }

//         const mapped = (ordersRes?.data || []).map(mapOrderData);
//         dispatch({ type: 'SET_ORDERS', payload: mapped });
//         dispatch({ type: 'SET_LAST_FETCH_TIME', payload: Date.now() });
//       } catch (error) {
//         logger.log('loadOrders error:', error);
//         dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
//       } finally {
//         dispatch({ type: 'SET_IS_LOADING_ORDERS', payload: false });
//       }
//     },
//     [getCurrentLocation, mapOrderData]
//   );

//   // ── loadRunnerStatus ────────────────────────────────────────────────────────
//   const loadRunnerStatus = useCallback(
//     async (onActiveOrder?: (order: any) => void) => {
//       try {
//         dispatch({ type: 'SET_IS_LOADING_STATUS', payload: true });

//         const statusRes = await getRunnerStatus();

//         if (!statusRes?.success) {
//           return { is_on_duty: false };
//         }

//         const status = statusRes.data;
//         dispatch({ type: 'SET_RUNNER_STATUS', payload: status });

//         if (status?.current_assignment) {
//           dispatch({ type: 'SET_ACTIVE_ASSIGNMENT', payload: status.current_assignment });
//           onActiveOrder?.(status.current_assignment);
//           return { is_on_duty: true, current_assignment: true };
//         }

//         return { is_on_duty: status?.is_on_duty, current_assignment: false };
//       } catch (error) {
//         logger.log('loadRunnerStatus error:', error);
//         return null;
//       } finally {
//         dispatch({ type: 'SET_IS_LOADING_STATUS', payload: false });
//       }
//     },
//     []
//   );

//   // ── toggleRunnerDuty ────────────────────────────────────────────────────────
//   const toggleRunnerDuty = useCallback(
//     async (latitude?: number, longitude?: number) => {
//       if (state.isLoadingStatus) return;

//       try {
//         dispatch({ type: 'SET_IS_LOADING_STATUS', payload: true });

//         const res = await setRunnerStatus();

//         if (res?.success) {
//           const isOnDuty = res.data?.is_on_duty;
//           toast(res?.message || 'Status updated', 'success', 3000);

//           dispatch({ type: 'SET_RUNNER_STATUS', payload: res.data });

//           if (!isOnDuty) {
//             dispatch({ type: 'RESET_ORDERS' });
//           } else {
//             if (latitude && longitude) {
//               await loadOrders(latitude, longitude);
//             } else {
//               await loadOrders();
//             }
//           }
//         }
//       } catch (error) {
//         logger.log('toggleRunnerDuty error:', error);
//       } finally {
//         dispatch({ type: 'SET_IS_LOADING_STATUS', payload: false });
//       }
//     },
//     [state.isLoadingStatus, loadOrders, toast]
//   );

//   // ── handleAcceptOrder ───────────────────────────────────────────────────────
//   const handleAcceptOrder = useCallback(
//     async (orderId: number, onSuccess?: (order: any) => void) => {
//       try {
//         dispatch({ type: 'SET_IS_ACCEPTING', payload: true });

//         const res = await acceptOrderApi(orderId);

//         if (res?.success) {
//           toast(res?.message || 'Order accepted!', 'success', 3000);
//           dispatch({ type: 'REMOVE_ORDER', payload: orderId });
//           onSuccess?.(res.data);
//         } else {
//           toast(res?.message || 'Order already assigned', 'error', 3000);
//         }
//       } catch (error) {
//         logger.log('acceptOrder error:', error);
//         toast((error as Error)?.message || 'Failed to accept order', 'error', 3000);
//       } finally {
//         dispatch({ type: 'SET_IS_ACCEPTING', payload: false });
//       }
//     },
//     [toast]
//   );

//   // ── syncOrders (refresh with cache check) ────────────────────────────────────
//   const syncOrders = useCallback(async () => {
//     const now = Date.now();
//     const lastFetch = state.lastFetchTime || 0;

//     // Only fetch if cache expired
//     if (now - lastFetch < cacheTimeoutMs) {
//       logger.log('Orders cache still valid, skipping fetch');
//       return;
//     }

//     if (locationRef.current) {
//       await loadOrders(locationRef.current.latitude, locationRef.current.longitude);
//     } else {
//       await loadOrders();
//     }
//   }, [state.lastFetchTime, cacheTimeoutMs, loadOrders]);

//   // ── dispatchAction (manual state dispatch) ──────────────────────────────────
//   const dispatchAction = useCallback((action: OrdersAction) => {
//     dispatch(action);
//   }, []);

//   // ────────────────────────────────────────────────────────────────────────────
//   // 🔥 SOCKET EVENT LISTENERS - Using your SocketService
//   // ────────────────────────────────────────────────────────────────────────────

//   // ── Handle Order Events ──────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!socketService.isConnected()) return;

//     // Listen to all order-related events
//     const handleOrderEvent = (eventName: string) => {
//       const handler = async (data: any) => {
//         logger.log(`[Orders] Socket event: ${eventName}`, data);

//         switch (eventName) {
//           // ── New order assigned to this runner
//           case SOCKET_EVENTS.ORDER_ASSIGNED:
//             if (data?.order) {
//               const mapped = mapOrderData(data.order);
//               dispatch({ type: 'ADD_ORDER', payload: mapped });
//               toast(`New order: ${data.order.delivery_address}`, 'info');
//             }
//             break;

//           // ── Order ready for pickup
//           case SOCKET_EVENTS.ORDER_READY:
//             logger.log('[Orders] Order ready:', data?.orderId);
//             // Could update order status in list
//             break;

//           // ── Order accepted by runner
//           case SOCKET_EVENTS.ORDER_ACCEPTED:
//             logger.log('[Orders] Order accepted:', data?.orderId);
//             dispatch({ type: 'REMOVE_ORDER', payload: data?.orderId});
//             break;

//           // ── Order picked up
//           case SOCKET_EVENTS.ORDER_PICKED_UP:
//             if (data?.order_id) {
//               dispatch({ type: 'SET_ACTIVE_ASSIGNMENT', payload: data });
//             }
//             break;

//           // ── Order delivered
//           case SOCKET_EVENTS.ORDER_DELIVERED:
//             dispatch({ type: 'REMOVE_ORDER', payload: data?.orderId });
//             if (data?.total_delivered) {
//               dispatch({
//                 type: 'SET_RUNNER_STATUS',
//                 payload: { ...state.runnerStatus, total_delivered: data.total_delivered },
//               });
//             }
//             break;

//           default:
//             break;
//         }
//       };

//       // Store handler reference for cleanup
//       socketListenersRef.current.set(eventName, handler);

//       // Subscribe to event
//       socketService.on(eventName, handler);
//     };

//     // Subscribe to all order events
//     ALL_ORDER_EVENTS.forEach(event => {
//       handleOrderEvent(event);
//     });

//     // Cleanup: unsubscribe on unmount
//     return () => {
//       socketListenersRef.current.forEach((handler, eventName) => {
//         socketService.off(eventName, handler as any);
//       });
//       socketListenersRef.current.clear();
//     };
//   }, [mapOrderData, state.runnerStatus, toast]);

//   // ── Handle Runner Status Events ──────────────────────────────────────────────
//   useEffect(() => {
//     if (!socketService.isConnected()) return;

//     const handleRunnerStatusChange = (data: any) => {
//       logger.log('[Orders] Runner status changed:', data);

//       if (data?.is_on_duty !== undefined) {
//         dispatch({
//           type: 'SET_RUNNER_STATUS',
//           payload: { ...state.runnerStatus, is_on_duty: data.is_on_duty },
//         });

//         if (!data.is_on_duty) {
//           dispatch({ type: 'RESET_ORDERS' });
//         } else {
//           // Refresh orders when going on duty
//           loadOrders();
//         }
//       }

//       if (data?.current_assignment) {
//         dispatch({ type: 'SET_ACTIVE_ASSIGNMENT', payload: data.current_assignment });
//       }
//     };

//     socketListenersRef.current.set(SOCKET_EVENTS.RUNNER_STATUS_CHANGED, handleRunnerStatusChange);
//     socketService.on(SOCKET_EVENTS.RUNNER_STATUS_CHANGED, handleRunnerStatusChange);

//     return () => {
//       socketService.off(SOCKET_EVENTS.RUNNER_STATUS_CHANGED, handleRunnerStatusChange);
//       socketListenersRef.current.delete(SOCKET_EVENTS.RUNNER_STATUS_CHANGED);
//     };
//   }, [state.runnerStatus, loadOrders]);

//   // ────────────────────────────────────────────────────────────────────────────
//   // 🔥 AUTO-REFRESH: Refresh orders periodically
//   // ────────────────────────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!user?.id || state.orders.length === 0) return;

//     const interval = setInterval(() => {
//       syncOrders();
//     }, 45000); // Refresh every 45 seconds (cache is 30s)

//     return () => clearInterval(interval);
//   }, [user?.id, state.orders.length, syncOrders]);

//   const value: OrdersContextType = {
//     state,
//     loadOrders,
//     loadRunnerStatus,
//     toggleRunnerDuty,
//     handleAcceptOrder,
//     syncOrders,
//     dispatchAction,
//   };

//   return (
//     <OrdersContext.Provider value={value}>
//       {children}
//     </OrdersContext.Provider>
//   );
// };

// // ────────────────────────────────────────────────────────────────────────────
// // CUSTOM HOOK
// // ────────────────────────────────────────────────────────────────────────────
// export const useOrdersContext = (): OrdersContextType => {
//   const context = useContext(OrdersContext);
//   if (!context) {
//     throw new Error('useOrdersContext must be used within OrdersProvider');
//   }
//   return context;
// };

import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { getAvailableOrders, getRunnerStatus, setRunnerStatus, acceptOrder as acceptOrderApi } from '../services/Orders/order.api';
import { logger } from '../utils/logger';
import { socketService } from '../services/Socket/SocketService';
import { SOCKET_EVENTS, ALL_ORDER_EVENTS, RunnerSTATUS_EVENTS } from '../services/Socket/SocketEvents';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/ToastProvider';

// ────────────────────────────────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────────────────────────────────
export interface Order {
  id: number;
  distance: string;
  time_remaining: number;
  delivery_address?: string;
  delivery_text?: string;
  estimated_ready_at?: string;
  location: string;
  estimatedReadyAt: string | null;
  time: string;
  [key: string]: any;
}

export interface RunnerStatus {
  is_on_duty: boolean;
  current_assignment?: any;
  total_delivered?: number;
  last_clock_in?: string;
  [key: string]: any;
}

export interface OrdersState {
  orders: Order[];
  activeAssignment: any | null;
  runnerStatus: RunnerStatus | null;
  isLoadingOrders: boolean;
  isLoadingStatus: boolean;
  isAccepting: boolean;
  lastFetchTime: number | null;
  lastStatusFetchTime: number | null;
  error: string | null;
}

export type OrdersAction =
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'REMOVE_ORDER'; payload: number }
  | { type: 'SET_ACTIVE_ASSIGNMENT'; payload: any }
  | { type: 'SET_RUNNER_STATUS'; payload: RunnerStatus }
  | { type: 'SET_IS_LOADING_ORDERS'; payload: boolean }
  | { type: 'SET_IS_LOADING_STATUS'; payload: boolean }
  | { type: 'SET_IS_ACCEPTING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LAST_FETCH_TIME'; payload: number }
  | { type: 'SET_LAST_STATUS_FETCH_TIME'; payload: number }
  | { type: 'RESET_ORDERS' };

// ────────────────────────────────────────────────────────────────────────────
// INITIAL STATE
// ────────────────────────────────────────────────────────────────────────────
const initialState: OrdersState = {
  orders: [],
  activeAssignment: null,
  runnerStatus: null,
  isLoadingOrders: false,
  isLoadingStatus: false,
  isAccepting: false,
  lastFetchTime: null,
  lastStatusFetchTime: null,
  error: null,
};

// ────────────────────────────────────────────────────────────────────────────
// REDUCER
// ────────────────────────────────────────────────────────────────────────────
const ordersReducer = (state: OrdersState, action: OrdersAction): OrdersState => {
  switch (action.type) {
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };

    case 'ADD_ORDER':
      if (state.orders.some(o => o.id === action.payload.id)) {
        return state;
      }
      return { ...state, orders: [action.payload, ...state.orders] };

    case 'REMOVE_ORDER':
      return { ...state, orders: state.orders.filter(o => o.id !== action.payload) };

    case 'SET_ACTIVE_ASSIGNMENT':
      return { ...state, activeAssignment: action.payload };

    case 'SET_RUNNER_STATUS':
      return { ...state, runnerStatus: action.payload };

    case 'SET_IS_LOADING_ORDERS':
      return { ...state, isLoadingOrders: action.payload };

    case 'SET_IS_LOADING_STATUS':
      return { ...state, isLoadingStatus: action.payload };

    case 'SET_IS_ACCEPTING':
      return { ...state, isAccepting: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_LAST_FETCH_TIME':
      return { ...state, lastFetchTime: action.payload };

    case 'SET_LAST_STATUS_FETCH_TIME':
      return { ...state, lastStatusFetchTime: action.payload };

    case 'RESET_ORDERS':
      return { ...state, orders: [], activeAssignment: null, runnerStatus: null };

    default:
      return state;
  }
};

// ────────────────────────────────────────────────────────────────────────────
// CONTEXT
// ────────────────────────────────────────────────────────────────────────────
interface OrdersContextType {
  state: OrdersState;
  loadOrders: (latitude?: number, longitude?: number) => Promise<Order[]>; // ✅ RETURNS ORDERS
  loadRunnerStatus: (onActiveOrder?: (order: any) => void, forceFetch?: boolean) => Promise<RunnerStatus | null>;
  toggleRunnerDuty: (latitude?: number, longitude?: number) => Promise<void>;
  handleAcceptOrder: (orderId: number, onSuccess?: (order: any) => void, onAlreadyAssigned?: () => void) => Promise<void>;
  syncOrders: (latitude?: number, longitude?: number) => Promise<void>;
  dispatchAction: (action: OrdersAction) => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

// ────────────────────────────────────────────────────────────────────────────
// PROVIDER COMPONENT
// ────────────────────────────────────────────────────────────────────────────
interface OrdersProviderProps {
  children: React.ReactNode;
  cacheTimeoutMs?: number;
  statusCacheTimeoutMs?: number;
}

export const OrdersProvider: React.FC<OrdersProviderProps> = ({
  children,
  cacheTimeoutMs = 30000,
  statusCacheTimeoutMs = 20000,
}) => {
  const [state, dispatch] = useReducer(ordersReducer, initialState);
  const { toast } = useToast();
  const { user } = useAuth();
  const locationRef = useRef<{ latitude: number; longitude: number } | null>(null);
  const socketListenersRef = useRef<Map<string, Function>>(new Map());

  // ── getCurrentLocation ──────────────────────────────────────────────────────
  const getCurrentLocation = useCallback(
    (): Promise<{ latitude: number; longitude: number }> => {
      return new Promise((resolve, reject) => {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
          reject(new Error('Geolocation not supported'));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            locationRef.current = location;
            resolve(location);
          },
          (error) => {
            logger.log('Geolocation error:', error);
            reject(new Error('Failed to get location'));
          }
        );
      });
    },
    []
  );

  // ── mapOrderData ────────────────────────────────────────────────────────────
  const mapOrderData = useCallback((order: any): Order => ({
    ...order,
    distance:
      parseFloat(order.distance?.kilometers) > 0
        ? `${order.distance.kilometers} km`
        : `${order.distance?.meters ?? 0} m`,
    location: order.delivery_address || order.delivery_text || 'Resort pickup',
    estimatedReadyAt: order.estimated_ready_at ?? null,
    time: `${order.time_remaining ?? 0} min`,
  }), []);

  // ── loadOrders ──────────────────────────────────────────────────────────────
  // ✅ NOW RETURNS ORDERS!
  const loadOrders = useCallback(
    async (latitude?: number, longitude?: number): Promise<Order[]> => {
      try {
        dispatch({ type: 'SET_IS_LOADING_ORDERS', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        let finalLatitude = latitude;
        let finalLongitude = longitude;

      

        logger.log('📦 [loadOrders] Fetching orders with coords:', { finalLatitude, finalLongitude });

        const ordersRes = await getAvailableOrders(finalLatitude, finalLongitude);

        if (!ordersRes?.success) {
          logger.log('❌ [loadOrders] API failed');
          dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch orders' });
          return []; // ✅ RETURN EMPTY ARRAY
        }

        logger.log('✅ [loadOrders] API Response count:', (ordersRes?.data || []).length);

        const mapped = (ordersRes?.data || []).map(mapOrderData);
        
        logger.log('✅ [loadOrders] Mapped orders count:', mapped.length);

        // ✅ DISPATCH TO STATE
        dispatch({ type: 'SET_ORDERS', payload: mapped });
        dispatch({ type: 'SET_LAST_FETCH_TIME', payload: Date.now() });

        logger.log('✅ [loadOrders] Dispatched to state and returning:', mapped.length);

        return mapped; // ✅ RETURN THE ORDERS!
      } catch (error) {
        logger.log('❌ [loadOrders] Error:', error);
        dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
        return []; // ✅ RETURN EMPTY ARRAY ON ERROR
      } finally {
        dispatch({ type: 'SET_IS_LOADING_ORDERS', payload: false });
      }
    },
    [mapOrderData]
  );

  // ── loadRunnerStatus ────────────────────────────────────────────────────────
  const loadRunnerStatus = useCallback(
    async (onActiveOrder?: (order: any) => void, forceFetch: boolean = false): Promise<RunnerStatus | null> => {
      try {
        dispatch({ type: 'SET_IS_LOADING_STATUS', payload: true });

        // Smart cache check
        if (!forceFetch) {
          const now = Date.now();
          const lastFetch = state.lastStatusFetchTime || 0;

          if (now - lastFetch < statusCacheTimeoutMs && state.runnerStatus) {
            logger.log('📊 Using cached runner status');
            dispatch({ type: 'SET_IS_LOADING_STATUS', payload: false });

            if (state.runnerStatus?.current_assignment && onActiveOrder) {
              onActiveOrder(state.runnerStatus.current_assignment);
            }

            return state.runnerStatus;
          }
        }

        logger.log('📊 Fetching runner status from API');
        const statusRes = await getRunnerStatus();

        if (!statusRes?.success) {
          logger.log('⚠️ Failed to get runner status');
          return { is_on_duty: false };
        }

        const status = statusRes.data;

        // ✅ SAVE STATUS TO GLOBAL STATE
        dispatch({ type: 'SET_RUNNER_STATUS', payload: status });
        dispatch({ type: 'SET_LAST_STATUS_FETCH_TIME', payload: Date.now() });

        logger.log('✅ Runner status saved:', status);

        if (status?.current_assignment) {
          dispatch({ type: 'SET_ACTIVE_ASSIGNMENT', payload: status.current_assignment });
          onActiveOrder?.(status.current_assignment);
          return { ...status, current_assignment: true } as any;
        }

        return { is_on_duty: status?.is_on_duty, current_assignment: false };
      } catch (error) {
        logger.log('❌ loadRunnerStatus error:', error);
        return null;
      } finally {
        dispatch({ type: 'SET_IS_LOADING_STATUS', payload: false });
      }
    },
    [state.runnerStatus, state.lastStatusFetchTime, statusCacheTimeoutMs]
  );

  // ── toggleRunnerDuty ────────────────────────────────────────────────────────
  const toggleRunnerDuty = useCallback(
    async (latitude?: number, longitude?: number) => {
      if (state.isLoadingStatus) return;

      try {
        dispatch({ type: 'SET_IS_LOADING_STATUS', payload: true });

        const res = await setRunnerStatus();

        if (res?.success) {
          const isOnDuty = res.data?.is_on_duty;
        //  toast(res?.message || 'Status updated', 'success', 3000);

          dispatch({ type: 'SET_RUNNER_STATUS', payload: res.data });
          dispatch({ type: 'SET_LAST_STATUS_FETCH_TIME', payload: Date.now() });

          if (!isOnDuty) {
            dispatch({ type: 'RESET_ORDERS' });
          } else {
            if (latitude && longitude) {
              await loadOrders(latitude, longitude);
            } else {
              await loadOrders();
            }
          }
        }
      } catch (error) {
        logger.log('toggleRunnerDuty error:', error);
      } finally {
        dispatch({ type: 'SET_IS_LOADING_STATUS', payload: false });
      }
    },
    [state.isLoadingStatus]
  );

  // ── handleAcceptOrder ───────────────────────────────────────────────────────
  const handleAcceptOrder = useCallback(
    async (orderId: number, onSuccess?: (order: any) => void, onAlreadyAssigned?: () => void) => {
      try {
        dispatch({ type: 'SET_IS_ACCEPTING', payload: true });

        const res = await acceptOrderApi(orderId);

        if (res?.success) {
         // toast(res?.message || 'Order accepted!', 'success', 3000);
          dispatch({ type: 'REMOVE_ORDER', payload: orderId });
          onSuccess?.(res.data);
        } else {
        //  toast(res?.message || 'Order already assigned', 'error', 3000);
          onAlreadyAssigned?.();
        }
      } catch (error) {
        logger.log('acceptOrder error:', error);
        toast((error as Error)?.message || 'Failed to accept order', 'error', 3000);
      } finally {
        dispatch({ type: 'SET_IS_ACCEPTING', payload: false });
      }
    },
    []
  );

  // ── syncOrders ──────────────────────────────────────────────────────────────
  const syncOrders = useCallback(async (latitude?: number, longitude?: number) => {
    const now = Date.now();
    const lastFetch = state.lastFetchTime || 0;

    if (now - lastFetch < cacheTimeoutMs) {
      logger.log('📦 Orders cache still valid, skipping fetch');
      return;
    }

   await loadOrders(latitude,longitude);
  }, [state.lastFetchTime, cacheTimeoutMs, loadOrders]);

  // ── dispatchAction ──────────────────────────────────────────────────────────
  const dispatchAction = useCallback((action: OrdersAction) => {
    dispatch(action);
  }, []);

  // ────────────────────────────────────────────────────────────────────────────
  // 🔥 SOCKET EVENT LISTENERS
  // ────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!socketService.isConnected()) return;

    const handleOrderEvent = (eventName: string) => {
      const handler = async (data: any) => {
        logger.log(`[Orders] Socket event: ${eventName}`, data);

        switch (eventName) {
          case SOCKET_EVENTS.ORDER_ASSIGNED:
            if (data?.order) {
              const mapped = mapOrderData(data.order);
              dispatch({ type: 'ADD_ORDER', payload: mapped });
           //   toast(`New order: ${data.order.delivery_address}`, 'info');
            }
            break;

          case SOCKET_EVENTS.ORDER_READY:
            logger.log('[Orders] Order ready:', data?.orderId);
            break;

          case SOCKET_EVENTS.ORDER_ACCEPTED:
            logger.log('[Orders] Order accepted:', data?.orderId);
            dispatch({ type: 'REMOVE_ORDER', payload: data?.orderId });
            break;

          case SOCKET_EVENTS.ORDER_PICKED_UP:
            if (data?.order_id) {
              dispatch({ type: 'SET_ACTIVE_ASSIGNMENT', payload: data });
            }
            break;

          case SOCKET_EVENTS.ORDER_DELIVERED:
            dispatch({ type: 'REMOVE_ORDER', payload: data?.orderId });
            if (data?.total_delivered !== undefined) {
              dispatch({
                type: 'SET_RUNNER_STATUS',
                payload: {
                  ...state.runnerStatus,
                  total_delivered: data.total_delivered,
                },
              });
            }
            break;

          default:
            break;
        }
      };

      socketListenersRef.current.set(eventName, handler);
      socketService.on(eventName, handler);
    };

    ALL_ORDER_EVENTS.forEach(event => {
      handleOrderEvent(event);
    });

    return () => {
      socketListenersRef.current.forEach((handler, eventName) => {
        socketService.off(eventName, handler as any);
      });
      socketListenersRef.current.clear();
    };
  }, [mapOrderData]);

  useEffect(() => {
    if (!socketService.isConnected()) return;

    const handleRunnerStatusChange = (data: any) => {
      logger.log('[Orders] Runner status changed via socket:', data);

      dispatch({
        type: 'SET_RUNNER_STATUS',
        payload: { ...state.runnerStatus, ...data },
      });
      dispatch({ type: 'SET_LAST_STATUS_FETCH_TIME', payload: Date.now() });

      if (data?.is_on_duty === false) {
        dispatch({ type: 'RESET_ORDERS' });
      } else if (data?.is_on_duty === true) {
        loadOrders();
      }

      if (data?.current_assignment) {
        dispatch({ type: 'SET_ACTIVE_ASSIGNMENT', payload: data.current_assignment });
      }
    };

    socketListenersRef.current.set(SOCKET_EVENTS.RUNNER_STATUS_CHANGED, handleRunnerStatusChange);
    socketService.on(SOCKET_EVENTS.RUNNER_STATUS_CHANGED, handleRunnerStatusChange);

    return () => {
      socketService.off(SOCKET_EVENTS.RUNNER_STATUS_CHANGED, handleRunnerStatusChange);
      socketListenersRef.current.delete(SOCKET_EVENTS.RUNNER_STATUS_CHANGED);
    };
  }, []);

  // ────────────────────────────────────────────────────────────────────────────
  // 🔥 AUTO-REFRESH
  // ────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.id || state.orders.length === 0) return;

    const interval = setInterval(() => {
      syncOrders();
    }, 45000);

    return () => clearInterval(interval);
  }, [user?.id, state.orders.length, syncOrders]);

  const value: OrdersContextType = {
    state,
    loadOrders,
    loadRunnerStatus,
    toggleRunnerDuty,
    handleAcceptOrder,
    syncOrders,
    dispatchAction,
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// CUSTOM HOOK
// ────────────────────────────────────────────────────────────────────────────
export const useOrdersContext = (): OrdersContextType => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrdersContext must be used within OrdersProvider');
  }
  return context;
};