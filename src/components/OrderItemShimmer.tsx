import React from 'react';
import { View, StyleSheet } from 'react-native';
import ShimmerBlock from './ShimmerBlock';
import { ms, vs } from '../utils/responsive';


const OrderItemShimmer = () => {
  return (
    <View style={styles.container}>
      {/* Quantity badge */}
      <ShimmerBlock width={ms(36)} height={ms(28)} radius={6} />

      {/* Image circle */}
      <ShimmerBlock width={ms(44)} height={ms(44)} radius={22} />

      {/* Name + options */}
      <View style={styles.info}>
        <ShimmerBlock width="80%" height={ms(13)} radius={5} />
        {/* <View style={{ marginTop: ms(6) }}>
          <ShimmerBlock width="50%" height={ms(11)} radius={5} />
        </View> */}
      </View>

      {/* Price */}
      {/* <ShimmerBlock width={ms(40)} height={ms(13)} radius={5} /> */}
    </View>
  );
};

export default OrderItemShimmer;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: ms(16),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2f6',
    borderRadius: ms(12),
    padding: ms(10),
    marginBottom: ms(8),
    gap: ms(10),
  },
  info: {
    flex: 1,
  },
});
