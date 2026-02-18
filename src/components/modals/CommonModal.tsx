import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Colors from "../../utils/colors";
import { ms } from "react-native-size-matters";

interface CommonModalProps {
    visible: boolean;

    title?: string;
    message?: string;

    // Buttons
    primaryText?: string;
    onPrimaryPress?: () => void;

    secondaryText?: string;
    onSecondaryPress?: () => void;

    // Optional custom content
    children?: React.ReactNode;

    // Close on backdrop
    onRequestClose?: () => void;
}

const CommonModal: React.FC<CommonModalProps> = ({
    visible,
    title,
    message,

    primaryText = "Confirm",
    onPrimaryPress,

    secondaryText,
    onSecondaryPress,

    children,
    onRequestClose,
}) => {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onRequestClose}
        >
            <View style={styles.overlay}>
                <View
                    
                    style={styles.container}
                >
                    {title && <Text style={styles.title}>{title}</Text>}
                    {message && <Text style={styles.message}>{message}</Text>}

                    {children}

                    <View style={styles.buttonRow}>
                        {secondaryText && (
                            <TouchableOpacity
                                style={styles.secondaryBtn}
                                onPress={onSecondaryPress}
                            >
                                <Text style={styles.secondaryText}>{secondaryText}</Text>
                            </TouchableOpacity>
                        )}

                        {primaryText && (
                            <TouchableOpacity
                                style={styles.primaryBtn}
                                onPress={onPrimaryPress}
                            >
                                {/* <LinearGradient
                                    colors={["#3B5BFF", "#5A7CFF"]}
                                    style={styles.primaryGradient}
                                > */}
                                    <Text style={styles.primaryText}>{primaryText}</Text>
                                {/* </LinearGradient> */}
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CommonModal;
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        width: ms(300),
        borderRadius: ms(20),
        padding: 24,
        alignItems: "center",
        backgroundColor:Colors.white,
    
    },

    title: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 10,
        textAlign: "center",
        color: "#111",
    },

    message: {
        fontSize: 15,
        textAlign: "center",
        color: "#666",
        marginBottom: 20,
    },

    buttonRow: {
        flexDirection: "row",
        marginTop: 12,
        gap: 12,
    },

    primaryBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        backgroundColor:Colors.red2
    },

    primaryGradient: {
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
    },

    primaryText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
    },

    secondaryBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#DDD",
        alignItems: "center",
    },

    secondaryText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#666",
    },
});
