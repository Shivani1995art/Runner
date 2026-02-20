// import React, {
//   createContext,
//   useState,
//   useEffect,
//   useRef,
//   ReactNode,
// } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { clearToken, setToken } from '../utils/token';
// import { logger } from '../utils/logger';

// export interface User {
//   id?: string | number;
//   display_name?: string;
//   email?: string;
//   [key: string]: any;
// }

// export interface Outlet {
//   id?: string | number;
//   name?: string;
//   image_url?: string;
//   [key: string]: any;
// }

// export interface AuthContextType {
//   isAuthenticated: boolean;
//   logoutRef: React.MutableRefObject<(() => Promise<void>) | null>;
//   isLogin: boolean | null;
//   user: User | null;
//   outlet: Outlet | null;
//   login: (
//     token: string,
//     userData?: User,
//     outletData?: Outlet
//   ) => Promise<void>;
//   logout: () => Promise<void>;
//   setIsLogin: (value: boolean | null) => void;
//   isLoading: boolean;
//   setIsLoading: (loading: boolean) => void;
//   isFirstLogin: boolean;
//   setIsFirstLogin: (first: boolean) => void;
// }

// export const AuthContext = createContext<AuthContextType | undefined>(
//   undefined
// );

// interface Props {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<Props> = ({ children }) => {
//   const [isLogin, setIsLogin] = useState<boolean | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState<User | null>(null);
//   const [outlet, setOutlet] = useState<Outlet | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isFirstLogin, setIsFirstLogin] = useState(false);

//   const logoutRef = useRef<(() => Promise<void>) | null>(null);

//   useEffect(() => {
//     restoreSession();
//   }, []);

//   const restoreSession = async () => {
//     try {
//       const token = await AsyncStorage.getItem('ACCESS_TOKEN');
//       const userData = await AsyncStorage.getItem('USER_DATA');
//       const outletData = await AsyncStorage.getItem('OUTLET_DATA');

//       if (token) {
//         setIsAuthenticated(true);
//         setIsLogin(true);

//         if (userData) setUser(JSON.parse(userData));
//         if (outletData) setOutlet(JSON.parse(outletData));
//       } else {
//         setIsLogin(false);
//       }
//     } catch (e) {
//       setIsLogin(false);
//     }
//   };
// const login = async (token: string, userData?: User, outletData?: Outlet) => {
//     try {
//       logger.log('received token ==>', token);
//         await setToken(token); // Ensure this saves to AsyncStorage internally

//         if (userData) {
//             await AsyncStorage.setItem('USER_DATA', JSON.stringify(userData));
//             setUser(userData);
//         }

//         if (outletData) {
//             await AsyncStorage.setItem('OUTLET_DATA', JSON.stringify(outletData));
//             setOutlet(outletData);
//         }

//         setIsAuthenticated(true);
//         setIsFirstLogin(true);
        
//         // Finalize the login state last
//         setIsLogin(true); 
//     } catch (error) {
//         console.error("Login save error:", error);
//     }
// };
//   // const login = async (
//   //   token: string,
//   //   userData?: User,
//   //   outletData?: Outlet
//   // ) => {
//   //   logger.log('received token ==>', token);

//   //   await setToken(token);

//   //   if (userData) {
//   //     setUser(userData);
//   //     await AsyncStorage.setItem('USER_DATA', JSON.stringify(userData));
//   //   }

//   //   if (outletData) {
//   //     setOutlet(outletData);
//   //     await AsyncStorage.setItem('OUTLET_DATA', JSON.stringify(outletData));
//   //   }
//   //   logger.log('isAuthenticated ==>', isAuthenticated);
//   //   setIsAuthenticated(true);
//   //   setIsFirstLogin(true);
//   //   setIsLogin(true);
//   // };

//   const logout = async () => {
//     logger.log('logout called==>');
//     clearToken()
//     setUser(null);
//     setOutlet(null);
//     setIsLogin(false);
//     setIsAuthenticated(false);
//     setIsFirstLogin(false);

//     await AsyncStorage.multiRemove([
//       'ACCESS_TOKEN',
//       'USER_DATA',
//       'OUTLET_DATA',
//     ]);
//   };

//   logoutRef.current = logout;

//   return (
//     <AuthContext.Provider
//       value={{
//         isAuthenticated,
//         logoutRef,
//         isLogin,
//         user,
//         outlet,
//         login,
//         logout,
//         setIsLogin,
//         isLoading,
//         setIsLoading,
//         isFirstLogin,
//         setIsFirstLogin,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };


import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearFCMToken, clearToken, setToken } from '../utils/token';
import { logger } from '../utils/logger';

export interface User {
 id: number;
  display_name: string;
  email: string;
  phone?: string;
  resort_id?: number;
  location_enabled?: boolean;
  notification_enabled?: boolean;
  image_url?: string | null;
  is_registered?: boolean;
  UserOutlets?: UserOutlet[];
  [key: string]: any;
}

export interface UserOutlet {
  outlet_id: number;
}

export interface Outlet {
  id: number;
  name: string;
  image_url?: string | null;
  [key: string]: any;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  logoutRef: React.MutableRefObject<(() => Promise<void>) | null>;
  isLogin: boolean | null;
  user: User | null;
  outlet: Outlet | null;
  login: (token: string, userData?: User, outletData?: Outlet) => Promise<void>;
  logout: () => Promise<void>;
  setIsLogin: (value: boolean | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isFirstLogin: boolean;
  setIsFirstLogin: (first: boolean) => void;
  // ── Refresh user in context + AsyncStorage from anywhere ─────────────────
  updateUser: (userData: User) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props { children: ReactNode; }

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [isLogin, setIsLogin]               = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser]                     = useState<User | null>(null);
  const [outlet, setOutlet]                 = useState<Outlet | null>(null);
  const [isLoading, setIsLoading]           = useState(false);
  const [isFirstLogin, setIsFirstLogin]     = useState(false);

  const logoutRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => { restoreSession(); }, []);

  const restoreSession = async () => {
    try {
      const token      = await AsyncStorage.getItem('ACCESS_TOKEN');
      const userData   = await AsyncStorage.getItem('USER_DATA');
      const outletData = await AsyncStorage.getItem('OUTLET_DATA');

      if (token) {
        setIsAuthenticated(true);
        setIsLogin(true);
        if (userData)   setUser(JSON.parse(userData));
        if (outletData) setOutlet(JSON.parse(outletData));
      } else {
        setIsLogin(false);
      }
    } catch (e) {
      setIsLogin(false);
    }
  };

  const login = async (token: string, userData?: User, outletData?: Outlet) => {
    try {
      logger.log('received token ==>', token);
      await setToken(token);

      if (userData) {
        await AsyncStorage.setItem('USER_DATA', JSON.stringify(userData));
        setUser(userData);
      }
      if (outletData) {
        await AsyncStorage.setItem('OUTLET_DATA', JSON.stringify(outletData));
        setOutlet(outletData);
      }

      setIsAuthenticated(true);
      setIsFirstLogin(true);
      setIsLogin(true);
    } catch (error) {
      console.error('Login save error:', error);
    }
  };

  // ── updateUser ──────────────────────────────────────────────────────────────
  // Call this after fetchProfile / saveProfile to keep the global user state
  // and AsyncStorage in sync. Any screen reading user from AuthContext will
  // re-render automatically with the fresh data (display_name, image_url etc.)
  // ─────────────────────────────────────────────────────────────────────────────
  const updateUser = async (userData: User) => {
    try {
      // Merge with existing user so we never lose fields the profile API
      // might not return (e.g. outlet-specific fields)
      const merged = { ...user, ...userData };
      setUser(merged);
      await AsyncStorage.setItem('USER_DATA', JSON.stringify(merged));
    } catch (e) {
      logger.log('updateUser error', e);
    }
  };

  const logout = async () => {
    logger.log('logout called==>');
    clearToken();
    clearFCMToken();
    setUser(null);
    setOutlet(null);
    setIsLogin(false);
    setIsAuthenticated(false);
    setIsFirstLogin(false);
    await AsyncStorage.multiRemove(['ACCESS_TOKEN', 'USER_DATA', 'OUTLET_DATA']);
  };

  logoutRef.current = logout;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        logoutRef,
        isLogin,
        user,
        outlet,
        login,
        logout,
        setIsLogin,
        isLoading,
        setIsLoading,
        isFirstLogin,
        setIsFirstLogin,
        updateUser,   // ← new
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};