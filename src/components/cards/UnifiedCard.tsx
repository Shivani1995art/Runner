import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Heart, Icon, Map, MapPin, Clock3 } from "lucide-react-native";
import Colors from "../../utils/colors";
import { ms, vs, s, fontSize } from "../../utils/responsive";
import { Typography } from "../../utils/typography";
import Leafsvg from '../../assets/svg/Leafsvg'
import RedDotsvg from '../../assets/svg/RedDotsvg'
import Discountbgsvg from "../../assets/svg/Discountbgsvg";
import FastImage from "@d11/react-native-fast-image";
export default function UnifiedCard({
    image,
    title,
    subtitle,
    tag,
    discount,
    time,
    oldPrice,
    price,
    location,
    distance,
    type, // "product" | "restaurant" | "resort"
    onPress,
    onLike,
    foodType,
    isHeart = true,
    isName = false,
}) {
    const [qty, setQty] = useState(0);
    const renderFoodTypeIcon = (foodType) => {
        console.log("foodTYpe", foodType)
        switch (foodType) {
            case "veg":
                return <RedDotsvg width={16} height={16} stroke="green" dotfill="green" />;
            case "non-veg":
                return <RedDotsvg width={16} height={16} stroke="red" dotfill="red" />;
            case "vegan":
                return <Leafsvg width={16} height={16} />;
            default:
                return null;
        }
    };

    console.log("image in card", image);
    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.card}
            activeOpacity={0.9}
        >

            <View style={styles.imageContainer}>
                <FastImage source={{
                    uri: image,
                    priority: FastImage.priority.high,
                }} style={styles.image} resizeMode={FastImage.resizeMode.cover} />

                {isHeart && <TouchableOpacity onPress={onLike} style={styles.likeBtn}>
                    <Heart color="white" size={18} />
                </TouchableOpacity>}


                {discount && type === "product" && (
                    <View style={styles.discountTag}>
                        <Discountbgsvg width={"100%"} height={"100%"} />

                        <View style={styles.discountContent}>
                            <Text style={styles.discountText}>{discount} OFF</Text>
                        </View>
                    </View>
                )}

            </View>


            <View style={styles.content}>

                {tag && <Text style={styles.tagText}>{tag}</Text>}


                {isName && <Text style={styles.regularTextStyle}>Name</Text>}
                <Text style={styles.title} numberOfLines={1}>
                    {title}
                </Text>


                {subtitle && type === "restaurant" && (
                    <Text style={styles.subtitle} numberOfLines={1}>
                        {subtitle}
                    </Text>
                )}


                {time && type === "product" && (
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={styles.timeRow}>
                            <Clock3 size={14} color="black" />
                            <Text style={styles.timeText}>{time}</Text>

                        </View>
                        {foodType && (
                            <View style={{ justifyContent: "flex-end", alignSelf: "flex-start" }}>
                                {renderFoodTypeIcon(foodType)}
                            </View>
                        )}
                    </View>
                )}

                {/* Resort Location */}
                {location && type === "resort" && (
                    <>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                            <Text style={styles.regularTextStyle}>Location</Text>
                            <MapPin size={14} color={Colors.borderColor1} />
                        </View>
                        <Text style={[styles.title, { fontSize: fontSize(12) }]} numberOfLines={2}>
                            {location}
                        </Text>
                    </>
                )}


                {type === "product" && (
                    <View style={styles.priceAndBtnRow}>


                        <View style={styles.priceContainer}>
                            {oldPrice && (
                                <View style={styles.oldPriceWrapper}>
                                    <Text style={styles.oldPrice}>{oldPrice}</Text>
                                    <View style={styles.strikeLine} />
                                </View>
                            )}

                            <Text style={styles.newPrice}>{price}</Text>
                        </View>


                        {qty === 0 ? (
                            <TouchableOpacity style={styles.addBtn} onPress={() => setQty(1)}>
                                <Text style={styles.addBtnText}>ADD</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.counterBox}>
                                <TouchableOpacity style={styles.counterBtn} onPress={() => setQty(qty - 1)}>
                                    <Text style={styles.counterText}>-</Text>
                                </TouchableOpacity>

                                <Text style={styles.counterValue}>{qty}</Text>

                                <TouchableOpacity style={styles.counterBtn} onPress={() => setQty(qty + 1)}>
                                    <Text style={styles.counterText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}




                {distance && type === "resort" && (
                    <>
                        <View style={styles.row}>
                            <Text style={styles.regularTextStyle}>Distance</Text>
                            <Map size={14} color={Colors.borderColor1} />
                        </View>
                        <Text style={[styles.title, { fontSize: fontSize(12) }]}>{distance}</Text>
                    </>

                )}
            </View>

            {/* PRODUCT ADD BUTTON */}
            {/* {type === "product" && (
                <TouchableOpacity style={styles.addBtn}>
                    <Text style={styles.addBtnText}>ADD</Text>
                </TouchableOpacity>
            )} */}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: ms(165),
        backgroundColor: Colors.cardbg,
        borderRadius: ms(16),
        padding: s(8),
        marginRight: s(10),
        marginBottom: vs(12),

    
    },
    imageContainer: {
        width: "100%",
        height: vs(110),
        borderRadius: ms(14),
        overflow: "hidden",
        position: "relative",
    },

    image: {
        width: "100%",
        height: "100%",
    },

    likeBtn: {
        position: "absolute",
        top: s(6),
        right: s(6),
        padding: s(4),
        backgroundColor: "rgba(23, 22, 22, 0.4)",
        borderRadius: ms(13),
        width: ms(38),
        height: ms(38),
        justifyContent: 'center',
        alignItems: "center"
    },

    discountTag: {
        position: "absolute",
        left: s(-1),
        bottom: s(6),
        width: ms(60),        // give some width
        height: ms(20),       // give some height
        justifyContent: "center",
        alignItems: "center",
    },

    discountContent: {
        position: "absolute",
        zIndex: 10,
    },

    discountText: {
        fontSize: fontSize(10),
        fontWeight: "700",
        color: "black",
    },

    content: {
        marginTop: vs(8),
    },

    tagText: {
        fontSize: ms(10),
        color: "#8F90A6",
    },

    title: {
        fontSize: fontSize(16),
        color: Colors.black,
        fontFamily: Typography.Medium.fontFamily,
        fontWeight: "500"
    },

    subtitle: {
        fontSize: ms(12),
        color: "#777",
        marginTop: vs(2),
    },

    timeText: {
        fontSize: ms(11),
        color: Colors.black,
        marginTop: vs(2),
        fontFamily: Typography.Regular.fontFamily


    },
    timeRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: vs(2),

    },

    locationText: {
        fontSize: ms(11),
        color: "#777",
        marginTop: vs(2),
    },

    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: vs(4),
    },


    oldPriceWrapper: {
        position: "relative",
        marginRight: s(6),

    },

    oldPrice: {
        fontSize: ms(12),
        color: Colors.black,
        fontFamily: Typography.Regular.fontFamily
    },
    strikeLine: {
        position: "absolute",
        top: "25%",
        left: 0,
        right: 0,
        height: 1.5,
        backgroundColor: "red",
        borderRadius: 1,
    },
    newPrice: {
        fontSize: ms(16),
        color: "#06C270",
        fontWeight: "600",
    },
    distanceText: {
        fontSize: ms(11),
        color: "#666",
        marginTop: vs(4),
    },
    counterBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#06C270",
        borderRadius: ms(18),
        paddingHorizontal: s(6),
        paddingVertical: s(3),
    },

    counterBtn: {
        paddingHorizontal: s(6),
        paddingVertical: s(2),

    },

    counterText: {
        fontSize: ms(14),
        fontWeight: "600",
        color: "white",
    },

    counterValue: {
        fontSize: ms(13),
        fontWeight: "700",
        marginHorizontal: s(4),
        color: "white",
    },

    addBtn: {
        backgroundColor: "#06C270",
        paddingHorizontal: s(14),
        paddingVertical: s(6),
        borderRadius: ms(18),
    },

    addBtnText: {
        color: "white",
        fontWeight: "600",
        fontSize: ms(13),
    },

    row:
        { flexDirection: 'row', alignItems: 'center', gap: 3 },
    regularTextStyle: {
        fontFamily: Typography.Light.fontFamily,
        color: Colors.borderColor1
    },
    priceAndBtnRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: vs(8),
    },

});
