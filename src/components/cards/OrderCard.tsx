

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MapPin, Clock, Map } from 'lucide-react-native';
import { vs, ms, fontSize } from '../../utils/responsive';
import Colors from '../../utils/colors';
import { Typography } from '../../utils/typography';

interface OrderCardProps {
  distance: string;
  time: string;
  location: string;
  onAccept?: () => void;
  rightText?: string;
  orcontainerStyle?: object;
  timechipStyle?: object;
  showOrderButton?: boolean;
  timeText?: object;
  ClockColor?: string;
  locationUnderline?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({
  distance,
  time,
  location,
  onAccept,
  rightText = "",
  orcontainerStyle = {},
  timechipStyle = {},
  showOrderButton = true,
  timeText = {},
  ClockColor = "",
  locationUnderline = true,
}) => {
  const clockColor = ClockColor ? ClockColor : Colors.white;
  return (
    <View style={[styles.orderCard, orcontainerStyle]}>

      <Text style={[styles.rightTextstyle]}>{rightText}</Text>
      <View style={[styles.timeChip, timechipStyle]}>
        <Clock color={clockColor} size={ms(16)} strokeWidth={2.5} />
        <Text style={[styles.timeText, timeText]}>{time}</Text>
      </View>
      <View style={styles.orderCardHeader}>

        <View style={styles.distanceContainer}>
          <View style={styles.labelWithIcon}>
            <Text style={styles.distanceLabel}>Distance</Text>
            <Map color={Colors.borderColor1} size={ms(14)} strokeWidth={2} />
          </View>
          <Text style={styles.distanceValue}>{distance}</Text>
        </View>

      </View>

      <View style={styles.locationContainer}>
        <View style={styles.labelWithIcon}>
          <Text style={styles.locationLabel}>location</Text>
          <MapPin color={Colors.borderColor1} size={ms(14)} strokeWidth={2} />
        </View>
        <View style={locationUnderline &&styles.locationUnderline}>
          <Text style={styles.locationValue}>{location}</Text>
        </View>
      </View>
      {showOrderButton &&
        <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
          <Text style={styles.acceptButtonText}>Accept Order</Text>
        </TouchableOpacity>}
    </View>
  );
};

const styles = StyleSheet.create({
  orderCard: {
  //  backgroundColor: Colors.cardbg,
    borderRadius: ms(16),
    padding: ms(16),
    marginBottom: vs(16),
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: vs(16),
  },
  distanceContainer: {
    marginTop:vs(5)
    //gap: vs(4),
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(4),
  },
  distanceLabel: {
    fontSize: fontSize(12),
    ...Typography.Regular,
    color: Colors.borderColor1,
  },
  distanceValue: {
    fontSize: fontSize(18),
    ...Typography.Bold,
    color: Colors.black1,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.seagreen1,
    paddingHorizontal: ms(12),
    paddingVertical: vs(6),
    borderTopRightRadius: ms(18),
    borderBottomRightRadius: ms(8),
    borderTopLeftRadius: ms(0),
    borderBottomLeftRadius: ms(8),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    gap: ms(6), position: "absolute",
    right: 0,
    top: 0


  },

  timeText: {
    fontSize: fontSize(12),
    ...Typography.SemiBold,
    color: Colors.white,
  },
  locationContainer: {
    marginBottom: vs(16),
    //gap: vs(6),
  },
  locationLabel: {
    fontSize: fontSize(12),
    ...Typography.Regular,
    color: Colors.borderColor1,
  },
  locationValue: {
    fontSize: fontSize(14),
    ...Typography.Medium,
    color: Colors.black1,


  },
  locationUnderline: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.borderColor1,
    paddingBottom: vs(5),
    marginTop: vs(2),
  },

  acceptButton: {
    backgroundColor: Colors.orange,
    borderRadius: ms(12),
    paddingVertical: vs(14),
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: fontSize(16),
    ...Typography.Bold,
    color: Colors.white,
  },
  rightTextstyle: {
    fontSize: fontSize(16),
    color: Colors.black2,
    fontFamily: Typography.Bold.fontFamily,
    fontWeight: "700",
  }
});

export default OrderCard;