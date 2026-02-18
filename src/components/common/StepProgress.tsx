import React from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import Colors from "../../utils/colors";
import Bagsvg from '../../assets/svg/Bagsvg'
const StepProgress = ({ progress = 0 }) => {
    const steps = [
        require("../../assets/Images/4.png"),
        require("../../assets/Animation/cooking.json"),
        require("../../assets/Animation/waiter.json"),
        require("../../assets/Animation/eat.json"),
    ];

    return (
        <View style={styles.row}>
            {steps.map((icon, index) => {
                const isCurrent = progress === index;
                const isDone = progress > index;
                const isUpcoming = progress < index;
                const isLast = index === steps.length - 1;

                return (
                    <View key={index} style={styles.stepWrapper}>

                        {/* Circle */}
                        <View
                            style={[
                                styles.circle,
                                {
                                    backgroundColor:
                                      index=== 0 ?Colors.cyan:
                                    isCurrent
                                        ? "white"
                                        : isDone
                                            ? Colors.cyan
                                            : "#FFE87A",

                                    borderColor: isCurrent ? Colors.cyan : "transparent",
                                    borderWidth: isCurrent ? 2 : 0,
                                },
                            ]}
                        >
                            {index === 0 ? (
                                <Bagsvg />
                            ) : (
                                <LottieView
                                    source={icon}
                                    autoPlay={isCurrent}
                                    loop={true}
                                    progress={isDone ? 1 : isUpcoming ? 0 : undefined}
                                    style={styles.lottie}
                                />
                            )}
                        </View>

                        {/* Lines... */}
                        {!isLast && (
                            <View style={styles.lineContainer}>
                                <View style={[styles.lineBackground]} />

                                <View
                                    style={[
                                        styles.lineFill,
                                        { backgroundColor: isDone ? Colors.cyan : "#FFE97A" },
                                    ]}
                                />
                            </View>
                        )}
                    </View>
                );
            })}

        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10
    },

    stepWrapper: {
        flexDirection: "row",
        alignItems: "center",
    },

    circle: {
        width: 60,
        height: 60,
        borderRadius: 999,
        justifyContent: "center",
        alignItems: "center",
    },

    lottie: {
        width: 40,
        height: 40,

    },

    lineContainer: {

        width: 50, // distance between circles
        height: 6,
        // marginHorizontal: 4,
        justifyContent: "center",
    },

    lineBackground: {
        position: "absolute",
        height: 6,
        width: "100%",
        borderRadius: 4,
    },

    lineFill: {
        height: 6,
        width: "100%",
        borderRadius: 4,
    },
});

export default StepProgress;
