import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import ShimmerBlock from './ShimmerBlock';
import { ms, vs, hp } from '../utils/responsive';
import Colors from '../utils/colors';


const ProfileScreenShimmer = () => {
  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar */}
      <View style={styles.profileSection}>
        <ShimmerBlock width={ms(100)} height={ms(100)} radius={50} />
        <View style={{ marginTop: vs(10) }}>
          <ShimmerBlock width={ms(140)} height={vs(18)} radius={6} />
        </View>
        <View style={{ marginTop: vs(8) }}>
          <ShimmerBlock width={ms(100)} height={vs(14)} radius={6} />
        </View>
      </View>

      {/* Stats row */}
      <View style={styles.statsContainer}>
        {[0, 1, 2].map((i) => (
          <ShimmerBlock key={i} width={ms(100)} height={ms(100)} radius={14} />
        ))}
      </View>

      {/* Order history card */}
      <ShimmerBlock width="100%" height={vs(90)} radius={14} />

      {/* List items */}
      <View style={styles.listSection}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={styles.listItem}>
            <ShimmerBlock width="60%" height={vs(16)} radius={6} />
            <ShimmerBlock width={ms(20)} height={ms(20)} radius={4} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default ProfileScreenShimmer;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: ms(20),
    paddingBottom: hp(2),
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: vs(25),
    marginTop: vs(10),
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(20),
  },
  listSection: {
    backgroundColor: Colors.white,
    borderRadius: ms(15),
    marginTop: vs(20),
    paddingHorizontal: ms(5),
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: vs(15),
  },
});