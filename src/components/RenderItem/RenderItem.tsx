import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { ms, vs, fontSize, wp } from '../../utils/responsive';
import Colors from '../../utils/colors';
import { Typography } from '../../utils/typography';

const RenderItem = ({ item,index }: { item: any,index:number }) => {
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

//const bgColor = index % 2 === 0 ? '#fce5bd' : '#d8def4';
  return (
   <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.quantityBadge}>
        <Text style={styles.quantityText}>{item.quantity} x</Text>
      </View>

      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {menuItem?.name}
        </Text>

        {/* {item.options?.length > 0 && (
          <Text style={styles.options} numberOfLines={1}>
            {item.options.map((o: any) => o.name).join(', ')}
          </Text>
        )} */}
      </View>

      {/* <Text style={styles.price}>
        ${(item.price / 100).toFixed(2)}
      </Text> */}
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