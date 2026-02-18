import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Phone, MessageCircle } from "lucide-react-native";
import Colors from "../../utils/colors";
import { ms, s, vs, fontSize } from "../../utils/responsive";
import { Typography } from "../../utils/typography";
import Messagesvg from "../../assets/svg/Messagesvg";
 interface CustomerInfoCardProps {
    orderId: string;
    customerId: string;
    name: string;
    room: string;
    image: string;
    onCall: () => void;
    onMessage: () => void;
    style?: object;
 }
const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({
  orderId,
  customerId,
  name,
  room,
  image,
  onCall,
  onMessage,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Customer Info</Text>
        <Text style={styles.orderId}>#{orderId}</Text>
      </View>

      {/* Dotted Divider */}
      <View style={styles.divider} />

      {/* Content */}
      <View style={styles.contentRow}>
        
        {/* Avatar */}
        <Image source={{ uri: image }} style={styles.avatar} />

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.customerId}>#{customerId}</Text>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.room}>{room}</Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconBtn} onPress={onCall}>
            <Phone size={18} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn} onPress={onMessage}>
            {/* <MessageCircle size={18} color="#fff" /> */}
            <Messagesvg/>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

export default CustomerInfoCard;
const styles = StyleSheet.create({
    container: {
      backgroundColor: Colors.customerInfoCardBg,
      borderRadius:ms(14),
      padding: s(10),
     // marginHorizontal: ms(10),
      marginBottom: vs(16),
      borderWidth:1,
      borderColor:Colors.black
    },
  
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  
    headerText: {
      fontSize: fontSize(16),
      color: Colors.black,
      ...Typography.SemiBold,
    },
  
    orderId: {
      fontSize: fontSize(16),
      color: Colors.black,
      ...Typography.SemiBold,
    },
  
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: "#C7D9FF",
      borderStyle: "dashed",
      marginVertical: vs(12),
    },
  
    contentRow: {
      flexDirection: "row",
      alignItems: "center",
    },
  
    avatar: {
      width: ms(52),
      height: ms(52),
      borderRadius: ms(26),
      marginRight: s(12),
    },
  
    info: {
      flex: 1,
    },
  
    customerId: {
      fontSize: fontSize(13),
      color: Colors.black,
      ...Typography.Medium,
    },
  
    name: {
      fontSize: fontSize(16),
      color: Colors.black,
      marginTop: vs(2),
      ...Typography.Medium,
    },
  
    room: {
      fontSize: fontSize(14),
      color: Colors.borderColor1,
      marginTop: vs(2),
      ...Typography.Regular,
    },
  
    actions: {
      flexDirection: "row",
    },
  
    iconBtn: {
      width: ms(42),
      height: ms(42),
      borderRadius: ms(21),
      backgroundColor: "#3B63FE",
      justifyContent: "center",
      alignItems: "center",
      marginLeft: s(10),
    },
  });
  