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

  // ── loadRunnerStatus ────────────────────────────────────────────────────────
  // Fetches runner status and returns useful flags
  // res.data: { is_on_duty, current_assignment, total_delivered, ... }
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
        return { isOnDuty: true, hasActiveAssignment: true };
      }

      return { isOnDuty: true, hasActiveAssignment: false };

    } catch (error) {
      logger.log('loadRunnerStatus error:', error);
      return null;
    } finally {
      setIsLoadingStatus(false);
    }
  };

  // ── loadOrders ──────────────────────────────────────────────────────────────
  // Fetches available orders based on runner location
  // res.data: [ { id, distance, time_remaining, delivery_address, ... } ]
  // ─────────────────────────────────────────────────────────────────────────────
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
        location: order.delivery_address || order.delivery_text || 'Resort pickup',
        estimatedReadyAt: order.estimated_ready_at ?? null, // ← use this instead of time
        time: `${order.time_remaining ?? 0} min`,           // ← keep as fallback
      }));

      setOrders(mapped);

    } catch (error) {
      logger.log('loadOrders error:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  // ── toggleRunnerDuty ────────────────────────────────────────────────────────
  // Toggles runner on/off duty status
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
          await loadOrders(latitude, longitude);
        }
      }
    } catch (e) {
      logger.log('toggleRunnerDuty error:', e);
     // toast((e as Error)?.message || 'Failed to update status', 'error', 3000);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  // ── handleAcceptOrder ───────────────────────────────────────────────────────
  // Accepts an order and navigates or refreshes based on result
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
        onSuccess?.(res.data);
      } else {
        onAlreadyAssigned?.();
        toast(res?.message || 'Order already assigned', 'error', 3000);
      }
    } catch (e) {
      logger.log('acceptOrder error:', e);
      //toast((e as Error)?.message || 'Failed to accept order', 'error', 3000);
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
    setRunnerStatus: setRunnerStatusState, // ← expose setter
    loadOrders,
    loadRunnerStatus,
    toggleRunnerDuty,
    handleAcceptOrder,
    isAccepting,
  };
};