import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Navigation, Phone } from 'lucide-react-native';
import { Store } from 'lucide-react-native';
import Colors from '../../utils/colors';
import { ms, s, vs, fontSize } from '../../utils/responsive';
import { Typography } from '../../utils/typography';

interface OutletInfoCardProps {
  orderId: string;
  outletName: string;
  outletAddress: string;
  outletImage?: string;
  distance?: string;
  onNavigate?: () => void;
  style?: object;
}

const OutletInfoCard: React.FC<OutletInfoCardProps> = ({
  orderId,
  outletName,
  outletAddress,
  outletImage,
  distance,
  onNavigate,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>

      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Pick up from</Text>
        <Text style={styles.orderId}>#{orderId}</Text>
      </View>

      {/* Dotted Divider */}
      <View style={styles.divider} />

      {/* Content */}
      <View style={styles.contentRow}>

        {/* Avatar / Image */}
        {outletImage ? (
          <Image source={{ uri: outletImage }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Store size={ms(24)} color={Colors.orange} />
          </View>
        )}

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.outletName} numberOfLines={1}>{outletName}</Text>
          <Text style={styles.outletAddress} numberOfLines={2}>{outletAddress}</Text>
          {distance ? (
            <Text style={styles.distance}>{distance} away</Text>
          ) : null}
        </View>

        {/* Actions */}
        {onNavigate && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.iconBtn} onPress={onNavigate}>
              <Navigation size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

      </View>
    </View>
  );
};

export default OutletInfoCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.customerInfoCardBg,
    borderRadius: ms(14),
    padding: s(10),
    marginBottom: vs(16),
    borderWidth: 1,
    borderColor: Colors.black,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerText: {
    fontSize: fontSize(16),
    color: Colors.black,
    ...Typography.SemiBold,
  },

  orderId: {
    fontSize: fontSize(16),
    color: Colors.black,
    ...Typography.SemiBold,
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#C7D9FF',
    borderStyle: 'dashed',
    marginVertical: vs(12),
  },

  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: ms(52),
    height: ms(52),
    borderRadius: ms(26),
    marginRight: s(12),
  },

  avatarFallback: {
    width: ms(52),
    height: ms(52),
    borderRadius: ms(26),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: s(12),
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },

  info: {
    flex: 1,
  },

  outletName: {
    fontSize: fontSize(16),
    color: Colors.black,
    ...Typography.Medium,
  },

  outletAddress: {
    fontSize: fontSize(13),
    color: Colors.borderColor1,
    marginTop: vs(2),
    ...Typography.Regular,
  },

  distance: {
    fontSize: fontSize(13),
    color: Colors.orange,
    marginTop: vs(4),
    ...Typography.Medium,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBtn: {
    width: ms(42),
    height: ms(42),
    borderRadius: ms(21),
    backgroundColor: '#3B63FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: s(10),
  },
});