import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Pause, Play } from 'lucide-react-native';
import { vs, ms, fontSize } from '../../utils/responsive';
import Colors from '../../utils/colors';
import { Typography } from '../../utils/typography';

import { ActivityIndicator } from 'react-native';

interface DateCardProps {
  date: string;
  deliveryCount: string;
  takeBreakText: string;
  loading?: boolean;
  onTakeBreak?: () => void;
}


const DateCard: React.FC<DateCardProps> = ({
  date,
  deliveryCount,
  takeBreakText,
  loading,
  onTakeBreak,
}) => {
  const deliveryText =
    parseInt(deliveryCount) > 0
      ? `${deliveryCount} Successful Deliveries So Far`
      : 'No deliveries yet';

  return (
    <View style={styles.dateCardContainer}>
      <View style={styles.dateCardLeft}>
        <Text style={styles.dateText}>{date}</Text>
        <Text style={styles.deliveryCountText}>
          {deliveryText}
        </Text>
      </View>
      <TouchableOpacity style={styles.takeBreakButton} onPress={onTakeBreak}>
        {loading ? (
          <ActivityIndicator color={Colors.white} size="small" />
        ) : takeBreakText === "Take Break" ? (
          <Pause color={Colors.white} size={ms(28)} fill={Colors.white} />
        ) : (
          <Play color={Colors.white} size={ms(28)} fill={Colors.white} />
        )}
        <Text style={styles.takeBreakText}>{takeBreakText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  dateCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: vs(16),
    marginBottom: vs(20),
    borderRadius: ms(16),
    overflow: 'hidden',
    height: vs(100),
  },
  dateCardLeft: {
    flex: 1,
    backgroundColor: '#3D3D3D',
    height: '100%',
    paddingHorizontal: ms(20),
    paddingVertical: vs(20),
    justifyContent: 'center',
  },
  dateText: {
    fontSize: fontSize(20),
    ...Typography.Bold,
    color: Colors.white,
    marginBottom: vs(8),
  },
  deliveryCountText: {
    fontSize: fontSize(12),
    ...Typography.Regular,
    color: Colors.white,
  },
  takeBreakButton: {
    backgroundColor: Colors.lightred,
    height: '100%',
    paddingHorizontal: ms(24),
    justifyContent: 'center',
    alignItems: 'center',
    gap: vs(4),
  },
  takeBreakText: {
    fontSize: fontSize(14),
    ...Typography.SemiBold,
    color: Colors.white,
    textAlign: 'center',
  },
});

export default DateCard;