import { ENDPOINTS } from "../../api/endpoints";
import { apiClient } from "../../api/axios";
import { logger } from "../../utils/logger";

// GET runner status
export const getRunnerStatus = async () => {
  const { data } = await apiClient.get(
    ENDPOINTS.RUNNER_STATUS.GET_STATUS
  );
  return data;
};

// SET runner duty status (ON / OFF)
export const setRunnerStatus = async () => {
  const { data } = await apiClient.post(
    ENDPOINTS.RUNNER_STATUS.SET_STATUS
  );
  return data;
};
export const getAvailableOrders = async (
  latitude: number,
  longitude: number
) => {
  const { data } = await apiClient.get(
    `${ENDPOINTS.RUNNER_ORDERS.AVAILABLE}?lat=${latitude}&lng=${longitude}`
  );
  return data;
};
export const acceptOrder = async (orderId: number) => {
  const { data } = await apiClient.post(
    ENDPOINTS.RUNNER_ORDERS.ACCEPT(orderId)
  );
  return data;
};
export const getOrderById = async (orderId: number) => {
  logger.log('getOrderById orderId:', orderId);
  const { data } = await apiClient.get(ENDPOINTS.RUNNER_ORDERS.ORDER_BY_ID(orderId));
  logger.log('getOrderById data:', data);
  return data;
};

export const pickedOrder = async (orderId: number) => {
  logger.log('pickedOrder orderId:', orderId);
  const { data } = await apiClient.post(
    ENDPOINTS.RUNNER_ORDERS.PICKED(orderId)
  );
  logger.log('pickedOrder data:', data);
  return data;
};


export const delivered = async (orderId: number) => {
  logger.log('delivered orderId:', orderId);
  const { data } = await apiClient.post(
    ENDPOINTS.RUNNER_ORDERS.DELIVERED(orderId)
  );
  logger.log('delivered data:', data);
  return data;
};
