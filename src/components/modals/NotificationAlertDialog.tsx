// components/modals/NotificationAlertDialog.tsx
import React, { useEffect, useRef } from 'react';
import {
  Modal, View, Text, StyleSheet,
  Animated, Dimensions, TouchableOpacity,
} from 'react-native';
import { ms, vs, fontSize } from '../../utils/responsive';
import { Typography } from '../../utils/typography';
import Colors from '../../utils/colors';
import { BlurView } from '@react-native-community/blur';

const { width } = Dimensions.get('window');

interface NotificationAlertDialogProps {
  visible: boolean;
  title?: string;
  body?: string;
  onOk: () => void;
  onCancel: () => void;
}

const NotificationAlertDialog = ({
  visible,
  title,
  body,
  onOk,
  onCancel,
  }: NotificationAlertDialogProps) => {
  const scaleAnim   = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          bounciness: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.overlay}>

        {/* Blur background */}
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={4}
          reducedTransparencyFallbackColor="rgba(0,0,0,0.5)"
        />

        {/* Dialog box */}
        <Animated.View
          style={[
            styles.dialog,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🔔</Text>
          </View>

          {/* Title */}
          <Text style={styles.title} numberOfLines={2}>
            {title ?? 'New Notification'}
          </Text>

          {/* Body */}
          <Text style={styles.body} numberOfLines={4}>
            {body ?? ''}
          </Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* OK Button */}
          <TouchableOpacity
            style={styles.okButton}
            onPress={onOk}
            activeOpacity={0.7}
          >
            <Text style={styles.okText}>OK</Text>
          </TouchableOpacity>
        </Animated.View>

      </View>
    </Modal>
  );
};

export default NotificationAlertDialog;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    width: width * 0.82,
    backgroundColor: '#fff',
    borderRadius: ms(20),
    alignItems: 'center',
    paddingTop: vs(24),
    paddingHorizontal: ms(20),
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  iconContainer: {
    width: ms(56),
    height: ms(56),
    borderRadius: ms(28),
    backgroundColor: Colors.orange + '20', // 20 = 12% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vs(12),
  },
  icon: {
    fontSize: fontSize(28),
  },
  title: {
    fontSize: fontSize(17),
    fontFamily: Typography.Bold.fontFamily,
    fontWeight: '700',
    color: Colors.black1,
    textAlign: 'center',
    marginBottom: vs(8),
  },
  body: {
    fontSize: fontSize(14),
    fontFamily: Typography.Regular.fontFamily,
    color: Colors.borderColor1,
    textAlign: 'center',
    lineHeight: vs(20),
    marginBottom: vs(20),
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  okButton: {
    width: '100%',
    paddingVertical: vs(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  okText: {
    fontSize: fontSize(16),
    fontFamily: Typography.SemiBold.fontFamily,
    fontWeight: '600',
    color: Colors.blue,
  },
});