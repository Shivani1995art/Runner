import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ms, vs } from '../utils/responsive';
import ShimmerBlock from './ShimmerBlock'; // your reanimated shimmer

const OrderCardShimmer = () => {
  return (
    <View style={styles.container}>

      {/* Top row: distance chip + time chip */}
      <View style={styles.topRow}>
        <ShimmerBlock width={ms(80)} height={vs(28)} radius={20} />
        <ShimmerBlock width={ms(90)} height={vs(28)} radius={20} />
      </View>

      {/* Location line */}
      <View style={styles.locationRow}>
        {/* pin icon placeholder */}
        <ShimmerBlock width={ms(16)} height={ms(16)} radius={8} />
        <View style={{ marginLeft: ms(8), flex: 1 }}>
          <ShimmerBlock width="80%" height={vs(14)} radius={6} />
        </View>
      </View>

      {/* Second location line (shorter) */}
      <View style={[styles.locationRow, { marginTop: vs(6) }]}>
        <View style={{ width: ms(16) }} />
        <View style={{ marginLeft: ms(8), flex: 1 }}>
          <ShimmerBlock width="55%" height={vs(12)} radius={6} />
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Accept Order button */}
      <ShimmerBlock width="100%" height={vs(44)} radius={10} />

    </View>
  );
};

export default OrderCardShimmer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eef2f6',
    borderRadius: ms(16),
    padding: ms(16),
    marginBottom: vs(16),
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(14),
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(4),
  },
  divider: {
    height: 1,
    backgroundColor: '#dde3ea',
    marginVertical: vs(14),
  },
});