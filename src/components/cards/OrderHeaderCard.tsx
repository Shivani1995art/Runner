import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { FileText, MapPin, Map } from "lucide-react-native"; // Assuming this for the receipt icon
import Colors from "../../utils/colors";
import { ms, s, vs, fontSize } from "../../utils/responsive";
import { Typography } from "../../utils/typography";
import Billsvg from '../../assets/svg/Billsvg'
import InfoRow from "../Row/InfoRow";
export default function OrderHeaderCard({ image, title, subtitle, price, onCancel, style ,location,distance}) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <View style={[styles.imageContainer]}>
          <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
        </View>

   

          <View style={styles.infoContainer}>
          <Text style={styles.title}>{title}</Text>
            <InfoRow
              Icon={<MapPin size={16} color={Colors.borderColor1} />}
              title="Location"
              subtitle={location || "Dream Tree Blvd, Lake Buena"}
            />

            <InfoRow
              Icon={<Map size={16} color={Colors.borderColor1} />}
              title="Distance"
              subtitle={distance || "800 M"}
            />
          </View>

        </View>
      </View>

  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: s(12),
    borderRadius: ms(16),
    marginBottom: vs(16),

   
    marginHorizontal: ms(10),

  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  imageContainer: {
    width: ms(100),
    height: ms(100),
    borderRadius: ms(20),
    backgroundColor: "#F7F7F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: s(12),
  },
  image: {
    width: ms(80),
    height: ms(80),
    borderRadius: ms(12),
    // marginRight: s(12),
    // alignSelf:"center"
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    height: ms(80),
  },
  title: {
    fontSize: fontSize(20),
    fontFamily: Typography.SemiBold.fontFamily,
    fontWeight: "600",
    color: Colors.black,
  },
  subtitle: {
    fontSize: fontSize(14),
    color: "#28293D",
    marginTop: vs(2),
    fontFamily: Typography.Regular.fontFamily,
    fontWeight: "400",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "auto", // Pushes this row to bottom
  },
  price: {
    fontSize: fontSize(14),
    fontWeight: "500",
    color: "#0D7200",
    fontFamily: Typography.Medium.fontFamily,
  },
  cancelBtn: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    marginHorizontal: s(8),
  },
  cancelBtnText: {
    color: "white",
    fontSize: fontSize(12),
    fontWeight: "500",
    fontFamily: Typography.Medium.fontFamily,
  },
  iconBtn: {
    padding: s(6),
    backgroundColor: Colors.borderColor,
    borderRadius: ms(18),
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
});