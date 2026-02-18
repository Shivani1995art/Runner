import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { fontSize, ms, vs, wp } from "../../utils/responsive";
import { Typography } from "../../utils/typography";
import BeachChairsvg from '../../assets/svg/BeachChairsvg'

const DeliveryProgressButton = ({ totalTime = 25, remainingTime,onPress }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [textShift, setTextShift] = useState(false); // track if button reached text

  const BAR_WIDTH = wp(90);
  const BUTTON_WIDTH = ms(90);
  const MAX_X = BAR_WIDTH - BUTTON_WIDTH - 60; // 60 = distance from right edge to text start

  useEffect(() => {
    let progress = remainingTime / totalTime;
    progress = Math.max(0, Math.min(1, progress));
    const newX = MAX_X * (1 - progress);

    Animated.timing(translateX, {
      toValue: newX,
      duration: 600,
      useNativeDriver: false,
    }).start(() => {
      // Check if button reached text
      if (newX + BUTTON_WIDTH >= BAR_WIDTH - ms(50)) {
        setTextShift(true);
      } else {
        setTextShift(false);
      }
    });
  }, [remainingTime]);

  return (
    <View style={styles.wrapper}>
      {/* Gradient background */}
      <LinearGradient
        colors={['#D0EDE3', '#06C270']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBar}
      />

      {/* Moving Button */}
      <Animated.View style={[styles.btnContainer, { transform: [{ translateX }] }]}>
        <TouchableOpacity onPress={onPress} style={styles.viewBtn}>
          <Text style={styles.viewText}>View</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Chair fixed at right edge */}
      <View style={styles.chairContainer}>
        <BeachChairsvg />
      </View>

      {/* Delivery Text */}
      <View style={[
        styles.textContainer,
        textShift ? { right: BUTTON_WIDTH + 10 } : { right: ms(50) } // shift left when button reaches
      ]}>
        <Text style={styles.deliveryTimeTextStyle}>Deliver in {remainingTime} Min</Text>
      </View>
    </View>
  );
};

export default DeliveryProgressButton;

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: vs(20),
    width: wp(90),
    height: vs(50),
    justifyContent: "center",
    alignSelf: "center",
  },
  gradientBar: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },
  btnContainer: {
    position: "absolute",
    width: ms(90),
    height: vs(44),
  },
  viewBtn: {
    width: "100%",
    height: "100%",
    backgroundColor: "#00C282",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "white",
  },
  viewText: {
    color: "#fff",
    fontWeight: "bold",
  },
  chairContainer: {
    position: "absolute",
    right: ms(10),
    height: vs(44),
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    position: "absolute",
    height: vs(44),
    justifyContent: "center",
  },
  deliveryTimeTextStyle: {
    fontFamily: Typography.Regular.fontFamily,
    fontSize: fontSize(14),
    color: "#000",
  },
});
