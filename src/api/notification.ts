import { logger } from "../utils/logger";
import { apiClient } from "./axios";
import { ENDPOINTS } from "./endpoints";

    //  {
    //     "userId" : 25,
    //     "message" : "Picked You order up , reaching soon",
    //             "order_id" : 412 
    //         }

export const runnerSendChatNotification = async (payload: {
  userId: number;
  order_id: number;
  message: string;
}) => {
  try {
    logger.log('runnerSendChatNotification payload:', payload);

    const response = await apiClient.post(
      ENDPOINTS.RUNNER_CHAT.SEND_MESSAGE,
      payload
    );

    logger.log('runnerSendChatNotification response:', response.data);

    return response.data;
  } catch (error) {
    logger.log('runnerSendChatNotification error:', error);
    throw error;
  }
};