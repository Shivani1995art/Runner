// import React from "react";
// import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
// import { Phone, MessageCircle } from "lucide-react-native";
// import Colors from "../../utils/colors";
// import { ms, s, vs, fontSize } from "../../utils/responsive";
// import { Typography } from "../../utils/typography";
// import Messagesvg from "../../assets/svg/Messagesvg";
//  interface CustomerInfoCardProps {
//     orderId: string;
//     customerId: string;
//     name: string;
//     room: string;
//     image: string;
//     onCall: () => void;
//     onMessage: () => void;
//     style?: object;
//  }
// const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({
//   orderId,
//   customerId,
//   name,
//   room,
//   image,
//   onCall,
//   onMessage,
//   style,
// }) => {
//   return (
//     <View style={[styles.container, style]}>
      
//       {/* Header */}
//       <View style={styles.headerRow}>
//         <Text style={styles.headerText}>Customer Info</Text>
//         <Text style={styles.orderId}>#{orderId}</Text>
//       </View>

//       {/* Dotted Divider */}
//       <View style={styles.divider} />

//       {/* Content */}
//       <View style={styles.contentRow}>
        
//         {/* Avatar */}
//         <Image source={{ uri: image }} style={styles.avatar} />

//         {/* Info */}
//         <View style={styles.info}>
//           <Text style={styles.customerId}>#{customerId}</Text>
//           <Text style={styles.name}>{name}</Text>
//           <Text style={styles.room}>{room}</Text>
//         </View>

//         {/* Actions */}
//         <View style={styles.actions}>
//           <TouchableOpacity style={styles.iconBtn} onPress={onCall}>
//             <Phone size={18} color="#fff" />
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.iconBtn} onPress={onMessage}>
//             {/* <MessageCircle size={18} color="#fff" /> */}
//             <Messagesvg/>
//           </TouchableOpacity>
//         </View>

//       </View>
//     </View>
//   );
// };

// export default CustomerInfoCard;
// const styles = StyleSheet.create({
//     container: {
//       backgroundColor: Colors.customerInfoCardBg,
//       borderRadius:ms(14),
//       padding: s(10),
//      // marginHorizontal: ms(10),
//       marginBottom: vs(16),
//       borderWidth:1,
//       borderColor:Colors.black
//     },
  
//     headerRow: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//     },
  
//     headerText: {
//       fontSize: fontSize(16),
//       color: Colors.black,
//       ...Typography.SemiBold,
//     },
  
//     orderId: {
//       fontSize: fontSize(16),
//       color: Colors.black,
//       ...Typography.SemiBold,
//     },
  
//     divider: {
//       borderBottomWidth: 1,
//       borderBottomColor: "#C7D9FF",
//       borderStyle: "dashed",
//       marginVertical: vs(12),
//     },
  
//     contentRow: {
//       flexDirection: "row",
//       alignItems: "center",
//     },
  
//     avatar: {
//       width: ms(52),
//       height: ms(52),
//       borderRadius: ms(26),
//       marginRight: s(12),
//     },
  
//     info: {
//       flex: 1,
//     },
  
//     customerId: {
//       fontSize: fontSize(13),
//       color: Colors.black,
//       ...Typography.Medium,
//     },
  
//     name: {
//       fontSize: fontSize(16),
//       color: Colors.black,
//       marginTop: vs(2),
//       ...Typography.Medium,
//     },
  
//     room: {
//       fontSize: fontSize(14),
//       color: Colors.borderColor1,
//       marginTop: vs(2),
//       ...Typography.Regular,
//     },
  
//     actions: {
//       flexDirection: "row",
//     },
  
//     iconBtn: {
//       width: ms(42),
//       height: ms(42),
//       borderRadius: ms(21),
//       backgroundColor: "#3B63FE",
//       justifyContent: "center",
//       alignItems: "center",
//       marginLeft: s(10),
//     },
//   });
  import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Phone } from "lucide-react-native";
import Colors from "../../utils/colors";
import { ms, s, vs, fontSize } from "../../utils/responsive";
import { Typography } from "../../utils/typography";
import Messagesvg from "../../assets/svg/Messagesvg";

interface CustomerInfoCardProps {
  orderId: string;
  customerId: string;
  name: string;
  room: string;
  image: string;
  onCall: () => void;
  onMessage: () => void;
  style?: object;
  unreadCount?: number;      // 👈 badge count
  lastMessage?: string;      // 👈 last message preview
}

const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({
  orderId,
  customerId,
  name,
  room,
  image,
  onCall,
  onMessage,
  style,
  unreadCount = 0,
  lastMessage,
}) => {
  return (
    <View style={[styles.container, style]}>

      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Customer Info</Text>
        <Text style={styles.orderId}>#{orderId}</Text>
      </View>

      {/* Dotted Divider */}
      <View style={styles.divider} />

      {/* Content */}
      <View style={styles.contentRow}>

        {/* Avatar */}
        <Image source={{ uri: image }} style={styles.avatar} />

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.customerId}>#{customerId}</Text>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.room}>{room}</Text>

          {/* Last message preview */}
          {!!lastMessage && (
            <Text style={styles.lastMessage} numberOfLines={1}>
              💬 {lastMessage}
            </Text>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconBtn} onPress={onCall}>
            <Phone size={18} color="#fff" />
          </TouchableOpacity>

          {/* Message button with badge */}
          <TouchableOpacity style={styles.iconBtn} onPress={onMessage}>
            <Messagesvg />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

export default CustomerInfoCard;

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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    borderBottomColor: "#C7D9FF",
    borderStyle: "dashed",
    marginVertical: vs(12),
  },

  contentRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: ms(52),
    height: ms(52),
    borderRadius: ms(26),
    marginRight: s(12),
  },

  info: {
    flex: 1,
  },

  customerId: {
    fontSize: fontSize(13),
    color: Colors.black,
    ...Typography.Medium,
  },

  name: {
    fontSize: fontSize(16),
    color: Colors.black,
    marginTop: vs(2),
    ...Typography.Medium,
  },

  room: {
    fontSize: fontSize(14),
    color: Colors.borderColor1,
    marginTop: vs(2),
    ...Typography.Regular,
  },

  lastMessage: {
    fontSize: fontSize(12),
    color: Colors.borderColor1,
    marginTop: vs(4),
    ...Typography.Regular,
  },

  actions: {
    flexDirection: "row",
  },

  iconBtn: {
    width: ms(42),
    height: ms(42),
    borderRadius: ms(21),
    backgroundColor: Colors.blue,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: s(10),
    position: 'relative',  // needed for badge positioning
  },

  // ── Badge ──────────────────────────────────────────────────────────────────
  badge: {
    position: 'absolute',
    top: -ms(4),
    right: -ms(4),
    backgroundColor: Colors.error ?? 'red',
    borderRadius: ms(10),
    minWidth: ms(18),
    height: ms(18),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ms(4),
    borderWidth: 1.5,
    borderColor: Colors.white,
  },

  badgeText: {
    fontSize: fontSize(10),
    color: Colors.white,
    ...Typography.Bold,
  },
});