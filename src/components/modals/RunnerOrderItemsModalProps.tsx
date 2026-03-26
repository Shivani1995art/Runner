// import React, { useEffect, useRef, useState } from "react";
// import {
//     View,
//     Text,
//     Modal,
//     StyleSheet,
//     Animated,
//     TouchableWithoutFeedback,
//     Image,
//     FlatList,
//     Dimensions,
//     ScrollView,
//     TouchableOpacity,
//     PanResponder
// } from "react-native";
// import { s, vs, ms, wp, hp } from "../../utils/responsive";
// import Colors from "../../utils/colors";
// import CustomButton from "../Buttons/CustomButton";
// import CustomHeader from "../common/CustomHeader";
// import BackButtonsvg from "../../assets/svg/BackButtonsvg";
// import { Clock3, Package } from "lucide-react-native";
// import { Typography } from "../../utils/typography";
// import { logger } from "../../utils/logger";
// import { commonStyle } from "../../styles/CommonStyles";

// const { width } = Dimensions.get("window");

// interface OrderItem {
//     id: number;
//     quantity: number;
//     line_total_cents: number;
//     MenuItem?: {
//         name: string;
//         description: string;
//         image_url: string[];
//         item_type: string;
//     };
//     options?: any[];
// }

// interface RunnerOrderItemsModalProps {
//     visible: boolean;
//     onClose: () => void;
//     orderItems: OrderItem[];
//     orderId: string | number;
//     totalCents: number;
//     currency?: string;
// }

// const RunnerOrderItemsModal: React.FC<RunnerOrderItemsModalProps> = ({
//     visible,
//     onClose,
//     orderItems = [],
//     orderId,
//     totalCents,
//     currency = "USD"
// }) => {
//     const slideAnim = useRef(new Animated.Value(hp(100))).current;

//     const openSheet = () => {
//         Animated.timing(slideAnim, {
//             toValue: 0,
//             duration: 260,
//             useNativeDriver: true,
//         }).start();
//     };

//     const closeSheet = () => {
//         Animated.timing(slideAnim, {
//             toValue: hp(100),
//             duration: 240,
//             useNativeDriver: true,
//         }).start(onClose);
//     };

//     const panResponder = useRef(
//         PanResponder.create({
//             onMoveShouldSetPanResponder: (_, g) => g.dy > 12,
//             onPanResponderMove: (_, g) => {
//                 if (g.dy > 0) slideAnim.setValue(g.dy);
//             },
//             onPanResponderRelease: (_, g) => {
//                 if (g.dy > 150) closeSheet();
//                 else openSheet();
//             },
//         })
//     ).current;

//     const renderOrderItem = ({ item, index }: { item: OrderItem; index: number }) => {
//         const itemImage = item.MenuItem?.image_url?.[0] || '';
//         const itemPrice = (item.line_total_cents / 100).toFixed(2);

//         return (
//             <View style={styles.itemCard}>
//                 <View style={styles.itemImageContainer}>
//                     {itemImage ? (
//                         <Image 
//                             source={{ uri: itemImage }} 
//                             style={styles.itemImage}
//                             resizeMode="cover"
//                         />
//                     ) : (
//                         <View style={[styles.itemImage, styles.placeholderImage]}>
//                             <Package size={24} color={Colors.borderColor1} />
//                         </View>
//                     )}
//                 </View>

//                 <View style={styles.itemDetails}>
//                     <View style={styles.itemHeader}>
//                         <Text style={styles.itemName} numberOfLines={2}>
//                             {item.MenuItem?.name || 'Item'}
//                         </Text>
//                         <View style={styles.quantityBadge}>
//                             <Text style={styles.quantityText}>x{item.quantity}</Text>
//                         </View>
//                     </View>

//                     {item.MenuItem?.description && (
//                         <Text style={styles.itemDescription} numberOfLines={2}>
//                             {item.MenuItem.description}
//                         </Text>
//                     )}

//                     <View style={styles.itemFooter}>
//                         <Text style={styles.itemType}>
//                             {item.MenuItem?.item_type || 'Food'}
//                         </Text>
//                         <Text style={styles.itemPrice}>${itemPrice}</Text>
//                     </View>
//                 </View>
//             </View>
//         );
//     };

//     return (
//         <Modal transparent visible={visible} onShow={openSheet}>
//             <TouchableWithoutFeedback onPress={closeSheet}>
//                 <View style={styles.overlay} />
//             </TouchableWithoutFeedback>

//             <Animated.View
//                 {...panResponder.panHandlers}
//                 style={[styles.sheetContainer, { transform: [{ translateY: slideAnim }] }]}
//             >
//                 {/* Drag Handle */}
//                 <View style={styles.dragHandle} />

//                 {/* Header */}
//                 <View style={styles.header}>
//                     <View style={styles.headerLeft}>
//                         <Text style={styles.headerTitle}>Order Items</Text>
//                         <Text style={styles.headerSubtitle}>
//                             Order #{orderId}
//                         </Text>
//                     </View>
//                     <CustomButton
//                         onPress={closeSheet}
//                         icon={<BackButtonsvg fill="black" />}
//                         style={[commonStyle.TopbackButtonStyle, { backgroundColor: Colors.borderColor }]}
//                     />
//                 </View>

//                 <View style={styles.divider} />

//                 {/* Items Count */}
//                 <View style={styles.countContainer}>
//                     <Text style={styles.countText}>
//                         {orderItems.length} {orderItems.length === 1 ? 'Item' : 'Items'}
//                     </Text>
//                 </View>

//                 {/* Scrollable Items List */}
//                 <ScrollView
//                     style={styles.scrollContainer}
//                     contentContainerStyle={styles.scrollContent}
//                     showsVerticalScrollIndicator={true}
//                     bounces={true}
//                 >
//                     {orderItems.length === 0 ? (
//                         <View style={styles.emptyState}>
//                             <Package size={48} color={Colors.borderColor1} />
//                             <Text style={styles.emptyText}>No items in this order</Text>
//                         </View>
//                     ) : (
//                         orderItems.map((item, index) => (
//                             <View key={item.id || index}>
//                                 {renderOrderItem({ item, index })}
//                             </View>
//                         ))
//                     )}
//                 </ScrollView>

//                 {/* Total Section */}
//                 <View style={styles.totalSection}>
//                     <View style={styles.totalRow}>
//                         <Text style={styles.totalLabel}>Order Total</Text>
//                         <Text style={styles.totalAmount}>
//                             ${(totalCents / 100).toFixed(2)} {currency}
//                         </Text>
//                     </View>
//                 </View>
//             </Animated.View>
//         </Modal>
//     );
// };

// export default RunnerOrderItemsModal;

// const styles = StyleSheet.create({
//     overlay: {
//         flex: 1,
//         backgroundColor: "rgba(42, 40, 40, 0.85)",
//     },
//     sheetContainer: {
//         width: "100%",
//         height: hp(75),
//         position: "absolute",
//         bottom: 0,
//         borderTopLeftRadius: ms(28),
//         borderTopRightRadius: ms(28),
//         backgroundColor: Colors.white,
//         overflow: "hidden",
//     },
//     dragHandle: {
//         width: ms(50),
//         height: vs(4),
//         backgroundColor: Colors.borderColor1,
//         alignSelf: "center",
//         borderRadius: ms(10),
//         marginTop: vs(12),
//         marginBottom: vs(8),
//     },
//     header: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         paddingHorizontal: wp(5),
//         paddingVertical: vs(12),
//     },
//     headerLeft: {
//         flex: 1,
//     },
//     headerTitle: {
//         fontSize: ms(20),
//         fontFamily: Typography.Bold.fontFamily,
//         color: Colors.black,
//         marginBottom: vs(2),
//     },
//     headerSubtitle: {
//         fontSize: ms(13),
//         fontFamily: Typography.Regular.fontFamily,
//         color: Colors.borderColor1,
//     },
//     divider: {
//         height: 1,
//         backgroundColor: Colors.borderColor,
//         marginHorizontal: wp(5),
//     },
//     countContainer: {
//         paddingHorizontal: wp(5),
//         paddingVertical: vs(12),
//     },
//     countText: {
//         fontSize: ms(14),
//         fontFamily: Typography.Medium.fontFamily,
//         color: Colors.borderColor1,
//     },
//     scrollContainer: {
//         flex: 1,
//     },
//     scrollContent: {
//         paddingHorizontal: wp(5),
//         paddingBottom: vs(20),
//     },
//     itemCard: {
//         flexDirection: "row",
//         backgroundColor: Colors.cardbg,
//         borderRadius: ms(14),
//         padding: ms(12),
//         marginBottom: vs(12),
//         borderWidth: 1,
//         borderColor: Colors.borderColor,
//     },
//     itemImageContainer: {
//         marginRight: s(12),
//     },
//     itemImage: {
//         width: ms(75),
//         height: ms(75),
//         borderRadius: ms(12),
//     },
//     placeholderImage: {
//         backgroundColor: Colors.borderColor,
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     itemDetails: {
//         flex: 1,
//         justifyContent: "space-between",
//     },
//     itemHeader: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "flex-start",
//         marginBottom: vs(4),
//     },
//     itemName: {
//         flex: 1,
//         fontSize: ms(15),
//         fontFamily: Typography.SemiBold.fontFamily,
//         color: Colors.black,
//         marginRight: s(8),
//     },
//     quantityBadge: {
//         backgroundColor: Colors.orange,
//         paddingHorizontal: s(10),
//         paddingVertical: vs(4),
//         borderRadius: ms(12),
//     },
//     quantityText: {
//         fontSize: ms(12),
//         fontFamily: Typography.SemiBold.fontFamily,
//         color: Colors.white,
//     },
//     itemDescription: {
//         fontSize: ms(12),
//         fontFamily: Typography.Regular.fontFamily,
//         color: Colors.borderColor1,
//         marginBottom: vs(8),
//         lineHeight: ms(16),
//     },
//     itemFooter: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//     },
//     itemType: {
//         fontSize: ms(11),
//         fontFamily: Typography.Medium.fontFamily,
//         color: Colors.borderColor1,
//         textTransform: "capitalize",
//     },
//     itemPrice: {
//         fontSize: ms(16),
//         fontFamily: Typography.Bold.fontFamily,
//         color: Colors.green2,
//     },
//     emptyState: {
//         alignItems: "center",
//         justifyContent: "center",
//         paddingVertical: vs(60),
//     },
//     emptyText: {
//         fontSize: ms(14),
//         fontFamily: Typography.Regular.fontFamily,
//         color: Colors.borderColor1,
//         marginTop: vs(12),
//     },
//     totalSection: {
//         backgroundColor: Colors.white,
//         borderTopWidth: 1,
//         borderTopColor: Colors.borderColor,
//         paddingHorizontal: wp(5),
//         paddingVertical: vs(16),
//     },
//     totalRow: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//     },
//     totalLabel: {
//         fontSize: ms(15),
//         fontFamily: Typography.Medium.fontFamily,
//         color: Colors.black,
//     },
//     totalAmount: {
//         fontSize: ms(20),
//         fontFamily: Typography.Bold.fontFamily,
//         color: Colors.green2,
//     },
// });

// import React, { useRef, useMemo, useCallback } from "react";
// import { StyleSheet, View, Text } from "react-native";
// import BottomSheet, {
//   BottomSheetBackdrop,
//   BottomSheetScrollView,
// } from "@gorhom/bottom-sheet";
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import GradientContainer from "../Gradient/GradientContainer";
// import { ms, vs, fontSize } from "../../utils/responsive";
// import Colors from "../../utils/colors";
// import { Typography } from "../../utils/typography";
// import RenderItem from "../RenderItem/RenderItem";
// import CustomButton from "../Buttons/CustomButton";

// interface RunnerOrderItemsModalProps {
//   visible: boolean;
//   onClose: () => void;
//   orderItems: any[];
//   isPickedUp?: boolean;
//   isPickingUp?: boolean;
//   isDelivering?: boolean;
//   onPickup?: () => void;
//   onDeliver?: () => void;
//   maxHeightPercentage?: number;
//   minHeightPercentage?: number;
// }

// const RunnerOrderItemsModal = ({
//   visible,
//   onClose,
//   orderItems = [],
//   isPickedUp = false,
//   isPickingUp = false,
//   isDelivering = false,
//   onPickup,
//   onDeliver,
//   maxHeightPercentage = 0.55,
//   minHeightPercentage = 0.15,
// }: RunnerOrderItemsModalProps) => {
//   const bottomSheetRef = useRef<BottomSheet>(null);
//   const insets = useSafeAreaInsets();

//   const itemCount = orderItems?.length ?? 0;

//   // Snap points: peek and full
//   const snapPoints = useMemo(
//     () => [
//       `${Math.round(minHeightPercentage * 100)}%`, // peek
//       `${Math.round(maxHeightPercentage * 100)}%`, // full
//     ],
//     [minHeightPercentage, maxHeightPercentage]
//   );

//   const renderBackdrop = useCallback(
//     (props: any) => (
//       <BottomSheetBackdrop
//         {...props}
//         appearsOnIndex={1}       // backdrop only when fully open
//         disappearsOnIndex={0}    // fade out when at peek
//         pressBehavior="collapse" // tap backdrop → collapse to peek
//         opacity={0.4}
//       />
//     ),
//     []
//   );

//   return (
//     <BottomSheet
//       ref={bottomSheetRef}
//       index={visible ? 0 : -1}
//       snapPoints={snapPoints}
//       enablePanDownToClose={false}
//       onClose={onClose}
//       handleComponent={() => null}
//       backgroundStyle={styles.transparentBg}
//       backdropComponent={renderBackdrop}
//       enableHandlePanningGesture={true}
//       enableContentPanningGesture={true}
//       android_keyboardInputMode="adjustResize"
//       keyboardBehavior="fillParent"
//       keyboardBlurBehavior="restore"
//       animateOnMount={true}
//     >
//       <GradientContainer borderRadius={ms(40)} style={styles.gradientBox}>
//         {/* Scrollable Content */}
//         <BottomSheetScrollView
//           style={styles.scrollView}
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={true}
//           bounces={true}
//         >
//           {/* Drag Handle */}
//           <View style={styles.modalLine} />

//           {/* Section Title */}
//           <Text style={styles.sectionTitle}>
//             {isPickedUp ? 'Order Details' : 'Order Items'}
//             <Text style={styles.nOftext}> ({itemCount} items)</Text>
//           </Text>

//           <View style={styles.dottedLine} />

//           {/* Order Items List */}
//           {orderItems.length === 0 ? (
//             <View style={styles.emptyContainer}>
//               <Text style={styles.emptyText}>No items</Text>
//             </View>
//           ) : (
//             <View style={styles.itemsContainer}>
//               {orderItems.map((item: any, index: number) => (
//                  <RenderItem  key={item.id || index} item={item} index={index} />
//                 // <RenderItem
//                 //   key={item.id || index}
//                 //   item={{
//                 //     id: item.id,
//                 //     quantity: item.quantity,
//                 //     price: item.line_total_cents,
//                 //     menu_item: {
//                 //       name: item.MenuItem?.name,
//                 //       description: item.MenuItem?.description,
//                 //       image_url: item.MenuItem?.image_url,
//                 //       item_type: item.MenuItem?.item_type,
//                 //     },
//                 //     options: [],
//                 //   }}
//                 //   index={index}
//                 // />
//               ))}
//             </View>
//           )}
//         </BottomSheetScrollView>

//         {/* Fixed CTA Button at Bottom */}
//         <View style={[styles.ctaContainer, { paddingBottom: vs(20) + insets.bottom }]}>
//           {!isPickedUp ? (
//             <CustomButton
//               title={isPickingUp ? 'Confirming...' : 'Confirm Pickup from Restaurant'}
//               style={[styles.pickupButton, isPickingUp && styles.buttonDisabled]}
//               disabled={isPickingUp}
//               onPress={onPickup}
//             />
//           ) : (
//             <CustomButton
//               title={isDelivering ? 'Delivering...' : 'Mark as Delivered'}
//               style={[styles.deliverButton, isDelivering && styles.buttonDisabled]}
//               disabled={isDelivering}
//               onPress={onDeliver}
//             />
//           )}
//         </View>
//       </GradientContainer>
//     </BottomSheet>
//   );
// };

// export default RunnerOrderItemsModal;

// const styles = StyleSheet.create({
//   transparentBg: {
//     backgroundColor: "transparent",
//     shadowColor: "transparent",
//     elevation: 0,
//   },
//   gradientBox: {
//     flex: 1,
//     borderTopLeftRadius: ms(40),
//     borderTopRightRadius: ms(40),
//     overflow: "hidden",
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingBottom: vs(12), // Extra space for fixed button at bottom
//   },
//   modalLine: {
//     width: ms(50),
//     height: vs(4),
//     backgroundColor: Colors.black,
//     alignSelf: "center",
//     borderRadius: ms(10),
//     marginTop: vs(10),
//     marginBottom: vs(4),
//   },
//   sectionTitle: {
//     fontFamily: Typography.SemiBold.fontFamily,
//     fontSize: fontSize(14),
//     paddingHorizontal: ms(20),
//     paddingVertical: vs(10),
//   },
//   nOftext: {
//     color: Colors.borderColor1,
//     fontSize: fontSize(14),
//     fontFamily: Typography.Medium.fontFamily,
//   },
//   dottedLine: {
//     borderBottomWidth: 1.4,
//     borderBottomColor: '#E4E4EB',
//     borderStyle: 'dashed',
//     marginVertical: ms(4),
//     marginHorizontal: ms(16),
//     marginBottom: vs(8),
//   },
//   emptyContainer: {
//     paddingVertical: vs(40),
//     alignItems: "center",
//   },
//   emptyText: {
//     fontSize: fontSize(14),
//     fontFamily: Typography.Regular.fontFamily,
//     color: Colors.borderColor1,
//   },
//   itemsContainer: {
//     paddingHorizontal: ms(4),
//   },
//   // Fixed CTA Button at Bottom
//   ctaContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'transparent',
//     paddingHorizontal: ms(16),
//    paddingTop: vs(8),
//   },
//   pickupButton: {
//     backgroundColor: Colors.orange,
//     borderRadius: ms(10),
//     height: vs(50),
//     width: '100%',
//     alignSelf: 'center',
//   },
//   deliverButton: {
//     backgroundColor: Colors.green2,
//     borderRadius: ms(10),
//     height: vs(50),
//     width: '100%',
//     alignSelf: 'center',
//   },
//   buttonDisabled: {
//     opacity: 0.7,
//   },
// });


import React, { useRef, useMemo, useCallback } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientContainer from "../Gradient/GradientContainer";
import { ms, vs, fontSize, hp } from "../../utils/responsive";
import Colors from "../../utils/colors";
import { Typography } from "../../utils/typography";
import RenderItem from "../RenderItem/RenderItem";
import CustomButton from "../Buttons/CustomButton";
import { logger } from "../../utils/logger";

interface RunnerOrderItemsModalProps {
  visible: boolean;
  onClose: () => void;
  orderItems: any[];
  isPickedUp?: boolean;
  isPickingUp?: boolean;
  isDelivering?: boolean;
  onPickup?: () => void;
  onDeliver?: () => void;
  maxHeightPercentage?: number;
  minHeightPercentage?: number;
}

const RunnerOrderItemsModal = ({
  visible,
  onClose,
  orderItems = [],
  isPickedUp = false,
  isPickingUp = false,
  isDelivering = false,
  onPickup,
  onDeliver,
  maxHeightPercentage = 0.55,
  minHeightPercentage = 0.15,
}: RunnerOrderItemsModalProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();

  const itemCount = orderItems?.length ?? 0;

  // ✅ FIXED: Calculate dynamic height based on item count
  // Show 3 items before scrolling
  const ITEM_HEIGHT = vs(90); // Approximate height of one item
  const HEADER_HEIGHT = vs(120); // Handle + Title + Divider
  const BUTTON_HEIGHT = vs(70); // Button height + padding
  const MAX_ITEMS_VISIBLE = 3;

  // ✅ Dynamic snap points based on items
  const snapPoints = useMemo(() => {
    const itemsToShow = Math.min(itemCount, MAX_ITEMS_VISIBLE);
    const contentHeight = HEADER_HEIGHT + (itemsToShow * ITEM_HEIGHT) + BUTTON_HEIGHT;
    const windowHeight = Dimensions.get('window').height;
    
    // Percentage based on content
    const contentPercentage = (contentHeight / windowHeight) * 100;
    const fullPercentage = Math.min(contentPercentage + 5, 48); // Cap at 85%
    
    logger.log(`📐 Modal Heights: items=${itemCount}, contentHeight=${contentHeight}, percentage=${fullPercentage}%`);

    return [
      `${Math.round(minHeightPercentage * 100)}%`, // peek
      `${Math.min(Math.round(fullPercentage), 80)}%`, // full (max 80%)
    ];
  }, [itemCount]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={1}
        disappearsOnIndex={0}
        pressBehavior="collapse"
        opacity={0.4}
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={visible ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      onClose={onClose}
      handleComponent={() => null}
      backgroundStyle={styles.transparentBg}
      backdropComponent={renderBackdrop}
      enableHandlePanningGesture={true}
      enableContentPanningGesture={true}
      android_keyboardInputMode="adjustResize"
      keyboardBehavior="fillParent"
      keyboardBlurBehavior="restore"
      animateOnMount={true}
    >
      <GradientContainer borderRadius={ms(40)} style={styles.gradientBox}>
        {/* ✅ FIXED: Main flex container */}
        <View style={styles.containerFlex}>
          {/* Header - Fixed at top */}
          <View style={styles.headerSection}>
            <View style={styles.modalLine} />
            <Text style={styles.sectionTitle}>
              {isPickedUp ? 'Order Details' : 'Order Items'}
              <Text style={styles.nOftext}> ({itemCount} items)</Text>
            </Text>
            <View style={styles.dottedLine} />
          </View>

          {/* Scrollable Items - Fixed height */}
          <View style={styles.itemsListWrapper}>
            {orderItems.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No items</Text>
              </View>
            ) : (
              <BottomSheetScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
                bounces={true}
              >
                <View style={styles.itemsContainer}>
                  {orderItems.map((item: any, index: number) => (
                    <RenderItem 
                      key={item.id || index} 
                      item={item} 
                      index={index} 
                    />
                  ))}
                </View>
              </BottomSheetScrollView>
            )}
          </View>s

          {/* Button - Fixed at bottom */}
          <View style={[styles.ctaContainer, { paddingBottom: insets.bottom }]}>
            {!isPickedUp ? (
              <CustomButton
                title={isPickingUp ? 'Confirming...' : 'Confirm Pickup from Restaurant'}
                style={[styles.pickupButton, isPickingUp && styles.buttonDisabled]}
                disabled={isPickingUp}
                onPress={onPickup}
              />
            ) : (
              <CustomButton
                title={isDelivering ? 'Delivering...' : 'Mark as Delivered'}
                style={[styles.deliverButton, isDelivering && styles.buttonDisabled]}
                disabled={isDelivering}
                onPress={onDeliver}
              />
            )}
          </View>
        </View>
      </GradientContainer>
    </BottomSheet>
  );
};

export default RunnerOrderItemsModal;

const styles = StyleSheet.create({
  transparentBg: {
    backgroundColor: "transparent",
    shadowColor: "transparent",
    elevation: 0,
  },
  gradientBox: {
    flex: 1,
    borderTopLeftRadius: ms(40),
    borderTopRightRadius: ms(40),
    overflow: "hidden",
  },
  // ✅ Main container with flex layout
  containerFlex: {
    flex: 1,
    flexDirection: 'column',
  },
  // ✅ FIXED: Header section - fixed at top
  headerSection: {
    paddingBottom: vs(8),
  },
  // ✅ FIXED: Items wrapper with limited height
  itemsListWrapper: {
    flex: 1,
    minHeight: vs(100),
    maxHeight: vs(270), // ✅ Limits to ~3 items height
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: vs(8),
  },
  modalLine: {
    width: ms(50),
    height: vs(4),
    backgroundColor: Colors.black,
    alignSelf: "center",
    borderRadius: ms(10),
    marginTop: vs(10),
    marginBottom: vs(4),
  },
  sectionTitle: {
    fontFamily: Typography.SemiBold.fontFamily,
    fontSize: fontSize(14),
    paddingHorizontal: ms(20),
    paddingVertical: vs(10),
    color: Colors.black1,
  },
  nOftext: {
    color: Colors.borderColor1,
    fontSize: fontSize(14),
    fontFamily: Typography.Medium.fontFamily,
  },
  dottedLine: {
    borderBottomWidth: 1.4,
    borderBottomColor: '#E4E4EB',
    borderStyle: 'dashed',
    marginVertical: ms(4),
    marginHorizontal: ms(16),
    marginBottom: vs(8),
  },
  emptyContainer: {
    paddingVertical: vs(40),
    alignItems: "center",
  },
  emptyText: {
    fontSize: fontSize(14),
    fontFamily: Typography.Regular.fontFamily,
    color: Colors.borderColor1,
  },
  itemsContainer: {
    paddingHorizontal: ms(4),
  },
  // ✅ FIXED: Button at bottom
  ctaContainer: {
    paddingHorizontal: ms(16),
    paddingTop: vs(8),
    backgroundColor: 'transparent',
  },
  pickupButton: {
    backgroundColor: Colors.orange,
    borderRadius: ms(10),
    height: vs(50),
    width: '100%',
    alignSelf: 'center',
  },
  deliverButton: {
    backgroundColor: Colors.green2,
    borderRadius: ms(10),
    height: vs(50),
    width: '100%',
    alignSelf: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});