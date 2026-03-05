import { useEffect, useRef } from 'react';
import { socketService } from '../services/Socket/SocketService';
import { ALL_ORDER_EVENTS, OUTLET_EVENTS, RunnerSTATUS_EVENTS } from '../services/Socket/SocketEvents';

interface UseSocketListenerOptions {
  events: readonly string[] | string[];
  onEvent: (eventName: string, data: any) => void;
  logLabel?: string;
}

const useSocketListener = ({ events, onEvent, logLabel = 'Socket' }: UseSocketListenerOptions) => {
  // Use a ref for the callback to prevent effect re-runs if the parent 
  // function isn't memoized with useCallback
  const callbackRef = useRef(onEvent);
  callbackRef.current = onEvent;

  useEffect(() => {
    const activeHandlers: Array<{ event: string; handler: (data: any) => void }> = [];

    events.forEach((event) => {
      const handler = (data: any) => {
        console.log(`[${logLabel}] ${event}:`, data);
        callbackRef.current(event, data);
      };

      socketService.on(event, handler);
      activeHandlers.push({ event, handler });
    });

    return () => {
      activeHandlers.forEach(({ event, handler }) => {
        socketService.off(event, handler);
      });
    };
  }, [events]); 
};


/**
 * Listen for Order updates (Accepted, Ready, Assigned, etc.)
 */
export const useOrderSocket = (onOrderEvent: (event: string, data: any) => void) => {
  useSocketListener({
    events: ALL_ORDER_EVENTS,
    onEvent: onOrderEvent,
    logLabel: 'OrderSocket',
  });
};

/**
 * Listen for Outlet state changes (Opened, Closed, Updated)
 */
export const useOutletSocket = (onOutletEvent: (event: string, data: any) => void) => {
  useSocketListener({
    events: OUTLET_EVENTS,
    onEvent: onOutletEvent,
    logLabel: 'OutletSocket',
  });
};

/**
 * Listen for Runner specific status changes
 */
export const useRunnerSocket = (onRunnerEvent: (event: string, data: any) => void) => {
  useSocketListener({
    events: RunnerSTATUS_EVENTS,
    onEvent: onRunnerEvent,
    logLabel: 'RunnerSocket',
  });
};