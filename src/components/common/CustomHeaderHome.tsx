import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { vs, ms, fontSize } from '../../utils/responsive';
import Colors from '../../utils/colors';
import { Typography } from '../../utils/typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Navigation } from 'lucide-react-native';
import GradientCircle from '../Gradient/GradientCircle';

interface CustomHeaderProps {
  displayName: string;
  location: string;
  profileImage?: string;
  NotificationIcon?: React.ReactNode;
  onNotificationPress?: () => void;
  onPress?: () => void;
}

const CustomHeaderHome: React.FC<CustomHeaderProps> = ({
  displayName,
  location,
  profileImage,
  NotificationIcon,
  onNotificationPress,
  onPress
}) => {
  return (
    <SafeAreaView edges={['top']}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
         <TouchableOpacity onPress={onPress}>
           <GradientCircle size={50} imageUri={profileImage} />
         {/* <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require('../../assets/images/login.webp')
            }
            style={styles.profileImage}
          /> */}
         </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerGreeting}>Hello {displayName},</Text>
            <Text style={styles.headerLocation}>{location}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={onNotificationPress}
        >
          <View style={styles.notificationBadge} />
          {NotificationIcon}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ms(16),
    paddingTop: vs(10),
    paddingBottom: vs(16),
    backgroundColor: Colors.white,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(12),
  },
  profileImage: {
    width: ms(50),
    height: ms(50),
    borderRadius: ms(25),
    backgroundColor: Colors.borderColor,
  },
  headerTextContainer: {
    gap: vs(2),
  },
  headerGreeting: {
    fontSize: fontSize(18),
    ...Typography.Bold,
    color: Colors.black1,
  },
  headerLocation: {
    fontSize: fontSize(14),
    ...Typography.Regular,
    color: Colors.borderColor1,
  },
  notificationButton: {
    width: ms(50),
    height: ms(50),
    borderRadius: ms(16),
    backgroundColor: Colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: ms(0),
    right: ms(-2),
    width: ms(15),
    height: ms(15),
    borderRadius: ms(7),
    backgroundColor: Colors.orange,
    zIndex: 1,
    borderWidth:2,
    borderColor:Colors.white
  },
});

export default CustomHeaderHome