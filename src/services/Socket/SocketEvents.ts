export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'connect_error',

  // Room management
  JOIN_OUTLET_RUNNERS: 'joinResortRunners',
  LEAVE_OUTLET_RUNNERS: 'leaveResortRunners',
  JOIN_RUNNER: 'joinRunner',
  LEAVE_RUNNER: 'leaveRunner',

  // Order events
  ORDER_ACCEPTED: 'order:accepted',
  ORDER_READY: 'order:ready',
  ORDER_ASSIGNED: 'order:assigned',
  ORDER_PICKED_UP: 'order:picked_up',
  ORDER_DELIVERED: 'order:delivered',
 

  // Outlet events
  OUTLET_UPDATED: 'outlet:updated',
  OUTLET_CLOSED: 'outlet:closed',
  OUTLET_OPENED: 'outlet:opened',

  // Runner events
  RUNNER_STATUS_CHANGED: 'runner:status',
} as const;

/**
 * Events that trigger a state change or data refetch
 */

export const RunnerSTATUS_EVENTS = [
  SOCKET_EVENTS.RUNNER_STATUS_CHANGED,
]
export const ALL_ORDER_EVENTS = [
  SOCKET_EVENTS.ORDER_ACCEPTED,
  SOCKET_EVENTS.ORDER_READY,
  SOCKET_EVENTS.ORDER_ASSIGNED,
  SOCKET_EVENTS.ORDER_PICKED_UP,
  SOCKET_EVENTS.ORDER_DELIVERED,

] as const;

export const OUTLET_EVENTS = [
  SOCKET_EVENTS.OUTLET_UPDATED,
  SOCKET_EVENTS.OUTLET_CLOSED,
  SOCKET_EVENTS.OUTLET_OPENED,
] as const;