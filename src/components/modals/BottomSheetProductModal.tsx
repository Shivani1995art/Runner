import React, { useRef, useState } from "react";
import {
    View,
    Text,
    Modal,
    StyleSheet,
    Animated,
    TouchableWithoutFeedback,
    Image,
    FlatList,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    PanResponder,
} from "react-native";

import { s, vs, ms, wp, hp } from "../../utils/responsive";
import Colors from "../../utils/colors";

import CustomButton from "../Buttons/CustomButton";
import CustomHeader from "../common/CustomHeader";

import DiscountBgSvg from "../../assets/svg/Discountbgsvg";
import BackButtonsvg from "../../assets/svg/BackButtonsvg";
import Heartsvg from "../../assets/svg/Heartsvg";
import { Check, Clock3 } from "lucide-react-native";
import { Typography } from "../../utils/typography";
import { commonStyle } from "../../Styles/CommonStyles";

const { width } = Dimensions.get("window");

const BottomSheetProductModal = ({ visible, onClose, images = [], navigation, onPress }) => {
    const slideAnim = useRef(new Animated.Value(hp(100))).current;
    const [activeIndex, setActiveIndex] = useState(0);

    const [addonsData, setAddonsData] = useState([
        {
            title: "Prime KSI Hydration Drink",
            size: "250 ml",
            price: "$5.10",
            image: "https://images.pexels.com/photos/451219/pexels-photo-451219.jpeg?auto=compress&cs=tinysrgb&h=100&w=100",
            selected: false,
        },
        {
            title: "Red Bull Energy Drink, Can",
            size: "250 ml",
            price: "$2.99",
            image: "https://images.pexels.com/photos/169465/pexels-photo-169465.jpeg?auto=compress&cs=tinysrgb&h=100&w=100",
            selected: false,
        },
        {
            title: "Ice Ball Molds Round Ice Cube",
            size: "6 cm",
            price: "$0.10",
            image: "https://images.pexels.com/photos/318418/pexels-photo-318418.jpeg?auto=compress&cs=tinysrgb&h=100&w=100",
            selected: false,
        },
    ]);


    const toggleAddon = (index) => {
        let temp = [...addonsData];
        temp[index].selected = !temp[index].selected;
        setAddonsData(temp);
    };


    const openSheet = () => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 260,
            useNativeDriver: true,
        }).start();
    };


    const closeSheet = () => {
        Animated.timing(slideAnim, {
            toValue: hp(100),
            duration: 240,
            useNativeDriver: true,
        }).start(onClose);
    };


    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) => g.dy > 12,
            onPanResponderMove: (_, g) => {
                if (g.dy > 0) slideAnim.setValue(g.dy);
            },
            onPanResponderRelease: (_, g) => {
                if (g.dy > 150) closeSheet();
                else openSheet();
            },
        })
    ).current;
    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) setActiveIndex(viewableItems[0].index);
    }).current;
    return (
        <Modal transparent visible={visible} onShow={openSheet}>
            <TouchableWithoutFeedback onPress={closeSheet}>
                <View style={styles.overlay} />
            </TouchableWithoutFeedback>
            <Animated.View
                {...panResponder.panHandlers}
                style={[styles.sheetContainer, { transform: [{ translateY: slideAnim }] }]}
            >

                <View style={styles.imageTopContainer}>
                    <View style={styles.headerAbsolute}>
                        <CustomHeader
                            leftComponent={
                                <CustomButton
                                    onPress={closeSheet}
                                    icon={<BackButtonsvg fill="black" />}
                                    style={[commonStyle.TopbackButtonStyle, { backgroundColor: Colors.aquablue }]}
                                />
                            }
                            rightComponent={
                                <CustomButton
                                    onPress={() => { }}
                                    icon={<Heartsvg fill="black" />}
                                    style={[commonStyle.TopbackButtonStyle, { backgroundColor: "#FDED72" }]}
                                />
                            }
                        />
                    </View>

                    <FlatList
                        data={images}
                        horizontal
                        pagingEnabled
                        keyExtractor={(_, i) => String(i)}
                        showsHorizontalScrollIndicator={false}
                        onViewableItemsChanged={onViewableItemsChanged}
                        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                        renderItem={({ item }) => <Image source={{ uri: item }} style={styles.image} />}
                    />

                    <View style={styles.dotsAbsolute}>
                        {images.map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.dot,
                                    { opacity: activeIndex === i ? 1.2 : 1.3, width: activeIndex === i ? ms(14) : ms(8), backgroundColor: activeIndex === i ? Colors.blue : Colors.white, },
                                ]}
                            />
                        ))}
                    </View>
                </View>


                <View style={styles.whiteContainer}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: vs(180) }}
                    >
                        <View style={styles.discountRowandTime}>
                            <View style={styles.discountRow}>
                                <DiscountBgSvg />
                                <Text style={styles.distcounttext}>50% OFF</Text>
                            </View>
                            <View style={styles.discountRow}>
                                <Clock3 color="black" size={20} />
                                <Text style={styles.timeTxt}>15–25 Min</Text>
                            </View>
                        </View>


                        <View style={styles.titlePriceRow}>
                            <Text style={styles.title}>Woodford Reserve 30 ML</Text>
                            <View style={styles.oldPriceWrapper}>
                                <Text style={styles.oldPrice}>$5.5</Text>
                                <View style={styles.strikeLine} />
                            </View>

                            <Text style={styles.newPrice}>$2.60</Text>
                        </View>



                        <Text style={styles.sectionTitle}>Ingredients</Text>
                        <Text style={styles.desc}>
                            Corn (72%) – provides sweetness and classic bourbon body. Rye (18%) –
                            adds spice, peppery warmth, and complexity. Malted Barley (10%) adds smooth taste.
                        </Text>


                        <Text style={[styles.sectionTitle, { marginTop: vs(20) }]}>
                            Add-ons
                        </Text>

                        <View style={styles.addonBox}>
                            {addonsData.map((item, index) => (
                                <View key={index} style={styles.addonItem}>
                                    <Image source={{ uri: item.image }} style={styles.addonImage} />

                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.addonTitle}>{item.title}</Text>
                                        <View style={styles.addOnRow}>
                                            <Text style={styles.addonMeta}>Size: {item.size}</Text>
                                            <Text style={[styles.addonPrice, { right: 50 }]}>Price {item.price}</Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => toggleAddon(index)}
                                        style={[
                                            styles.checkboxSquare,
                                            item.selected && styles.checkboxSelected,
                                        ]}
                                    >
                                        {item.selected && (
                                            <Check color="white" size={16} strokeWidth={3} />
                                        )}
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>
                <View style={styles.fixedCartBar}>
                    <TouchableOpacity style={styles.cartButton} onPress={onPress}>
                        <Text style={styles.cartButtonTxt}>Add to Cart</Text>
                        <Text style={[styles.cartButtonTxt, { color: "#57EBA1", paddingLeft: ms(70) }]}>| </Text>
                        <Text style={styles.cartButtonTxt}>$2.60</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </Modal>
    );
};

export default BottomSheetProductModal;
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(42, 40, 40, 0.9)",
    },

    sheetContainer: {
        width: "100%",
        height: hp(72),
        position: "absolute",
        bottom: 0,
        borderTopLeftRadius: ms(40),
        borderTopRightRadius: ms(40),
        backgroundColor: Colors.white,
        overflow: "hidden",
    },

    imageTopContainer: {
        width,
        height: hp(34),
        borderTopLeftRadius: ms(40),
        borderTopRightRadius: ms(40),
        overflow: "hidden",
    },

    image: {
        width,
        height: hp(34),
        resizeMode: "cover",
    },

    headerAbsolute: {
        position: "absolute",
        top: vs(15),
        width: "100%",

        zIndex: 10,

    },

    dotsAbsolute: {
        position: "absolute",
        bottom: vs(40),
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
    },

    dot: {
        height: ms(8),
        borderRadius: ms(4),
        backgroundColor: Colors.blue,
        marginHorizontal: s(4),
    },

    whiteContainer: {
        flex: 1,
        paddingTop: vs(20),
        backgroundColor: Colors.white,
        borderTopLeftRadius: ms(36),
        borderTopRightRadius: ms(36),
        marginTop: -vs(30),

    },

    discountRow: {
        flexDirection: "row",
        //justifyContent: "space-between",
        alignItems: "center",
        gap: 5
    },

    timeTxt: {
        fontSize: ms(14),
        color: Colors.borderColor1,
        fontFamily: Typography.Regular.fontFamily
    },
    distcounttext: {
        fontSize: ms(12),
        color: Colors.black,
        position: "absolute",
        // top:0,
        // left:0,right:0,
        // bottom:0,
        // textAlign:"center"
        left: 6,
        bottom: 4,
        fontFamily: Typography.SemiBold.fontFamily

    },

    titlePriceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: vs(13),
        alignItems: "center",
        paddingHorizontal: wp(5),
    },

    title: {
        fontSize: ms(19),
        //fontWeight: "600",
        color: Colors.black,
        width: "70%",
        fontFamily: Typography.Medium.fontFamily
    },

    newPrice: {
        fontSize: ms(19),
        // fontWeight: "700",
        color: Colors.Green,
        fontFamily: Typography.SemiBold.fontFamily
    },


    oldPriceWrapper: {
        position: "relative",
        marginRight: s(6),
    },

    oldPrice: {
        fontSize: ms(14),
        color: "#999",
        fontFamily: Typography.Medium.fontFamily

    },

    strikeLine: {
        position: "absolute",
        top: "33%",
        left: 0,
        right: 0,
        height: 1.5,
        backgroundColor: "red",
        borderRadius: 1,
    },

    sectionTitle: {
        fontSize: ms(16),
        fontWeight: "600",
        marginTop: vs(15),
        paddingHorizontal: wp(5),
        fontFamily: Typography.Medium.fontFamily
    },

    desc: {
        fontSize: ms(14),
        marginTop: vs(5),
        color: "#666",
        lineHeight: ms(18),
        paddingHorizontal: wp(5),
        fontFamily: Typography.Regular.fontFamily
    },

    /** ADDONS BOX */
    addonBox: {
        width: "100%",
        backgroundColor: Colors.cardbg,
        // borderRadius: ms(16),
        // padding: vs(10),
        paddingHorizontal: wp(5),
        marginTop: vs(8),
    },

    addonItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: vs(10),
    },

    addonImage: {
        width: ms(55),
        height: ms(55),
        borderRadius: ms(10),
        marginRight: s(12),
    },

    addonTitle: {
        fontSize: ms(15),
        fontWeight: "600",
    },

    addonMeta: {
        fontSize: ms(13),
        color: "#28293D",
        fontFamily: Typography.Regular.fontFamily
    },

    addonPrice: {
        fontSize: ms(13),
        marginTop: vs(4),
        //fontWeight: "600",
        fontFamily: Typography.Regular.fontFamily,
        color: "#28293D",
    },

    checkboxSquare: {
        width: ms(22),
        height: ms(22),
        borderRadius: ms(5),
        borderWidth: 1.6,
        borderColor: Colors.borderColor1,
        alignItems: "center",
        justifyContent: "center",
    },

    checkboxSelected: {
        borderColor: Colors.Green,
        backgroundColor: Colors.Green
    },

    checkmark: {
        fontSize: ms(14),
        color: "white",
        // fontWeight: "900",
    },

    /** FIXED CART BUTTON */
    fixedCartBar: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: Colors.white,
        paddingVertical: vs(12),
        paddingHorizontal: wp(4),
        alignItems: "center",
        borderTopWidth: 1,
        borderColor: Colors.borderColor,
    },

    cartButton: {
        flexDirection: "row",
        width: "90%",
        backgroundColor: Colors.Green,
        paddingVertical: vs(14),
        borderRadius: ms(14),
        alignItems: "center",
        // justifyContent:"space-around"
        paddingLeft: ms(60)
    },

    cartButtonTxt: {
        color: "#fff",
        fontSize: ms(16),

        fontFamily: Typography.Medium.fontFamily
    },
    discountRowandTime: {
        paddingHorizontal: wp(5),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

    },
    addOnRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }
});
