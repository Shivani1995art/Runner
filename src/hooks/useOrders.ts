// import { useContext, useState } from 'react';
// import { getAvailableOrders, getRunnerStatus, setRunnerStatus,acceptOrder as acceptOrderApi } from '../services/Orders/order.api';
// import { logger } from '../utils/logger';
// import { LoaderContext } from '../context/LoaderContext';
// import { useToast } from './ToastProvider';

// export const useOrders = () => {
//   const [orders, setOrders] = useState<any[]>([]);
//  const { show, hide } = useContext(LoaderContext);
//    const { toast } = useToast();
//   const [activeAssignment, setActiveAssignment] = useState<any>(null);
//   const [isLoadingOrders, setIsLoadingOrders] = useState(false);
//   const [isLoadingStatus, setIsLoadingStatus] = useState(false);
//   const [isAccepting, setIsAccepting] = useState(false);
//   const [runnerStatus, setRunnerStatusState] = useState<any>(null);
//   const loadOrders = async (
//     latitude: number,
//     longitude: number,
//     onActiveOrder?: Function
//   ) => {
//     try {
//         // Phase 1 — load status first, reflect on screen immediately
//     setIsLoadingStatus(true);

//       setIsLoadingOrders(true);

//       // 1️⃣ Check runner status
//       let status = await getRunnerStatus();
//       logger.log('Status:', status);
      

//       setRunnerStatusState(status);
//   setIsLoadingStatus(false);  
//       // If runner is OFF duty → stop here (no orders)
//       if (!status?.is_on_duty) {
//         return;
//       }

//       // If active assignment exists → stop and return
//       if (status?.current_assignment) {
//         setActiveAssignment(status.current_assignment);
//         onActiveOrder?.(status.current_assignment);
//         return;
//       }

    
//       // Fetch available orders
//       //show()
//       const res = await getAvailableOrders(latitude, longitude);

//  logger.log('Available orders response:', res);
//       if (res?.success === false) {
//   logger.log('Active order message:', res?.message || 'Unknown error');
//   return;
// }

// const mapped = (res?.data || []).map((order: any) => ({
//   ...order,
//   distance: `${order.distance?.kilometers ?? '0.0'} km`,
//   time: `${order.time_remaining ?? 0} min`,
//   location:
//     order.delivery_address ||
//     order.delivery_text ||
//     'Resort pickup',
// }));
// setOrders(mapped);


//     } catch (error) {
//       logger.log('Orders load error', error);
//     } finally {
//       //hide()
//       setIsLoadingOrders(false);
//       setIsLoadingStatus(false);
//     }
//   };
// const toggleRunnerDuty = async (
//   latitude?: number,
//   longitude?: number,
//   onActiveOrder?: Function
// ) => {
//   try {
//     setIsLoadingStatus(true);
//     const res = await setRunnerStatus();

//     if (res?.success) {
//       toast(res?.message || 'Status updated successfully', 'success', 3000);

//       setRunnerStatusState(prev => ({
//         ...prev,
//         is_on_duty: res?.is_on_duty
//       }));

//       if (!res?.is_on_duty) {
//         setOrders([]);
//       } else {
//         // Going ON duty → loadOrders handles the assignment check internally
//         if (latitude && longitude) {
//           await loadOrders(latitude, longitude, onActiveOrder);
//         }
//       }
//     }
//   } catch (e) {
//     logger.log('toggleRunnerDuty error', e);
//     toast((e as Error)?.message || 'Failed to update status', 'error', 3000);
//   } finally {
//     setIsLoadingStatus(false);
//   }
// };

// const handleAcceptOrder = async (
//   orderId: number,
//   onSuccess?: (order: any) => void
// ) => {
//   try {
//     setIsAccepting(true);
//     const res = await acceptOrderApi(orderId);
//     logger.log('Accept order res:', res);

//     if (res?.success) {
//       toast(res?.message || 'Order accepted!', 'success', 3000);
//       onSuccess?.(res?.data ?? res);
//     } else {
//       toast(res?.message || 'Failed to accept order', 'error', 3000);
//     }
//   } catch (e) {
//     logger.log('acceptOrder error', e);
//     toast((e as Error)?.message || 'Failed to accept order', 'error', 3000);
//   } finally {
//     setIsAccepting(false);
//   }
// };


//   return {
//     orders,
//     setOrders,
//     activeAssignment,
//     setActiveAssignment,
//     isLoadingOrders,
//     isLoadingStatus,
//     runnerStatus,
//     loadOrders,
//     toggleRunnerDuty,
//     handleAcceptOrder,
//     isAccepting,
//   };
// };

// import { useContext, useState } from 'react';
// import { getAvailableOrders, getRunnerStatus, setRunnerStatus, acceptOrder as acceptOrderApi } from '../services/Orders/order.api';
// import { logger } from '../utils/logger';
// import { LoaderContext } from '../context/LoaderContext';
// import { useToast } from './ToastProvider';

// export const useOrders = () => {
//   const [orders, setOrders] = useState<any[]>([]);
//   const { show, hide } = useContext(LoaderContext);
//   const { toast } = useToast();
//   const [activeAssignment, setActiveAssignment] = useState<any>(null);
//   const [isLoadingOrders, setIsLoadingOrders] = useState(false);
//   const [isLoadingStatus, setIsLoadingStatus] = useState(false);
//   const [isAccepting, setIsAccepting] = useState(false);
//   const [runnerStatus, setRunnerStatusState] = useState<any>(null);

//   const loadOrders = async (
//     latitude: number,
//     longitude: number,
//     onActiveOrder?: Function
//   ) => {
//     try {
//       setIsLoadingStatus(true);
//       setIsLoadingOrders(true);

//       let status = await getRunnerStatus();
//       logger.log('Status:', status);
//       setRunnerStatusState(status);
//       setIsLoadingStatus(false);

//       if (!status?.is_on_duty) return;

//       if (status?.current_assignment) {
//         setActiveAssignment(status.current_assignment);
//         onActiveOrder?.(status.current_assignment);
//         return;
//       }

//       const res = await getAvailableOrders(latitude, longitude);
//       logger.log('Available orders response:', res);

//       if (res?.success === false) {
//         logger.log('Active order message:', res?.message || 'Unknown error');
//         return;
//       }

//       const mapped = (res?.data || []).map((order: any) => ({
//         ...order,
//       distance: parseFloat(order.distance?.kilometers) > 0 
//   ? `${order.distance.kilometers} km` 
//   : `${order.distance?.meters ?? 0} m`,
//         time: `${order.time_remaining ?? 0} min`,
//         location: order.delivery_address || order.delivery_text || 'Resort pickup',
//       }));
//       setOrders(mapped);

//     } catch (error) {
//       logger.log('Orders load error', error);
//     } finally {
//       setIsLoadingOrders(false);
//       setIsLoadingStatus(false);
//     }
//   };

//   const toggleRunnerDuty = async (
//     latitude?: number,
//     longitude?: number,
//     onActiveOrder?: Function
//   ) => {
//      if (isLoadingStatus) return; // Prevent double-taps
//     try {
     
//       setIsLoadingStatus(true);
//       const res = await setRunnerStatus();

//       if (res?.success) {
//         toast(res?.message || 'Status updated successfully', 'success', 3000);
//         setRunnerStatusState((prev: any) => ({ ...prev, is_on_duty: res?.is_on_duty }));

//         if (res.is_on_duty && latitude && longitude) {
//           await loadOrders(latitude, longitude);
//         }
//       }
//     } catch (e) {
//       logger.log('toggleRunnerDuty error', e);
//       toast((e as Error)?.message || 'Failed to update status', 'error', 3000);
//     } finally {
//       setIsLoadingStatus(false);
//     }
//   };

//   // ── handleAcceptOrder ───────────────────────────────────────────────────────
//   // onSuccess         → happy path, order accepted
//   // onAlreadyAssigned → server returned { message: 'Order already assigned' }
//   //                     caller handles: close modal + toast + refresh list
//   // ───────────────────────────────────────────────────────────────────────────
//   const handleAcceptOrder = async (
//     orderId: number,
//     onSuccess?: (order: any) => void,
//     onAlreadyAssigned?: () => void,
//   ) => {
//     try {
//       show();
//       setIsAccepting(true);
//       const res = await acceptOrderApi(orderId);
//       logger.log('Accept order res:', res);

//       // REPLACE the if/else block inside handleAcceptOrder with this:
// if (res?.success) {
//   toast(res?.message || 'Order accepted!', 'success', 3000);
//   onSuccess?.(res?.data ?? res);
// } else {
//   logger.log('Accept order failed:', res);
//   // Case-insensitive match — API message variations won't break this
//   onAlreadyAssigned?.();
//   toast(res?.message || 'Order already assigned', 'error', 3000);
// } 
//     } catch (e) {
//       logger.log('acceptOrder error', e);
//       toast((e as Error)?.message || 'Failed to accept order', 'error', 3000);
//     } finally {
//       hide();
//       setIsAccepting(false);
//     }
//   };

//   return {
//     orders,
//     setOrders,
//     activeAssignment,
//     setActiveAssignment,
//     isLoadingOrders,
//     isLoadingStatus,
//     runnerStatus,
//     loadOrders,
//     toggleRunnerDuty,
//     handleAcceptOrder,
//     isAccepting,
//   };
// };

import { useContext, useState } from 'react';
import { getAvailableOrders, getRunnerStatus, setRunnerStatus, acceptOrder as acceptOrderApi } from '../services/Orders/order.api';
import { logger } from '../utils/logger';
import { LoaderContext } from '../context/LoaderContext';
import { useToast } from './ToastProvider';

export const useOrders = () => {
  const [orders, setOrders]                     = useState<any[]>([]);
  const { show, hide }                          = useContext(LoaderContext);
  const { toast }                               = useToast();
  const [activeAssignment, setActiveAssignment] = useState<any>(null);
  const [isLoadingOrders, setIsLoadingOrders]   = useState(false);
  const [isLoadingStatus, setIsLoadingStatus]   = useState(false);
  const [isAccepting, setIsAccepting]           = useState(false);
  const [runnerStatus, setRunnerStatusState]    = useState<any>(null);

  // ── loadOrders ──────────────────────────────────────────────────────────────
  // res.data: { is_on_duty, current_assignment, ... }
  // ─────────────────────────────────────────────────────────────────────────────
const loadRunnerStatus = async (onActiveOrder?: Function) => {
  try {
    setIsLoadingStatus(true);

    const statusRes = await getRunnerStatus();
    logger.log('getRunnerStatus res:', statusRes);

    const status = statusRes?.success ? statusRes.data : null;
    setRunnerStatusState(status);

    if (!status?.is_on_duty) return { isOnDuty: false };

    if (status?.current_assignment) {
      setActiveAssignment(status.current_assignment);
      onActiveOrder?.(status.current_assignment);
      return { hasActiveAssignment: true };
    }

    return { isOnDuty: true, hasActiveAssignment: false };

  } catch (error) {
    logger.log('loadRunnerStatus error:', error);
    return null;
  } finally {
    setIsLoadingStatus(false);
  }
};

const loadOrders = async (latitude: number, longitude: number) => {
  try {
    setIsLoadingOrders(true);

    const ordersRes = await getAvailableOrders(latitude, longitude);
    logger.log('getAvailableOrders res:', ordersRes);

    if (!ordersRes?.success) return;

    const mapped = (ordersRes?.data || []).map((order: any) => ({
      ...order,
      distance:
        parseFloat(order.distance?.kilometers) > 0
          ? `${order.distance.kilometers} km`
          : `${order.distance?.meters ?? 0} m`,
      time: `${order.time_remaining ?? 0} min`,
      location: order.delivery_address || order.delivery_text || 'Resort pickup',
    }));

    setOrders(mapped);

  } catch (error) {
    logger.log('loadOrders error:', error);
  } finally {
    setIsLoadingOrders(false);
  }
};


  // const loadOrders = async (
  //   latitude: number,
  //   longitude: number,
  //   onActiveOrder?: Function
  // ) => {
  //   try {
  //     setIsLoadingStatus(true);
  //     setIsLoadingOrders(true);

  //     const statusRes = await getRunnerStatus();
  //     logger.log('getRunnerStatus res:', statusRes);

  //     // Extract from data
  //     const status = statusRes?.success ? statusRes.data : null;
  //     setRunnerStatusState(status);
  //     setIsLoadingStatus(false);

  //     if (!status?.is_on_duty) return;

  //     if (status?.current_assignment) {
  //       setActiveAssignment(status.current_assignment);
  //       onActiveOrder?.(status.current_assignment);
  //       return;
  //     }

  //     const ordersRes = await getAvailableOrders(latitude, longitude);
  //     logger.log('getAvailableOrders res:', ordersRes);

  //     if (!ordersRes?.success) {
  //       logger.log('getAvailableOrders failed:', ordersRes?.message);
  //       return;
  //     }

  //     const mapped = (ordersRes?.data || []).map((order: any) => ({
  //       ...order,
  //       distance: parseFloat(order.distance?.kilometers) > 0
  //         ? `${order.distance.kilometers} km`
  //         : `${order.distance?.meters ?? 0} m`,
  //       time:     `${order.time_remaining ?? 0} min`,
  //       location: order.delivery_address || order.delivery_text || 'Resort pickup',
  //     }));
  //     setOrders(mapped);

  //   } catch (error) {
  //     logger.log('loadOrders error:', error);
  //   } finally {
  //     setIsLoadingOrders(false);
  //     setIsLoadingStatus(false);
  //   }
  // };

  // ── toggleRunnerDuty ────────────────────────────────────────────────────────
  // res: { success, message, data: { is_on_duty } }
  // ─────────────────────────────────────────────────────────────────────────────
  const toggleRunnerDuty = async (
    latitude?: number,
    longitude?: number,
    onActiveOrder?: Function
  ) => {
    if (isLoadingStatus) return; // prevent double-taps
    try {
      setIsLoadingStatus(true);
      const res = await setRunnerStatus();
      logger.log('setRunnerStatus res:', res);

      if (res?.success) {
        const isOnDuty = res.data?.is_on_duty;
        toast(res?.message || 'Status updated', 'success', 3000);

        setRunnerStatusState((prev: any) => ({ ...prev, is_on_duty: isOnDuty }));

        if (!isOnDuty) {
          setOrders([]);
        } else if (latitude && longitude) {
          await loadOrders(latitude, longitude, onActiveOrder);
        }
      }
    } catch (e) {
      logger.log('toggleRunnerDuty error:', e);
      toast((e as Error)?.message || 'Failed to update status', 'error', 3000);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  // ── handleAcceptOrder ───────────────────────────────────────────────────────
  // res: { success, message, data: { order } }
  // ─────────────────────────────────────────────────────────────────────────────
  const handleAcceptOrder = async (
    orderId: number,
    onSuccess?: (order: any) => void,
    onAlreadyAssigned?: () => void,
  ) => {
    try {
      show();
      setIsAccepting(true); 
      const res = await acceptOrderApi(orderId);
      logger.log('acceptOrder res:', res);

      if (res?.success) {
        toast(res?.message || 'Order accepted!', 'success', 3000);
        onSuccess?.(res);
      } else {
        onAlreadyAssigned?.();
        toast(res?.message || 'Order already assigned', 'error', 3000);
      }
    } catch (e) {
      logger.log('acceptOrder error:', e);
      toast((e as Error)?.message || 'Failed to accept order', 'error', 3000);
    } finally {
      hide();
      setIsAccepting(false);
    }
  };

  return {
    orders,
    setOrders,
    activeAssignment,
    setActiveAssignment,
    isLoadingOrders,
    isLoadingStatus,
    runnerStatus,
    loadOrders,
    loadRunnerStatus,
    toggleRunnerDuty,
    handleAcceptOrder,
    isAccepting,
  };
};