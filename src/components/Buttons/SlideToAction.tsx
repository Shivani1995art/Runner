import React, { useRef } from "react";
import { View, Text, StyleSheet, Animated, PanResponder } from "react-native";
import LottieView from "lottie-react-native";
import { fontSize, ms } from "../../utils/responsive";
import Colors from "../../utils/colors";

const SLIDE_WIDTH = 320;
const SLIDER_SIZE = 90;

const SlideToAction = ({ onComplete, leftAnim, rightAnim, text = "Slide to Continue" }) => {
    const translateX = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10,
            onPanResponderMove: (_, gesture) => {
                if (gesture.dx >= 0 && gesture.dx <= SLIDE_WIDTH - SLIDER_SIZE - 20) {
                    translateX.setValue(gesture.dx);
                }
            },
            onPanResponderRelease: (_, gesture) => {
                const threshold = (SLIDE_WIDTH - SLIDER_SIZE) * 0.7;

                if (gesture.dx > threshold) {
                    Animated.timing(translateX, {
                        toValue: SLIDE_WIDTH - SLIDER_SIZE - 20,
                        duration: 150,
                        useNativeDriver: true,
                    }).start(() => {
                        onComplete && onComplete();
                        setTimeout(() => translateX.setValue(0), 300);
                    });
                } else {
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    return (
        <View style={styles.container}>
            <View style={styles.slideWrapper}>
                
                {/* LEFT Pills slider */}
                <Animated.View
                    style={[
                        styles.slider,
                        { transform: [{ translateX }] },
                    ]}
                    {...panResponder.panHandlers}
                >
                    <LottieView
                        source={leftAnim}
                        autoPlay
                        loop
                        style={{ width: 45, height: 45 }}
                    />
                </Animated.View>

                {/* CENTER TEXT */}
                <View style={styles.centerBox}>
                    <Text style={styles.centerText}>{text}</Text>
                </View>

                {/* RIGHT Lottie Icon */}
                <View style={styles.sideIcon}>
                    <LottieView
                        source={rightAnim}
                        autoPlay
                        loop
                        style={{ width: 40, height: 40 }}
                    />
                </View>

            </View>
        </View>
    );
};

export default SlideToAction;


const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    slideWrapper: {
        width: "90%",
        height: 70,
        backgroundColor: "#D0EDE3",
        borderRadius: 50,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        overflow: "hidden",
    },

    /* LEFT SLIDING BUTTON */
    slider: {
        width: ms(90),
        height: ms(55),
        backgroundColor: "#06C270",
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        left: 10,
        elevation: 4,
        borderWidth: 2,
        borderColor: Colors.white,
        zIndex: 99,    
    },

    /* CENTER TEXT */
    centerBox: {
        flex: 1,
        alignItems: "center",
    },
    centerText: {
        fontSize: fontSize(10),
        fontWeight: "600",
        color: "#1B5E4A",
        marginLeft:ms(90),
        textAlign:"center"
    },

    /* RIGHT SIDE ANIMATION */
    sideIcon: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
});
