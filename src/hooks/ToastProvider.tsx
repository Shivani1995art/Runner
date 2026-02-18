// ToastProvider.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Colors from '../utils/colors';
import { Typography } from '../utils/typography';
import { setToastHandler } from '../utils/toastHandler';

type ToastType = 'success' | 'error' | 'warning' | 'info';

type Toast = {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
};

type ToastContextType = {
  toast: (message: string, type?: ToastType, duration?: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// === Move ToastItem OUTSIDE ToastProvider ===
const ToastItem = ({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) => {
  const translateY = new Animated.Value(-100);
  const opacity = new Animated.Value(0);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: -100, duration: 300, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => onDismiss());
  };

  const backgroundColor = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  }[toast.type];

  return (
    <Animated.View
      style={[
        styles.toast,
        { backgroundColor, transform: [{ translateY }], opacity },
      ]}
    >
      <Text style={styles.message}>{toast.message}</Text>
      <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// === ToastProvider ===
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (message: string, type: ToastType = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  };
 // 🔴 THIS FIXES YOUR ISSUE
  React.useEffect(() => {
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
          <ToastItem key={t.id} toast={t} onDismiss={() => removeToast(t.id)} />
        ))}
      </View>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

// === Styles ===
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  toast: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  message: {
    color: Colors.white,
    fontSize: 16,
   fontFamily:Typography.Regular.fontFamily,
    flex: 1,
  },
  closeButton: {
    marginLeft: 12,
    padding: 4,
  },
  closeText: {
  color: Colors.white,
    fontSize: 20,
    fontFamily:Typography.Bold.fontFamily,
  },
});