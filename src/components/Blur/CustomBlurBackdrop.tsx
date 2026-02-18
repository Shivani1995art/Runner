import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { BlurView } from "@react-native-community/blur";
import { StyleSheet } from "react-native";

const CustomBlurBackdrop = ({ animatedIndex }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedIndex.value,
      [0, 1],   // 0 = collapsed (10%), 1 = expanded (65%)
      [0, 1]
    );

    return { opacity };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, animatedStyle]}
    >
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="dark"
        blurAmount={10}
      />
    </Animated.View>
  );
};

export default CustomBlurBackdrop;
