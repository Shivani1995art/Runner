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
  
  maxHeightPercentage = 0.85,     // ← increased flexibility
  minHeightPercentage = 0.35,     // ← minimum sensible height
}) => {
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,                    // slide from bottom → top:0
        duration: 300,
        useNativeDriver: true,         // better perf (translateY)
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').height,
        duration: 280,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      statusBarTranslucent
      presentationStyle="overFullScreen"
    >
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[
    StyleSheet.absoluteFill, 
    { backgroundColor: 'rgba(255, 255, 255, 0.7)' } // 70% opacity white
  ]}>
          {/* <BlurView style={StyleSheet.absoluteFill} blurType="dark" blurAmount={10} /> */}
        </View>
      </TouchableWithoutFeedback>

      {/* Sliding content */}
      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [{ translateY: slideAnim }],
            // maxHeight: Dimensions.get('window').height * maxHeightPercentage,
            // minHeight: Dimensions.get('window').height * minHeightPercentage,
            height: Dimensions.get('window').height * maxHeightPercentage

          },
        ]}
      >
     <GradientContainer
  borderRadius={ms(40)}
  style={[styles.gradientBox, { flex: 1 }]}   // ensure flex:1
>
  <View style={{ flex: 1, }}>
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
