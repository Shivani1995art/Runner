import React, { useEffect, useRef } from "react";
import { Modal, View, StyleSheet, Text, Animated } from "react-native";
import { fontSize, ms } from "../../utils/responsive";
import LottieView from "lottie-react-native";
import resort from '../../assets/Animation/resort.json'

const LoaderModal = ({ visible }) => {
//   const fadeAnim = useRef(new Animated.Value(0)).current;
 const animationRef = useRef(null);

//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
//         Animated.timing(fadeAnim, { toValue: 0.3, duration: 700, useNativeDriver: true }),
//       ])
//     ).start();
//   }, []);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.loaderView}>
          {/* <Image
            source={require("../../assets/gif/dummy.gif")}
            style={styles.image}
            resizeMode="contain"
          /> */}

          <LottieView
            ref={animationRef}
            source={resort}
            autoPlay
            loop
            style={styles.lottie}
          />

          <Text style={[styles.loadingText]}>
            Loading...
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default LoaderModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(50, 203, 202, 0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderView: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 25,
    paddingHorizontal: 35,
    alignItems: "center",
    borderRadius: ms(25),
    borderTopLeftRadius: ms(100),
    borderTopRightRadius: ms(100),
  },
  lottie: {
    width: ms(120),
    height: ms(120),
    marginBottom: 8,
  },
  loadingText: {
    color: "#32CBCA",
    fontSize: fontSize(16),
    marginTop: 5,
    fontWeight: "600",
  },
});
