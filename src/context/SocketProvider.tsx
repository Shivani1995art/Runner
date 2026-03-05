import React, { createContext, useContext, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { AuthContext } from './AuthContext';
import { socketService } from '../services/Socket/SocketService';
import { getToken } from '../utils/token';
import { logger } from '../utils/logger';

const SocketContext = createContext({});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const appState = useRef(AppState.currentState);

  //console.log("isAuthenticated in socket==>", isAuthenticated);
  //console.log("user in socket==>", user);

  // 🔥 MAIN SOCKET CONNECT EFFECT
  useEffect(() => {
    const connectSocket = async () => {
      if (!isAuthenticated || !user?.id
) {
        socketService.disconnect();
        return;
      }

      const token = await getToken();

      console.log("token in socket==>", token);

      if (token) {
        socketService.connect(token, String(user.UserOutlets[0].outlet_id),String(user.id));
      }
    };

    connectSocket();

    return () => socketService.disconnect();
  }, [isAuthenticated, user?.UserOutlets?.outlet_id]);

  // 🔥 APP STATE HANDLING
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (next: AppStateStatus) => {
      const comingToForeground =
        appState.current.match(/inactive|background/) && next === 'active';

      if (comingToForeground && user?.id && !socketService.isConnected()) {
        const token = await getToken();

        if (token) {
          socketService.connect(token, String(user.UserOutlets[0].outlet_id),String(user.id));
        }
      }

      appState.current = next;
    });

    return () => subscription.remove();
  }, [user?.id]);

  return (
    <SocketContext.Provider value={{}}>
      {children}
    </SocketContext.Provider>
  );
};