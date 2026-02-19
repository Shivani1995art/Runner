import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { ms, vs, fontSize, wp } from '../../utils/responsive';
import Colors from '../../utils/colors';
import { Typography } from '../../utils/typography';

const RenderItem = ({ item, index }: { item: any; index: number }) => {
  const menuItem = item?.menu_item;
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

        {/* 🔥 Add-Ons Section */}
        {item.options?.length > 0 && (
          <View style={styles.optionsContainer}>
            {item.options.map((opt: any) => (
              <Text key={opt.id} style={styles.optionText}>
                + {opt.name}
              </Text>
            ))}
          </View>
        )}
      </View>

    </View>
  );
};

export default RenderItem;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: ms(16),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardbg,
    borderRadius: ms(12),
    padding: ms(3),
    marginBottom: vs(8),
    gap: ms(10),
  },
  optionsContainer: {
  marginTop: vs(4),
},

optionText: {
  fontSize: fontSize(11),
  fontFamily: Typography.Regular.fontFamily,
  color: Colors.borderColor1,
},

  quantityBadge: {
   // backgroundColor: Colors.orange,
   // borderRadius: ms(6),
    //paddingHorizontal: ms(8),
   // paddingVertical: vs(4),
    minWidth: ms(36),
    alignItems: 'center',
    paddingStart:wp(7)
  },
  quantityText: {
    fontSize: fontSize(12),
    fontFamily: Typography.Bold.fontFamily,
    color: Colors.black,
  },
  image: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(22),
    backgroundColor: '#eee',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: fontSize(13),
    fontFamily: Typography.SemiBold.fontFamily,
    color: Colors.black1,
  },
  options: {
    fontSize: fontSize(11),
    fontFamily: Typography.Regular.fontFamily,
    color: Colors.borderColor1,
    marginTop: vs(2),
  },
  price: {
    fontSize: fontSize(13),
    fontFamily: Typography.Bold.fontFamily,
    color: Colors.black1,
  },
});