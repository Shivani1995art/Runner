import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { ms, s, vs, fontSize } from "../../utils/responsive";
import { Typography } from "../../utils/typography";
import Colors from "../../utils/colors";

export default function OrderItemRow({ quantity, title, description, image, isLastItem,style }) {
  return (
    <View style={[styles.container,style]}>
      <Text style={styles.qtyText}>{quantity} x</Text>
      <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center", 
    paddingVertical: vs(12),
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4EB",
    marginHorizontal: ms(40),
  },

  qtyText: {
    fontSize: fontSize(16),
    color: Colors.black,
    marginRight: s(12),
    minWidth: ms(25),
    fontFamily: Typography.Regular.fontFamily,
    fontWeight: "400",
  },
  image: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(8),
    marginRight: s(12),
    backgroundColor: "#eee",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: fontSize(16),
    fontWeight: "500",
    color: "#28293D",
    fontFamily: Typography.Medium.fontFamily,
    marginBottom: vs(2),
  },
  description: {
    fontSize: fontSize(16),
    color: "#8F90A6", 
    lineHeight: fontSize(16),
    fontFamily: Typography.Regular.fontFamily,
    fontWeight: "400",
  },
});