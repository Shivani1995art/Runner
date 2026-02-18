import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Modal,
  Platform,
} from 'react-native';
import Colors from '../../utils/colors'; 

const GlobalLoader = ({ visible = true }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      statusBarTranslucent
      animationType="none"
    >
      <Animated.View style={[styles.overlay, { opacity }]}>
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color={Colors.white} />
        </View>
      </Animated.View>
    </Modal>
  );
};

export default GlobalLoader;
const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.45)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loaderBox: {
      width: 80,
      height: 80,
      borderRadius: 16,
      backgroundColor: Colors.black,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 10, // Android shadow
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
    },
  });
  