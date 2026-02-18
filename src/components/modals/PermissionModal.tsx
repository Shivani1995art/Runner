import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import type { ReactNode } from "react";
import GradientContainer from "../Gradient/GradientContainer";
import { ms, vs } from "../../utils/responsive";
import Colors from "../../utils/colors";
import CustomButton from "../Buttons/CustomButton";
import { BlurView } from "@react-native-community/blur";

const { height } = Dimensions.get("window");

interface PermissionModalProps {
  visible: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
  imageComponent?: ReactNode;
  buttonText?: string;
  onPressButton: () => void;
}

const PermissionModal = ({
  visible,
  onClose,
  title = "Permission Required",
  description = "We need permission to continue",
  imageComponent,
  buttonText = "Allow",
  onPressButton,
}: PermissionModalProps) => {
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>

        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="xlight"
          blurAmount={5}
          reducedTransparencyFallbackColor="rgba(174, 24, 24, 0.5)"
        />

        <Animated.View
          style={[
            styles.containerWrapper,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.container}>
            <GradientContainer style={styles.gradient}>
              <View style={styles.content}>
                {imageComponent && (
                  <View style={styles.imageWrapper}>{imageComponent}</View>
                )}

                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>

                <CustomButton
                  style={[styles.button,]}
                  title={buttonText}
                  onPress={onPressButton}
                />
              </View>
            </GradientContainer>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default PermissionModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  containerWrapper: {
    width: "100%",
    alignItems: "center",

  },
  container: {
    width: "100%",
    borderTopLeftRadius: ms(35),
    borderTopRightRadius: ms(35),
    overflow: "hidden",
  },
  gradient: {
    borderTopLeftRadius: ms(25),
    borderTopRightRadius: ms(25),

  },
  content: {
    alignItems: "center",
  },
  imageWrapper: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.blue,
    borderRadius: 10,
    marginBottom: vs(40),
    width: "80%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
