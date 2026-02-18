import React from "react";
import { Modal, View, Text, TouchableOpacity, Image, StyleSheet, TouchableWithoutFeedback } from "react-native";
import SuccesModalsvg from "../../assets/svg/SuccesModalsvg";
import { fontSize, ms, vs } from "../../utils/responsive";

interface Props {
    visible: boolean;
    title: string;
    message: string;
    buttonText?: string;
    icon?: any;               // Can be image OR component
    onPress: () => void;
    onClose?: () => void; 
}

const SuccessModal: React.FC<Props> = ({
    visible,
    title,
    message,
    buttonText = "Continue",
    icon,
    onPress,
    onClose
}) => {
    const renderIcon = () => {
        if (!icon) return null;
        if (typeof icon === "function") {
            const IconComponent = icon;
            return <IconComponent width={ms(100)} height={ms(100)} />;
        }
        return <Image source={icon} style={styles.icon} />;
    };
    return (
        <Modal transparent visible={visible} animationType="fade">
          <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay}>
                <View style={styles.container}>
                    <SuccesModalsvg />

                    <View style={styles.content}>
                        {renderIcon()}
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.msg}>{message}</Text>

                        <TouchableOpacity onPress={onPress} style={{ marginTop: vs(20) }}>
                            <Text style={styles.btn}>{buttonText}</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
    );
};

export default SuccessModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        alignItems: "center",
        justifyContent: "center",
    },
    container: {
        width: 330,
        height: 270,
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        bottom: 20,
        position: "absolute",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    icon: {
        width: 65,
        height: 65,
        marginBottom: 8,
        resizeMode: "contain",
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        paddingTop: vs(50)
    },
    msg: {
        textAlign: "center",
        fontSize: 15,
        width: "85%",
        color: "#666",
        paddingTop: vs(10)
    },
    btn: {
        fontSize: fontSize(17),
        color: "#3B5BFF",
        fontWeight: "600",

    },
});
