import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { ms, vs, fontSize, wp } from '../../utils/responsive';
import Colors from '../../utils/colors';
import { Typography } from '../../utils/typography';

const HistoryItem = ({ item, index }: { item: any; index: number }) => {
  const menuItem = item?.MenuItem; // ✅ FIXED

  const imageUrl = Array.isArray(menuItem?.image_url)
    ? menuItem.image_url[0]
    : menuItem?.image_url;

  const warmShades = [
    '#fff4dc',
    '#fdeecf',
    '#fce5bd',
    '#f7d8a4',
    '#f2c88a',
    '#ecb770',
  ];
  const coolShades = [
    '#f1f4fd',
    '#e6ebf9',
    '#d8def4',
    '#c6cff0',
    '#b4c0eb',
    '#a2b1e6',
  ];

  const bgColor =
    index % 2 === 0
      ? warmShades[index % warmShades.length]
      : coolShades[index % coolShades.length];

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>

      {/* Quantity */}
      <View style={styles.quantityBadge}>
        <Text style={styles.quantityText}>{item.quantity} x</Text>
      </View>

      {/* Image */}
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Info Section */}
      <View style={styles.info}>
        <Text style={styles.name}>
          {menuItem?.name}
        </Text>

        {/* 🔥 Add Instructions (since history data has it) */}
        {item?.item_instructions && (
          <Text style={styles.optionText}>
            📝 {item.item_instructions}
          </Text>
        )}

      </View>

    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginHorizontal: ms(16),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: ms(12),
    padding: ms(10),
    marginBottom: vs(10),
    gap: ms(10),
  },
  quantityBadge: {
    minWidth: ms(36),
    alignItems: 'center',
  },
  quantityText: {
    fontSize: fontSize(12),
    fontFamily: Typography.Bold.fontFamily,
    color: Colors.black,
  },
  image: {
    width: ms(50),
    height: ms(50),
    borderRadius: ms(25),
    backgroundColor: '#eee',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: fontSize(14),
    fontFamily: Typography.SemiBold.fontFamily,
    color: Colors.black1,
  },
  instructions: {
    marginTop: vs(3),
    fontSize: fontSize(11),
    fontFamily: Typography.Regular.fontFamily,
    color: Colors.borderColor1,
  },
  price: {
    marginTop: vs(4),
    fontSize: fontSize(13),
    fontFamily: Typography.Bold.fontFamily,
    color: Colors.black1,
  },
});

export default HistoryItem;