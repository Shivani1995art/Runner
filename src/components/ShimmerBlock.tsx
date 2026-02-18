import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
} from "react-native-reanimated";
import { logger } from "../utils/logger";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function ShimmerBlock({
  width = "100%",
  height = 16,
  radius = 8,
}) {
  const translateX = useSharedValue(-SCREEN_WIDTH);

  useEffect(() => {
    //logger.log("Shimmer mounted");
    translateX.value = withRepeat(
      withTiming(SCREEN_WIDTH, { duration: 1200 }),
      -1,
      false
    );
    return () => {
        //logger.log("Shimmer unmounted");
      };
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[styles.container, { width, height, borderRadius: radius }]}>
      <Animated.View style={[StyleSheet.absoluteFill, style]}>
        <LinearGradient
          colors={["#E0E0E0", "#F5F5F5", "#E0E0E0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: SCREEN_WIDTH, height: "100%" }}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E0E0E0",
    overflow: "hidden",
  },
});
