// import React, { useState, useEffect } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
// import { MapPin, Clock, Map, CheckCircle } from 'lucide-react-native';
// import { vs, ms, fontSize, hp } from '../../utils/responsive';
// import Colors from '../../utils/colors';
// import { Typography } from '../../utils/typography';
// import { useFocusEffect } from '@react-navigation/native';
// import { logger } from '../../utils/logger';

// interface OrderCardProps {
//   distance: string;
//   time: string;
//   location: string;
//   status?: 'preparing' | 'ready' | 'assigned' | 'picked' | 'delivered';
//   onAccept?: () => void;
//   rightText?: string;
//   orcontainerStyle?: object;
//   timechipStyle?: object;
//   showOrderButton?: boolean;
//   timeText?: object;
//   ClockColor?: string;
//   locationUnderline?: boolean;
// }

// const OrderCard: React.FC<OrderCardProps> = ({
//   distance,
//   time,
//   location,
//   status = 'preparing',
//   onAccept,
//   rightText = "",
//   orcontainerStyle = {},
//   timechipStyle = {},
//   showOrderButton = true,
//   timeText = {},
//   ClockColor = "",
//   locationUnderline = true,
// }) => {
//   const clockColor = ClockColor || Colors.white;

//   const initialMinutes = parseInt(time.replace(/[^0-9]/g, '')) || 0;
//   const [remainingSeconds, setRemainingSeconds] = useState(initialMinutes * 60);

//   // ── Countdown effect (only for 'preparing' status) ─────────────────────────


//   useFocusEffect(
//     React.useCallback(() => {
//       if (status !== 'preparing' || remainingSeconds <= 0) return;

//     const timer = setInterval(() => {
//       setRemainingSeconds(prev => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//     }, [remainingSeconds, status])
//   );
// //logger.log('====time====', time);
//   const formatTime = (totalSeconds: number) => {
//     if (totalSeconds <= 0) return '0s';
//     const mins = Math.floor(totalSeconds / 60);
//     const secs = totalSeconds % 60;
//     if (mins > 0) {
//       return `${mins}m ${secs}s`;
//     }
//     return `0m${secs}s`;
//   };

//   // ── Get chip background color ───────────────────────────────────────────────
//   const getChipBackgroundColor = () => {
//     switch (status) {
//       case 'ready':
//         return Colors.green2 || '#10B981';
//       case 'preparing':
//       default:
//         return Colors.seagreen1;
//     }
//   };

//   // ── Render chip content ─────────────────────────────────────────────────────
//   const renderChipContent = () => {
//     if (status === 'ready') {
//       return (
//         <>
//           <CheckCircle color={clockColor} size={ms(16)} strokeWidth={2.5} />
//           <Text style={[styles.timeText, timeText, { color: clockColor }]}>
//             Order Ready
//           </Text>
//         </>
//       );
//     } else {
//       return (
//         <>
//           <Clock color={clockColor} size={ms(16)} strokeWidth={2.5} />
//           <Text style={[styles.timeText, timeText, { color: clockColor }]}>
//             {formatTime(remainingSeconds)}
//           </Text>
//         </>
//       );
//     }
//   };

//   return (
//     <View
//       style={[
//         styles.orderCard,
//         orcontainerStyle,
//         showOrderButton && { marginBottom: hp(2) }
//       ]}
//     >
//       {/* ── Layout Branch 1: Modal (showOrderButton = false) ──────────────── */}
//       {!showOrderButton && (
//         <View style={styles.modalHeader}>
//           {rightText ? (
//             <Text style={styles.rightTextstyle}>{rightText}</Text>
//           ) : null}
          
//           <View
//             style={[
//               styles.modalChip,
//               { backgroundColor: getChipBackgroundColor() },
//               timechipStyle
//             ]}
//           >
//             {renderChipContent()}
//           </View>
//         </View>
//       )}

//       {/* ── Layout Branch 2: List (showOrderButton = true) ────────────────── */}
//       {showOrderButton && (
//         <View
//           style={[
//             styles.listChip,
//             { backgroundColor: getChipBackgroundColor() },
//             timechipStyle
//           ]}
//         >
//           {renderChipContent()}
//         </View>
//       )}

//       {/* ── Common content ──────────────────────────────────────────────────── */}
//       <View style={styles.orderCardHeader}>
//         <View style={styles.distanceContainer}>
//           <View style={styles.labelWithIcon}>
//             <Text style={styles.distanceLabel}>Distance</Text>
//             <Map color={Colors.borderColor1} size={ms(14)} strokeWidth={2} />
//           </View>
//           <Text style={styles.distanceValue}>{distance}</Text>
//         </View>
//       </View>

//       <View style={showOrderButton ? styles.locationContainer : null}>
//         <View style={styles.labelWithIcon}>
//           <Text style={styles.locationLabel}>Location</Text>
//           <MapPin color={Colors.borderColor1} size={ms(14)} strokeWidth={2} />
//         </View>
//         <View style={locationUnderline && styles.locationUnderline}>
//           <Text style={styles.locationValue}>{location}</Text>
//         </View>
//       </View>

//       {showOrderButton && (
//         <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
//           <Text style={styles.acceptButtonText}>Order Details</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   orderCard: {
//     borderRadius: ms(16),
//     paddingLeft: ms(16),
//     paddingRight: ms(16),
//    // paddingTop: vs(8),
//     paddingBottom: vs(16),
//   },
  
//   // ── Modal Layout (showOrderButton = false) ─────────────────────────────────
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//    // marginBottom: vs(16),
//    marginRight: -ms(32),
//   },
//   modalChip: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: ms(12),
//     paddingVertical: vs(12),
//     borderTopRightRadius: ms(40),
//     borderBottomLeftRadius: ms(12),
//     gap: ms(6),
//   },
//   rightTextstyle: {
//     marginVertical: vs(16),
//     fontSize: fontSize(16),
//     color: Colors.black2,
//     fontFamily: Typography.Bold.fontFamily,
//     fontWeight: "700",
//     flex: 1,
//   },

//   // ── List Layout (showOrderButton = true) ───────────────────────────────────
//   listChip: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: ms(12),
//     paddingVertical: vs(12),
//     borderTopRightRadius: ms(18),
//     borderBottomRightRadius: ms(4),
//     borderTopLeftRadius: ms(0),
//     borderBottomLeftRadius: ms(12),
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     shadowOffset: { width: 0, height: 2 },
//     gap: ms(6),
//     position: "absolute",
//     right: 0,
//     top: 0,
//     zIndex: 1,
//   },

//   // ── Common Styles ───────────────────────────────────────────────────────────
//   orderCardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: vs(16),
//   },
//   distanceContainer: {
//     marginTop: vs(5),
//   },
//   labelWithIcon: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: ms(4),
//   },
//   distanceLabel: {
//     fontSize: fontSize(12),
//     ...Typography.Regular,
//     color: Colors.borderColor1,
//   },
//   distanceValue: {
//     fontSize: fontSize(18),
//     ...Typography.Bold,
//     color: Colors.black1,
//   },
//   timeText: {
//     fontSize: fontSize(12),
//     ...Typography.SemiBold,
//   },
//   locationContainer: {
//     marginBottom: vs(16),
//   },
//   locationLabel: {
//     fontSize: fontSize(12),
//     ...Typography.Regular,
//     color: Colors.borderColor1,
//   },
//   locationValue: {
//     fontSize: fontSize(14),
//     ...Typography.Medium,
//     color: Colors.black1,
//   },
//   locationUnderline: {
//     borderBottomWidth: 1,
//     borderStyle: 'dashed',
//     borderColor: Colors.borderColor1,
//     paddingBottom: vs(5),
//     marginTop: vs(2),
//   },
//   acceptButton: {
//     backgroundColor: Colors.orange,
//     borderRadius: ms(12),
//     paddingVertical: vs(14),
//     alignItems: 'center',
//   },
//   acceptButtonText: {
//     fontSize: fontSize(16),
//     ...Typography.Bold,
//     color: Colors.white,
//   },
// });

// export default OrderCard;

import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MapPin, Clock, Map, CheckCircle } from 'lucide-react-native';
import { vs, ms, fontSize, hp } from '../../utils/responsive';
import Colors from '../../utils/colors';
import { Typography } from '../../utils/typography';
import { useFocusEffect } from '@react-navigation/native';
import { logger } from '../../utils/logger';
import moment from 'moment';

interface OrderCardProps {
  distance: string;
  time: string;
  estimatedReadyAt?: string | null; // e.g. "2026-02-19T06:09:46.339Z"
  startedAt?: number;               // epoch ms fallback
  location: string;
  status?: 'preparing' | 'ready' | 'assigned' | 'picked' | 'delivered';
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
  estimatedReadyAt,
  startedAt,
  location,
  status = 'preparing',
  onAccept,
  rightText = '',
  orcontainerStyle = {},
  timechipStyle = {},
  showOrderButton = true,
  timeText = {},
  ClockColor = '',
  locationUnderline = true,
}) => {
  const clockColor = ClockColor || Colors.white;

  // ── Calculate remaining seconds ─────────────────────────────────────────────
  const getInitialSeconds = (): number => {
    // Priority 1: use estimatedReadyAt ISO timestamp via moment (most accurate)
    if (estimatedReadyAt) {
      const diff = moment(estimatedReadyAt).diff(moment(), 'seconds');
      return Math.max(0, diff);
    }
    // Priority 2: fallback to time string + startedAt
    const totalSeconds = (parseInt(time.replace(/[^0-9]/g, '')) || 0) * 60;
    if (!startedAt) return totalSeconds;
    const elapsed = moment().diff(moment(startedAt), 'seconds');
    return Math.max(0, totalSeconds - elapsed);
  };

  const [remainingSeconds, setRemainingSeconds] = useState<number>(getInitialSeconds);

  // ── Countdown effect (only for 'preparing' status) ─────────────────────────
  useFocusEffect(
    React.useCallback(() => {
      if (status !== 'preparing') return;

      // Recalculate on focus in case time passed while screen was blurred
      setRemainingSeconds(getInitialSeconds());

      const timer = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }, [status, estimatedReadyAt, startedAt])
  );

  // ── Format seconds → "Xm Ys" display ───────────────────────────────────────
  const formatTime = (totalSeconds: number): string => {
    if (totalSeconds <= 0) return '0s';
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `0m${secs}s`;
  };

  // ── Chip background color ───────────────────────────────────────────────────
  const getChipBackgroundColor = (): string => {
    switch (status) {
      case 'ready':
        return Colors.green2 || '#10B981';
      case 'preparing':
      default:
        return Colors.seagreen1;
    }
  };

  // ── Chip content ────────────────────────────────────────────────────────────
  const renderChipContent = () => {
    if (status === 'ready') {
      return (
        <>
          <CheckCircle color={clockColor} size={ms(16)} strokeWidth={2.5} />
          <Text style={[styles.timeText, timeText, { color: clockColor }]}>
            Order Ready
          </Text>
        </>
      );
    }
    return (
      <>
        <Clock color={clockColor} size={ms(16)} strokeWidth={2.5} />
        <Text style={[styles.timeText, timeText, { color: clockColor }]}>
          {formatTime(remainingSeconds)}
        </Text>
      </>
    );
  };

  return (
    <View
      style={[
        styles.orderCard,
        orcontainerStyle,
        showOrderButton && { marginBottom: hp(2) },
      ]}
    >
      {/* ── Modal layout (showOrderButton = false) ───────────────────────── */}
      {!showOrderButton && (
        <View style={styles.modalHeader}>
          {rightText ? (
            <Text style={styles.rightTextstyle}>{rightText}</Text>
          ) : null}
          <View
            style={[
              styles.modalChip,
              { backgroundColor: getChipBackgroundColor() },
              timechipStyle,
            ]}
          >
            {renderChipContent()}
          </View>
        </View>
      )}

      {/* ── List layout (showOrderButton = true) ─────────────────────────── */}
      {showOrderButton && (
        <View
          style={[
            styles.listChip,
            { backgroundColor: getChipBackgroundColor() },
            timechipStyle,
          ]}
        >
          {renderChipContent()}
        </View>
      )}

      {/* ── Common content ───────────────────────────────────────────────── */}
      <View style={styles.orderCardHeader}>
        <View style={styles.distanceContainer}>
          <View style={styles.labelWithIcon}>
            <Text style={styles.distanceLabel}>Distance</Text>
            <Map color={Colors.borderColor1} size={ms(14)} strokeWidth={2} />
          </View>
          <Text style={styles.distanceValue}>{distance}</Text>
        </View>
      </View>

      <View style={showOrderButton ? styles.locationContainer : undefined}>
        <View style={styles.labelWithIcon}>
          <Text style={styles.locationLabel}>Location</Text>
          <MapPin color={Colors.borderColor1} size={ms(14)} strokeWidth={2} />
        </View>
        <View style={locationUnderline ? styles.locationUnderline : undefined}>
          <Text style={styles.locationValue}>{location}</Text>
        </View>
      </View>

      {showOrderButton && (
        <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
          <Text style={styles.acceptButtonText}>Order Details</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  orderCard: {
    borderRadius: ms(16),
    paddingLeft: ms(16),
    paddingRight: ms(16),
    paddingBottom: vs(16),
  },

  // ── Modal Layout ────────────────────────────────────────────────────────────
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginRight: -ms(32),
  },
  modalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(12),
    paddingVertical: vs(12),
    borderTopRightRadius: ms(40),
    borderBottomLeftRadius: ms(12),
    gap: ms(6),
  },
  rightTextstyle: {
    marginVertical: vs(16),
    fontSize: fontSize(16),
    color: Colors.black2,
    fontFamily: Typography.Bold.fontFamily,
    fontWeight: '700',
    flex: 1,
  },

  // ── List Layout ─────────────────────────────────────────────────────────────
  listChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(12),
    paddingVertical: vs(12),
    borderTopRightRadius: ms(18),
    borderBottomRightRadius: ms(4),
    borderTopLeftRadius: ms(0),
    borderBottomLeftRadius: ms(12),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    gap: ms(6),
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },

  // ── Common ──────────────────────────────────────────────────────────────────
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: vs(16),
  },
  distanceContainer: {
    marginTop: vs(5),
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
  timeText: {
    fontSize: fontSize(12),
    ...Typography.SemiBold,
  },
  locationContainer: {
    marginBottom: vs(16),
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
});

export default OrderCard;