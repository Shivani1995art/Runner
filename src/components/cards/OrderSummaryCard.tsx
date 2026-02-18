import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Phone, MessageSquare, MapPin, MessageSquareText } from "lucide-react-native";
import { Typography } from "../../utils/typography";
import { fontSize, ms } from "../../utils/responsive";
import Colors from "../../utils/colors";
import Waiter from '../../assets/svg/Waiter'
const OrderSummaryCard = ({
    productImage,
    title,
    price,
    qty,
    address,
    boyImage,
    boyName,
    assigned,
}) => {
    return (
        <View style={styles.card}>

            {/* Product Row */}
            <View style={styles.row}>
                <Image source={productImage} style={styles.productImage} />

                <View style={{ flex: 1 }}>
                    <View style={styles.row}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.price}>order Value</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.qty}>{qty}</Text>
                        <Text style={styles.qty}>2.4$</Text>
                    </View>
                </View>
            </View>

            {/* Address */}
            <View style={{ marginTop: 14 }}>
                <Text style={styles.sectionLabel}>Delivery details</Text>

                <Text style={styles.subText}>
                    <MapPin color={Colors.black} size={14} />
                    Address</Text>
                <Text style={styles.address}>{address}</Text>
            </View>

            {/* Delivery Boy */}
            <View style={{ marginTop: 5 }}>

                <View style={{ flexDirection: "row", alignItems: "center" ,gap:4}}>
                    <Waiter />
                    <Text style={styles.subText}>Cabana Boy</Text>
                </View>

                {assigned ? (
                    <View style={styles.boyRow}>
                        <Image source={boyImage} style={styles.boyImage} />

                        <View style={{ flex: 1 }}>
                            <Text style={styles.boyName}>{boyName}</Text>
                        </View>

                        <Phone size={22} color="black" style={{ marginRight: ms(40) }} />
                        <MessageSquareText size={22} color="black" style={{ marginRight: ms(40) }} />
                    </View>
                ) : (
                    <Text style={styles.notAssigned}>Not assigned yet</Text>
                )}
            </View>
        </View>
    );
};

export default OrderSummaryCard;

const styles = StyleSheet.create({
    card: {
        //backgroundColor: "white",
        padding: 16,
        borderRadius: 14,
        // elevation: 3,
        marginVertical: 10,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    productImage: {
        width: 65,
        height: 65,
        borderRadius: 8,
        marginRight: 12,
    },

    title: {
        fontSize: fontSize(14),
        fontFamily: Typography.Regular.fontFamily,
        color: Colors.black
    },

    price: {
        fontSize: fontSize(14),
        fontFamily: Typography.Regular.fontFamily,
        color: Colors.borderColor1
    },

    qty: {
        fontSize: fontSize(14),
        fontFamily: Typography.Regular.fontFamily,
        color: Colors.borderColor1

    },

    sectionLabel: {
        fontFamily: Typography.SemiBold.fontFamily,
        color: Colors.black,
        marginBottom: 4,
    },

    subText: {
        fontSize: fontSize(14),

        marginTop: 4,
        fontFamily: Typography.Medium.fontFamily,
        color: Colors.black,

    },

    address: {
        fontSize: fontSize(13),
        // marginTop: 3,
        fontFamily: Typography.Regular.fontFamily,
        color: Colors.borderColor1,
        marginLeft: 4
    },

    boyRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },

    boyImage: {
        width: 48,
        height: 48,
        borderRadius: 50,
        marginRight: 12,
    },

    boyName: {
        fontSize: fontSize(16),

        fontFamily: Typography.Medium.fontFamily,
        color: Colors.black

    },

    notAssigned: {
        fontSize: fontSize(13),
        // marginTop: 3,
        fontFamily: Typography.Regular.fontFamily,
        color: Colors.black,
        marginTop: 5,
    },
});
