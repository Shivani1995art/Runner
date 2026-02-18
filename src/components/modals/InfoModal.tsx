import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Infosvg from "../../assets/svg/Infosvg";
import Infomodalsvg from '../../assets/svg/Infomodalsvg'
interface Props {
  visible: boolean;
  title: string;
  message: string;
  buttonText?: string;
  onPress: () => void;
}

const InfoModal: React.FC<Props> = ({
  visible,
  title,
  message,
  buttonText = "Confirm",
  onPress
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Infomodalsvg/>

          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.msg}>{message}</Text>

            <TouchableOpacity onPress={onPress}>
              <Text style={styles.btn}>{buttonText}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default InfoModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    width: 330,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },
  msg: {
    textAlign: "center",
    fontSize: 15,
    color: "#666",
    width: "85%",
    marginBottom: 20,
  },
  btn: {
    fontSize: 17,
    fontWeight: "600",
    color: "#3B5BFF",
  },
});
