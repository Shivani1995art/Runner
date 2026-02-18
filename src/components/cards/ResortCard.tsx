import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Heartsvg from "../../assets/svg/Heartsvg";
import Location1svg from "../../assets/svg/Location1svg";
import Location2svg from "../../assets/svg/Location2svg";
import { fontSize, hp, ms, vs } from "../../utils/responsive";
import Colors from "../../utils/colors";
import { Typography } from "../../utils/typography";
export default function ResortCard({ image, title, location, type, distance }) {
    console.log("image", image.uri);
    return (
        <View style={styles.card}>
            <View style={styles.imageWrapper}>
                <Image source={{ uri: image?.uri }} style={styles.image} />
                <TouchableOpacity style={styles.heartBtn}>
                    <Heartsvg
                        width={32}
                        height={32}
                        fill="white"
                    />
                </TouchableOpacity>
                <Heartsvg />
            </View>

            <View style={styles.info}>
                <View style={styles.row}>
                    <Text style={styles.type}>{type}</Text>
                    <View style={styles.locationrow}>
                        <Location1svg />
                        <Text style={[styles.distanceText]}>Distance</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.distance}>{distance}</Text>
                </View>
                <View style={styles.locRow}>
                    <Text style={styles.location}>Location</Text>
                    <Location2svg />

                </View>
                <Text style={[styles.location, { fontFamily: Typography.Medium.fontFamily }]} >{location}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        borderRadius: 20,
        width: "90%",
        alignSelf: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 15 },
        shadowRadius: 10,
        elevation: 5,
        flex: 1,

        minHeight: hp(30),
        paddingBottom: vs(16),
    },
    imageWrapper: {
        height: ms(140),
        borderRadius: 20,
        justifyContent: "center",
        alignItems: 'center',
        marginTop: vs(18),

    },
    image: {
        width: "90%",
        height: "100%",
        borderRadius: 20,
        borderWidth: 0.4,
        borderColor: Colors.borderColor,
        resizeMode: "cover"

    },
    heartBtn: {
        position: "absolute",
        right: ms(20),
        top: 0,
        padding: 8,
        backgroundColor: "rgba(79, 76, 76, 0.95)",
        borderRadius: ms(18),
    },
    info: {
        paddingHorizontal: 16,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
       
    },
    type: {
        color: Colors.borderColor1,
        fontSize: 14,
        fontFamily: Typography.Light.fontFamily,
    },
    distance: {
        color: Colors.black,
        fontWeight: "500",
        fontSize:fontSize(14)

    },
    distanceText: { color: Colors.borderColor1, },

    title: {
        marginTop: 6,
        fontSize: 18,
        fontFamily: Typography.Medium.fontFamily,
        //   backgroundColor: "red",
        fontWeight: "500",

    },
    locRow: {
        flexDirection: "row",
        marginTop: 8,
        alignItems: "center",
    },
    location: {
        marginLeft: 0,
        color: "#555",
        fontSize: fontSize(14),
        fontFamily: Typography.Light.fontFamily,


    },
    locationrow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 4,
        alignItems:"center",

    }
});
