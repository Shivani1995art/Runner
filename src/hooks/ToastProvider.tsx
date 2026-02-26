// // ToastProvider.tsx
// import React, { createContext, useContext, useState, ReactNode } from 'react';
// import {
//   View,
//   Text,
//   Animated,
//   StyleSheet,
//   TouchableOpacity,
//   Dimensions,
// } from 'react-native';
// import Colors from '../utils/colors';
// import { Typography } from '../utils/typography';
// import { setToastHandler } from '../utils/toastHandler';

// type ToastType = 'success' | 'error' | 'warning' | 'info';

// type Toast = {
//   id: string;
//   message: string;
//   type: ToastType;
//   duration?: number;  
//   onPress?: () => void;
// };

// type ToastContextType = {
//   toast: (message: string, type?: ToastType, duration?: number, onPress?: () => void) => void;
// };

// const ToastContext = createContext<ToastContextType | undefined>(undefined);

// // === Move ToastItem OUTSIDE ToastProvider ===
// const ToastItem = ({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) => {
//   const translateY = new Animated.Value(-100);
//   const opacity = new Animated.Value(0);

//   React.useEffect(() => {
//     Animated.parallel([
//       Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
//       Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
//     ]).start();
//   }, []);

// const handlePress = () => {
//     if (toast.onPress) {
//       toast.onPress();
//     }
//     handleDismiss(); // Close toast when clicked
//   };

//   const handleDismiss = () => {
//     Animated.parallel([
//       Animated.timing(translateY, { toValue: -100, duration: 300, useNativeDriver: true }),
//       Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
//     ]).start(() => onDismiss());
//   };

//   const backgroundColor = {
//     success: '#10b981',
//     error: '#ef4444',
//     warning: '#f59e0b',
//     info: '#3b82f6',
//   }[toast.type];

//   return (
//     <Animated.View
//       style={[
//         styles.toast,
//         { backgroundColor, transform: [{ translateY }], opacity },
//       ]}
//     >

// <TouchableOpacity 
//         style={styles.clickableArea} 
//         onPress={handlePress}
//         activeOpacity={0.7}
//       >
//         <Text style={styles.message}>{toast.message}</Text>
//       </TouchableOpacity>

     
//       <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
//         <Text style={styles.closeText}>✕</Text>
//       </TouchableOpacity>
//     </Animated.View>
//   );
// };

// // === ToastProvider ===
// export const ToastProvider = ({ children }: { children: ReactNode }) => {
//   const [toasts, setToasts] = useState<Toast[]>([]);

//   const toast = (message: string, type: ToastType = 'info', duration = 4000 , onPress?: () => void) => {
//     const id = Math.random().toString(36).substr(2, 9);
//     const newToast: Toast = { id, message, type, duration , onPress };

//     setToasts((prev) => [...prev, newToast]);

//     if (duration > 0) {
//       setTimeout(() => removeToast(id), duration);
//     }
//   };
//  // 🔴 THIS FIXES YOUR ISSUE
//   React.useEffect(() => {
//     setToastHandler(toast);
//   }, []);
//   const removeToast = (id: string) => {
//     setToasts((prev) => prev.filter((t) => t.id !== id));
//   };

//   return (
//     <ToastContext.Provider value={{ toast }}>
//       {children}
//       <View style={styles.container} pointerEvents="box-none">
//         {toasts.map((t) => (
//           <ToastItem key={t.id} toast={t} onDismiss={() => removeToast(t.id)} />
//         ))}
//       </View>
//     </ToastContext.Provider>
//   );
// };

// export const useToast = () => {
//   const context = useContext(ToastContext);
//   if (!context) throw new Error('useToast must be used within ToastProvider');
//   return context;
// };

// // === Styles ===
// const { width } = Dimensions.get('window');

// const styles = StyleSheet.create({
//   container: {
//     position: 'absolute',
//     top: 50,
//     left: 20,
//     right: 20,
//     zIndex: 1000,
//   },
//   toast: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 12,
//     marginBottom: 10,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     shadowColor: Colors.black,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 8,
//   },
//   message: {
//     color: Colors.white,
//     fontSize: 16,
//    fontFamily:Typography.Regular.fontFamily,
//     flex: 1,
//   },
//   clickableArea:{
// flex: 1,
//   paddingRight: 10,
//   },
//   closeButton: {
//     marginLeft: 12,
//     padding: 4,
//   },
//   closeText: {
//   color: Colors.white,
//     fontSize: 20,
//     fontFamily:Typography.Bold.fontFamily,
//   },
// });
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Bell } from 'lucide-react-native';
import Colors from '../utils/colors';
import { Typography } from '../utils/typography';
import { setToastHandler } from '../utils/toastHandler';

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'alert';

type Toast = {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onPress?: () => void;
};

type ToastContextType = {
  toast: (
    message: string,
    type?: ToastType,
    duration?: number,
    onPress?: () => void
  ) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

///////////////////////////////////////////////////////////
////////////////////// TOAST ITEM /////////////////////////
///////////////////////////////////////////////////////////

const ToastItem = ({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: () => void;
}) => {
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const isAlert = toast.type === 'alert';

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -120,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => onDismiss());
  };

  const handlePress = () => {
    toast.onPress?.();
    handleDismiss();
  };

  const backgroundColor = isAlert
    ? '#111111'
    : {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: Colors.green2,
      }[toast.type];

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor,
          transform: [{ translateY }],
          opacity,
          borderRadius: isAlert ? 20 : 12,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        activeOpacity={0.85}
        onPress={handlePress}
      >
        {isAlert && (
          <View style={styles.iconContainer}>
            <Bell color={Colors.green2} size={22} />
          </View>
        )}

        <Text style={styles.message}>{toast.message}</Text>
      </TouchableOpacity>

      {!isAlert && (
        <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

///////////////////////////////////////////////////////////
////////////////////// PROVIDER ///////////////////////////
///////////////////////////////////////////////////////////

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (
    message: string,
    type: ToastType = 'info',
    duration: number = 4000,
    onPress?: () => void
  ) => {
    const id = Math.random().toString(36).substr(2, 9);

    const newToast: Toast = {
      id,
      message,
      type,
      duration,
      onPress,
    };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  };

  useEffect(() => {
    setToastHandler(toast);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      <View style={styles.container} pointerEvents="box-none">
        {toasts.map((t) => (
          <ToastItem
            key={t.id}
            toast={t}
            onDismiss={() => removeToast(t.id)}
          />
        ))}
      </View>
    </ToastContext.Provider>
  );
};

///////////////////////////////////////////////////////////
////////////////////// HOOK ///////////////////////////////
///////////////////////////////////////////////////////////

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

///////////////////////////////////////////////////////////
////////////////////// STYLES /////////////////////////////
///////////////////////////////////////////////////////////

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 9999,
  },

  toast: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconContainer: {
    marginRight: 10,
  },

  message: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: Typography.Regular.fontFamily,
    flex: 1,
  },

  closeButton: {
    marginLeft: 12,
    padding: 4,
  },

  closeText: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: Typography.Bold.fontFamily,
  },
});