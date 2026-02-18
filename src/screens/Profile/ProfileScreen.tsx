// import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
// import React, { useEffect, useState } from 'react';

// import Circlesvg from '../../assets/svg/Circlesvg';
// import Profilebgsvg from '../../assets/svg/Profilebgsvg';
// import CustomHeader from '../../components/common/CustomHeader';
// import RightArrowsvg from '../../assets/svg/RightArrowsvg'

// import { fontSize, hp, ms, vs, wp } from '../../utils/responsive';
// import Colors from '../../utils/colors';

// import GradientCircle from '../../components/Gradient/GradientCircle';
// import Forwardsvg from '../../assets/svg/Forwardsvg'
// import { Typography } from '../../utils/typography';
// import { useNavigation } from '@react-navigation/native';
// import { STRINGS } from '../../constants/string';
// import CustomButton from '../../components/Buttons/CustomButton';
// import BackButtonsvg from '../../assets/svg/BackButtonsvg';
// import { useContext } from 'react';
// import { AuthContext } from '../../context/AuthContext';
// import CommonModal from '../../components/modals/CommonModal';
// import { useAuth } from '../../hooks/useAuth';
// import { logger } from '../../utils/logger';
// import { getToken } from '../../utils/token';
// import { useProfile } from '../../hooks/useProfile';
// import ProfileScreenShimmer from '../../components/ProfileScreenShimmer';
// import { commonStyle } from '../../styles/CommonStyles';

// const profileItems = [
//   { icon: 'profile', text: 'Edit Profile', screen: 'Setting' },
//   { icon: 'address', text: 'Help & Support', screen: 'HelpScreen' },

//   { icon: 'settings', text: 'Setting', screen: '' },
// ];

//  type ConfirmModalConfig = {
//     title: string;
//     message: string;
//     primaryText: string;
//     onConfirm: () => void;
//   };
// const ProfileScreen = ({ navigation }) => {
// const { user } = useContext(AuthContext);
// const { logoutUser } = useAuth();
// const [confirmModal, setConfirmModal] = useState<ConfirmModalConfig | null>(null);
// const { performance, isLoadingProfile, isLoadingPerformance, fetchPerformance } = useProfile();

//  useEffect(() => {
//     fetchPerformance();
//   }, []);

// const userData = {
//   name: user?.display_name || 'User',
//   email: user?.email || '',
//   profileImageUri: user?.image_url,

//   totalorder: performance?.total_delivered ?? 0,
//   monthlyOrder: performance?.monthly_delivered ?? 0,
//   timeSpend: `${performance?.online_time?.total_hours ?? 0} hrs`,
//   totalOrderDeliverToday: performance?.today_delivered ?? 0,
// };
// const openLogoutModal = () => {
//   setConfirmModal({
//     title: "Are you sure you want to logout?",
//     message: "You will need to login again to access your account.",
//     primaryText: "Logout",
//     onConfirm: handleLogout,
//   });
// };

// const handleLogout = async () => {
//   const token = await getToken();
//   logger.log("==============token==============",token);
//  await logoutUser(token || '', Platform.OS as 'ios' | 'android');
//  setConfirmModal(null);   // close dialog

// };
 
//   return (
//     <View style={commonStyle.MainContainer}>
// <CommonModal
//   visible={!!confirmModal}
//   title={confirmModal?.title}
//   message={confirmModal?.message}
//   primaryText={confirmModal?.primaryText}
//   secondaryText="Cancel"
//   onPrimaryPress={confirmModal?.onConfirm}
//   onSecondaryPress={() => setConfirmModal(null)}
// />

//       <View style={styles.bgContainer}>
//         <Profilebgsvg width={"100%"} height={hp(42)} />
//       </View>
//       <CustomHeader title="Profile"
//          leftComponent={
//             <CustomButton
//                 onPress={() => navigation.goBack()}
//                 icon={<BackButtonsvg fill="black" />}
//                 style={[commonStyle.TopbackButtonStyle, { backgroundColor:Colors.aquablue }]}
//             />
           
//         }
//       />
//       <ScrollView contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.profileSection}>
//           <GradientCircle imageUri={userData.profileImageUri} />
//           <Text style={styles.title}>{userData.name}</Text>
//           <Text style={styles.subtitle}>{userData.email}</Text>
//         </View>


//         <View style={styles.statsContainer}>
//           <StatsCard
//             title="Total Order"
//             value={`${userData.totalorder}`}
//             color={Colors.aquablue}
//           />
//           <StatsCard
//             title="Monthly Order"
//             value={userData.monthlyOrder}
//             color={Colors.orange2}
//           />
//           <StatsCard
//             title="Time Spend"
//             value={`${userData.timeSpend}`}
//             color={Colors.seagreen}
//           />
//         </View>

//         <TouchableOpacity style={styles.orderHistoryCard} activeOpacity={1} onPress={() => navigation.navigate('OrderHistory')}>
//           <Text style={styles.orderHistoryTitle}>{STRINGS.ORDER_HISTORY}</Text>
//           <View style={styles.orderHistoryDetails}>
//             <View style={{ flex: 1, flexDirection: "row", gap: ms(15) }}>
//               <Text style={styles.orderHistorySubtitle}>Total Order of this month</Text>
//               <Text style={styles.orderCount}>{userData.totalOrderDeliverToday}</Text>
//             </View>
//             <View style={styles.forwardIcon} >
//               <Forwardsvg />
//             </View>
//           </View>
//         </TouchableOpacity>


//         {/* <View style={styles.listSection}>
//           {profileItems.map((item, index) => (
//             <ListItem key={index} text={item.text}
//              onPress={() => navigation.navigate(item.screen)} />
//           ))}
//         </View> */}

//         <View style={{ height: hp(15) }} />
//       </ScrollView>

//       <CustomButton
//         title='Logout'
//         style={styles.logoutButton}
//         onPress={openLogoutModal}
//       />
//     </View>
//   );
// };

// export default ProfileScreen;



// const StatsCard = ({ title, value, color }) => (
//   <View style={[styles.statsCard, { backgroundColor: color }]}>
//     <Text style={styles.statsTitle}>{title}</Text>
//     <Text style={styles.statsValue}>{value}</Text>
//   </View>
// );

// const ListItem = ({ text, onPress }: { text: string; onPress: () => void }) => (
//   <TouchableOpacity style={styles.listItem} activeOpacity={0.7} onPress={onPress}>
//     <Text style={styles.listItemText}>{text}</Text>
//     <RightArrowsvg />
//   </TouchableOpacity>
// );


// // --- Styles ---

// const styles = StyleSheet.create({
//   bgContainer: {
//     position: 'absolute',
//     top: 0,
//     width: '100%',
//     zIndex: 0,
//   },

//   scrollContent: {
//     paddingBottom: hp(2),
//     paddingHorizontal: ms(20),
//   },

//   profileSection: {
//     alignItems: 'center',
//     marginBottom: vs(25),
//     zIndex: 1,
//   },

//   circleSvgContainer: {
//     position: 'absolute',
//     width: ms(110),
//     height: ms(110),

//   },

//   profileImage: {
//     width: ms(100),
//     height: ms(100),
//     borderRadius: ms(50),
//     marginBottom: vs(10),
//     zIndex: 2,
//   },

//   title: {
//     fontSize: ms(20),
//     fontWeight: '500',
//     color: "#0A0909",
//     fontFamily: Typography.Medium.fontFamily,
//     letterSpacing: 2
//   },

//   subtitle: {
//     fontSize: ms(14),
//     fontWeight: '500',
//     color: "#28293D",
//     fontFamily: Typography.Medium.fontFamily
//   },


//   statsContainer: {
//     flexDirection: 'row',
//    justifyContent: 'space-between',
//     marginBottom: vs(20),


   

   
//   },

//   statsCard: {
//     width: ms(100),
//     height:  ms(100),
//     borderRadius: ms(14),

//     justifyContent: 'center',

  
//   },

//   statsTitle: {
//     fontSize: fontSize(14),
//     color: "#28293D",

//     fontFamily: Typography.Medium.fontFamily,
//     fontWeight: '500',
//     textAlign:"center",

//   },

//   statsValue: {
//     fontSize: fontSize(14),
//     fontWeight: '500',
//     color: Colors.black,
//     fontFamily: Typography.Medium.fontFamily,
//     textAlign: "center"
//   },


//   orderHistoryCard: {
//     backgroundColor: '#D4FFFE',
//     borderRadius: ms(14),
//     padding: ms(15),
//     marginBottom: vs(30),
    

//   },

//   orderHistoryTitle: {
//     fontSize: ms(16),
//     fontWeight: '500',
//     color: Colors.black,
//     fontFamily: Typography.Medium.fontFamily,
//     marginBottom: vs(10),

//   },

//   orderHistoryDetails: {
//     flexDirection: 'row',
//     // alignItems: 'center',      // centers content vertically
//     // justifyContent: 'space-between', // push forward icon to the right
//   },



//   orderHistorySubtitle: {
//     fontSize: ms(14),
//     color: Colors.gray,
//     fontFamily: Typography.Medium.fontFamily,
//     fontWeight: "500"
//     //flex: 1,
//   },

//   orderCount: {
//     fontSize: ms(18),
//     fontWeight: '700',
//     color: Colors.black,
//     // marginRight: ms(0),
//     fontFamily: Typography.Medium.fontFamily,

//   },
//   arrowIcon: {
//     // You may need to style the RightArrow SVG here
//   },

//   // --- List Item Styles ---
//   listSection: {
//     backgroundColor: Colors.white,
//     borderRadius: ms(15),
//   },

//   listItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: vs(15),
//     // borderBottomWidth: StyleSheet.hairlineWidth,
//     borderBottomColor: Colors.borderColor,
//     paddingHorizontal: ms(5),
//   },

//   listItemText: {
//     fontSize: ms(16),
//     color: Colors.black,
//     fontWeight: '400',
//     fontFamily: Typography.Regular.fontFamily
//   },
//   forwardIcon: {
//     marginTop: vs(-15),
//     // backgroundColor:"red"
//   },
//   logoutButton:{
//     alignSelf: 'center',
//     position: 'absolute',
//     bottom: vs(20),
//     backgroundColor: Colors.lightred,
//   }
// });

import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';

import Profilebgsvg from '../../assets/svg/Profilebgsvg';
import CustomHeader from '../../components/common/CustomHeader';
import RightArrowsvg from '../../assets/svg/RightArrowsvg'

import { fontSize, hp, ms, vs } from '../../utils/responsive';
import Colors from '../../utils/colors';

import GradientCircle from '../../components/Gradient/GradientCircle';
import Forwardsvg from '../../assets/svg/Forwardsvg'
import { Typography } from '../../utils/typography';
import { STRINGS } from '../../constants/string';
import CustomButton from '../../components/Buttons/CustomButton';
import BackButtonsvg from '../../assets/svg/BackButtonsvg';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import CommonModal from '../../components/modals/CommonModal';
import { useAuth } from '../../hooks/useAuth';
import { logger } from '../../utils/logger';
import { getToken } from '../../utils/token';
import { useProfile } from '../../hooks/useProfile';
import { commonStyle } from '../../styles/CommonStyles';
import { useFocusEffect } from '@react-navigation/native';

type ConfirmModalConfig = {
  title: string;
  message: string;
  primaryText: string;
  onConfirm: () => void;
};

const ProfileScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { logoutUser } = useAuth();
  const [confirmModal, setConfirmModal] = useState<ConfirmModalConfig | null>(null);
  const { performance, isLoadingPerformance, fetchPerformance, fetchProfile } = useProfile();

const profileItems = [
  { icon: 'profile', text: 'Edit Profile', screen: 'Setting' },
  { icon: 'address', text: 'Help & Support', screen: 'HelpScreen' },

];

  useFocusEffect(
    useCallback(() => {
       fetchProfile();
    fetchPerformance();
    }, [])
  )



  // ── Map API response fields to display values ─────────────────────────────
  // API: stats.total_delivered, stats.today_delivered, stats.monthly_delivered
  //      stats.online_time.total_hours, stats.online_time.today_hours
  // ─────────────────────────────────────────────────────────────────────────

  const stats = {
    totalDelivered:   performance?.total_delivered   ?? 0,
    todayDelivered:   performance?.today_delivered   ?? 0,
    monthlyDelivered: performance?.monthly_delivered ?? 0,
    todayHours:       performance?.online_time?.today_hours   ?? 0,
    monthlyHours:     performance?.online_time?.monthly_hours ?? 0,
    totalHours:       performance?.online_time?.total_hours   ?? 0,
  };

  const openLogoutModal = () => {
    setConfirmModal({
      title: 'Are you sure you want to logout?',
      message: 'You will need to login again to access your account.',
      primaryText: 'Logout',
      onConfirm: handleLogout,
    });
  };

  const handleLogout = async () => {
    const token = await getToken();
    logger.log('==token==', token);
    await logoutUser(token || '', Platform.OS as 'ios' | 'android');
    setConfirmModal(null);
  };

  return (
    <View style={commonStyle.MainContainer}>
      <CommonModal
        visible={!!confirmModal}
        title={confirmModal?.title}
        message={confirmModal?.message}
        primaryText={confirmModal?.primaryText}
        secondaryText="Cancel"
        onPrimaryPress={confirmModal?.onConfirm}
        onSecondaryPress={() => setConfirmModal(null)}
      />

      <View style={styles.bgContainer}>
        <Profilebgsvg width="100%" height={hp(42)} />
      </View>

      <CustomHeader
        title="Profile"
        leftComponent={
          <CustomButton
            onPress={() => navigation.goBack()}
            icon={<BackButtonsvg fill="black" />}
            style={[commonStyle.TopbackButtonStyle, { backgroundColor: Colors.aquablue }]}
          />
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Profile avatar + name ──────────────────────────────────────── */}
        <View style={styles.profileSection}>
          <GradientCircle size={120} imageUri={user?.image_url} />
          <Text style={styles.title}>{user?.display_name || 'User'}</Text>
          <Text style={styles.subtitle}>{user?.email || ''}</Text>
        </View>

        {/* ── Stats row ─────────────────────────────────────────────────── */}
        <View style={styles.statsContainer}>
          <StatsCard
            title="Today Orders"
            value={stats.todayDelivered}
            color={Colors.aquablue}
          />
          <StatsCard
            title="Monthly Orders"
            value={stats.monthlyDelivered}
            color={Colors.orange2}
          />
          <StatsCard
            title="Time Spent"
            value={`${stats.totalHours} hrs`}
            color={Colors.seagreen}
          />
        </View>

        {/* ── Order history card ────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.orderHistoryCard}
          activeOpacity={1}
          onPress={() => navigation.navigate('OrderHistory')}
        >
          <Text style={styles.orderHistoryTitle}>{STRINGS.ORDER_HISTORY}</Text>
          <View style={styles.orderHistoryDetails}>
            <View style={{ flex: 1, flexDirection: 'row', gap: ms(15) }}>
              <Text style={styles.orderHistorySubtitle}>Total Deliveries</Text>
              <Text style={styles.orderCount}>{stats.totalDelivered}</Text>
            </View>
            <View style={styles.forwardIcon}>
              <Forwardsvg />
            </View>
          </View>
        </TouchableOpacity>


  <View style={styles.listSection}>
           {profileItems.map((item, index) => (
            // <ListItem key={index} text={item.text}
            //  onPress={() => navigation.navigate(item.screen)} />



             <ListItem
              key={index}
              text={item.text}
              onPress={() => {
                if (item.screen === 'Setting') {
                  navigation.navigate('EditProfileScreen', { 
                    userData: {
                      display_name: user?.display_name,
                      email: user?.email,
                      profile_image: user?.image_url,
                      phone: user?.phone,
                    }
                  });
                } else if (item.screen) {
                  navigation.navigate(item.screen);
                }
              }}
            />

          ))}
        </View>

        <View style={{ height: hp(15) }} />
      </ScrollView>

      <CustomButton
        title="Logout"
        style={styles.logoutButton}
        onPress={openLogoutModal}
      />
    </View>
  );
};

export default ProfileScreen;

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatsCard = ({ title, value, color }: { title: string; value: string | number; color: string }) => (
  <View style={[styles.statsCard, { backgroundColor: color }]}>
    <Text style={styles.statsTitle}>{title}</Text>
    <Text style={styles.statsValue}>{value}</Text>
  </View>
);

const ListItem = ({ text, onPress }: { text: string; onPress: () => void }) => (
  <TouchableOpacity style={styles.listItem} activeOpacity={0.7} onPress={onPress}>
    <Text style={styles.listItemText}>{text}</Text>
    <RightArrowsvg />
  </TouchableOpacity>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  bgContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 0,
  },
  scrollContent: {
    paddingBottom: hp(2),
    paddingHorizontal: ms(20),
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: vs(25),
    zIndex: 1,
  },
  title: {
    fontSize: ms(20),
    fontWeight: '500',
    color: '#0A0909',
    fontFamily: Typography.Medium.fontFamily,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: ms(14),
    fontWeight: '500',
    color: '#28293D',
    fontFamily: Typography.Medium.fontFamily,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(20),
  },
  statsCard: {
    width: ms(100),
    height: ms(100),
    borderRadius: ms(14),
    justifyContent: 'center',
  },
  statsTitle: {
    fontSize: fontSize(12),
    color: '#28293D',
    fontFamily: Typography.Medium.fontFamily,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: ms(4),
  },
  statsValue: {
    fontSize: fontSize(18),
    fontWeight: '700',
    color: Colors.black,
    fontFamily: Typography.Medium.fontFamily,
    textAlign: 'center',
    marginTop: vs(4),
  },
  orderHistoryCard: {
    backgroundColor: '#D4FFFE',
    borderRadius: ms(14),
    padding: ms(15),
    marginBottom: vs(30),
  },
  orderHistoryTitle: {
    fontSize: ms(16),
    fontWeight: '500',
    color: Colors.black,
    fontFamily: Typography.Medium.fontFamily,
    marginBottom: vs(10),
  },
  orderHistoryDetails: {
    flexDirection: 'row',
  },
  orderHistorySubtitle: {
    fontSize: ms(14),
    color: Colors.gray,
    fontFamily: Typography.Medium.fontFamily,
    fontWeight: '500',
  },
  orderCount: {
    fontSize: ms(18),
    fontWeight: '700',
    color: Colors.black,
    fontFamily: Typography.Medium.fontFamily,
  },
  forwardIcon: {
    marginTop: vs(-15),
  },
  listSection: {
    backgroundColor: Colors.white,
    borderRadius: ms(15),
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: vs(15),
    borderBottomColor: Colors.borderColor,
    paddingHorizontal: ms(5),
  },
  listItemText: {
    fontSize: ms(16),
    color: Colors.black,
    fontWeight: '400',
    fontFamily: Typography.Regular.fontFamily,
  },
  logoutButton: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: vs(20),
    backgroundColor: Colors.lightred,
  },
});