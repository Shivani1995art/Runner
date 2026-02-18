// import { useState, useCallback, useContext } from 'react';
// import { getRunnerStatus, getOrderById, delivered } from '../services/Orders/order.api';
// import { logger } from '../utils/logger';
// import { LoaderContext } from '../context/LoaderContext';
// import { useToast } from './ToastProvider';

// export const useOrderDetail = () => {
//   const [order, setOrder] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState(false);
//  const { show, hide } = useContext(LoaderContext);
//    const { toast } = useToast();
//   const fetchOrderDetail = useCallback(async (orderId?: number) => {
//     try {
//       show();
//       setIsLoading(true);
// console.log('useOrderDetail orderId:', orderId);
//       let resolvedOrderId = orderId;

//       // No orderId from route → get it from status API
//       if (!resolvedOrderId) {
//         const statusRes = await getRunnerStatus();
//         logger.log('useOrderDetail status:', statusRes);
//         resolvedOrderId = statusRes?.current_assignment?.order?.id;
//       }

//       if (!resolvedOrderId) {
//         logger.log('No order id found');
//         return;
//       }

//       // // Fetch full order with OrderLines
//       const orderRes = await getOrderById(resolvedOrderId);
//       logger.log('useOrderDetail ORDER_BY_ID:', orderRes);

//       if (orderRes) {
//         logger.log('useOrderDetail ORDER_BY_ID:', orderRes.id);
//         setOrder(orderRes);
//       }

//     } catch (e) {
//       logger.log('useOrderDetail error', e);
//     } finally {
//       hide();
//       setIsLoading(false);
//     }
//   }, [hide, show]);

//   const deliverOrder = useCallback(async (orderId: number) => {
//     try {
//       show();
//       setIsLoading(true);
//       const res = await delivered(orderId);
//       await fetchOrderDetail(orderId);
//       logger.log('deliverOrder res:', res);
//       if(res.success){
//         // TODO: Navigate to success screen or show success message
//          toast(res?.message || 'Order delivered successfully', 'success', 3000);
//         return res;
//       }else{
//         toast(res?.message || 'Failed to deliver order', 'error', 3000);
//         return res;
//       }
      
//     } catch (e) {
//       logger.log('deliverOrder error', e);
//       throw e;
//     } finally {
//       hide();
//       setIsLoading(false);
//     }
//   }, [fetchOrderDetail, hide, show]);

//   return {
//     order,
//     setOrder,
//     isLoading,
//     fetchOrderDetail,
//     deliverOrder,
//   };
// };

import { useState, useCallback, useContext } from 'react';
import { getRunnerStatus, getOrderById, delivered } from '../services/Orders/order.api';
import { logger } from '../utils/logger';
import { LoaderContext } from '../context/LoaderContext';
import { useToast } from './ToastProvider';

export const useOrderDetail = () => {
  const [order, setOrder]       = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { show, hide }          = useContext(LoaderContext);
  const { toast }               = useToast();

  // ── fetchOrderDetail ────────────────────────────────────────────────────────
  // getRunnerStatus res: { success, data: { current_assignment: { order: { id } } } }
  // getOrderById    res: { success, data: { order } }
  // ─────────────────────────────────────────────────────────────────────────────
  const fetchOrderDetail = useCallback(async (orderId?: number) => {
    try {
      show();
      setIsLoading(true);
      logger.log('fetchOrderDetail orderId:', orderId);

      let resolvedOrderId = orderId;

      // No orderId passed → resolve from runner status
      if (!resolvedOrderId) {
        const statusRes = await getRunnerStatus();
        logger.log('fetchOrderDetail statusRes:', statusRes);

        if (statusRes?.success) {
          resolvedOrderId = statusRes.data?.current_assignment?.order?.id;
        }
      }

      if (!resolvedOrderId) {
        logger.log('fetchOrderDetail: no order id found');
        return;
      }

      const orderRes = await getOrderById(resolvedOrderId);
      logger.log('fetchOrderDetail orderRes:', orderRes);

      if (orderRes?.success) {
        setOrder(orderRes.data);
      }

    } catch (e) {
      logger.log('fetchOrderDetail error:', e);
    } finally {
      hide();
      setIsLoading(false);
    }
  }, [show, hide]);

  // ── deliverOrder ────────────────────────────────────────────────────────────
  // res: { success, message, data: { order } }
  // ─────────────────────────────────────────────────────────────────────────────
  const deliverOrder = useCallback(async (orderId: number) => {
    try {
      show();
      setIsLoading(true);

      const res = await delivered(orderId);
      logger.log('deliverOrder res:', res);

      if (res?.success) {
        await fetchOrderDetail(orderId); // refresh order state
        toast(res?.message || 'Order delivered successfully', 'success', 3000);
        return res;
      } else {
        toast(res?.message || 'Failed to deliver order', 'error', 3000);
      }
    } catch (e) {
      logger.log('deliverOrder error:', e);
      toast((e as Error)?.message || 'Failed to deliver order', 'error', 3000);
      throw e;
    } finally {
      hide();
      setIsLoading(false);
    }
  }, [fetchOrderDetail, show, hide]);

  return {
    order,
    setOrder,
    isLoading,
    fetchOrderDetail,
    deliverOrder,
  };
};