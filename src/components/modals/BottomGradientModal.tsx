import React, { useRef, useEffect } from "react";
import {
    Modal,
    View,
    TouchableWithoutFeedback,
    Animated,
    StyleSheet,
    Dimensions
} from "react-native";
import GradientContainer from "../Gradient/GradientContainer";
import { BlurView } from "@react-native-community/blur";
import { hp, ms, vs } from "../../utils/responsive";
import { logger } from "../../utils/logger";


const { height } = Dimensions.get("window");

const BottomGradientModal = ({
  visible,
  onClose,
  children,
  maxHeightPercentage = 0.75,
  minHeightPercentage = 0.35,
}) => {
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {   // ← spring feels more natural
        toValue: 0,
        useNativeDriver: true,
        bounciness: 4,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 280,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // ← recalculate height when maxHeightPercentage changes
  const modalHeight = height * maxHeightPercentage;

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      statusBarTranslucent
      presentationStyle="overFullScreen"
    >
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[
          StyleSheet.absoluteFill,
          { backgroundColor: 'rgba(255, 255, 255, 0.7)' }
        ]} />
      </TouchableWithoutFeedback>

      {/* Sliding content — height is now dynamic */}
      <Animated.View
        style={[
          styles.modalContainer,
          {
             transform: [{ translateY: slideAnim }],
      maxHeight: height * maxHeightPercentage,  // ← maxHeight not height
      height: height * maxHeightPercentage,
            // transform: [{ translateY: slideAnim }],
            // height: modalHeight,  // ← uses dynamic height
          },
        ]}
      >
        <GradientContainer
          borderRadius={ms(40)}
         style={{ flex: 1 }}    
          //  style={[styles.gradientBox, { flex: 1 }]}
        >
          <View style={{ flex: 1 }}>
            {children}
          </View>
        </GradientContainer>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'transparent', // important
    borderTopLeftRadius: ms(40),
    borderTopRightRadius: ms(40),
    overflow: 'hidden',
  },
  gradientBox: {
    flex: 1,
  },
});

export default BottomGradientModal;
