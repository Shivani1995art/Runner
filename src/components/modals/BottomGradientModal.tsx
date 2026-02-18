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
import { hp, ms } from "../../utils/responsive";


const { height } = Dimensions.get("window");

const BottomGradientModal = ({
    visible,
    onClose,
    children,
    heightPercentage = 0.45,
}) => {
    const slideAnim = useRef(new Animated.Value(height)).current;
    // Animate modal when visible changes
    useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: height * heightPercentage,
                duration: 300,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: height,
                duration: 250,
                useNativeDriver: false,
            }).start();
        }
    }, [visible]);

    return (
        <Modal visible={visible} animationType="none" transparent={true} >
            {/* Dim Background */}
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={[StyleSheet.absoluteFill]}
                    pointerEvents="box-none"
                >
                    <BlurView
                        style={StyleSheet.absoluteFill}
                        blurType="dark"
                        blurAmount={10}
                    />
                </View>
            </TouchableWithoutFeedback>

            {/* Bottom Sliding Modal */}
            <Animated.View style={[styles.modalContainer, { top: slideAnim, height: hp(60) }]}>
                <GradientContainer
                    borderRadius={ms(40)}
                    style={styles.gradientBox}
                >
                    {children}
                </GradientContainer>
            </Animated.View>
        </Modal>
    );
};

export default BottomGradientModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(180, 152, 152, 0.4)",
    },
    modalContainer: {
        position: "absolute",
        width: "100%",
        justifyContent: "center",
        zIndex: 999,


    },
    gradientBox: {
        flex: 1,
        width: "100%",
        height: "100%",


    },
});
