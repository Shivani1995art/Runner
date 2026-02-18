import React from "react";
import { Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { hp } from "../../utils/responsive";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.25;

export default function SwipeCard({ children, onSwipeLeft, onSwipeRight }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
      rotation.value = translateX.value / 25;
    })
    .onEnd(() => {
      if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withSpring(width);
        runOnJS(onSwipeRight)();
        return;
      }

      if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-width);
        runOnJS(onSwipeLeft)();
        return;
      }

      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      rotation.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          {
            position: "absolute",
            width: "100%",
           

          },
          animatedStyle,
        ]}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
}
