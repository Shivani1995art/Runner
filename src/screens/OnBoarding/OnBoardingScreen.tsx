import { Dimensions, FlatList, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useRef, useState } from 'react'
import Colors from '../../utils/colors'
import { fontSize, vs, ms } from '../../utils/responsive'
import { Typography } from '../../utils/typography'
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

const ONBOARDING_KEY = 'ONBOARDING_VERSION';
const slides = [
    {
        id: '1',
        title: 'Welcome to Effortless Delivery',
        description: 'Built to simplify your workflow from order acceptance to final delivery.',
        image: require('../../assets/images/onboarding1.webp')

    },
    {
        id: '2',
        title: 'Fast & Reliable Deliveries',
        description: 'Deliver items with confidence using clear instructions and one-tap completion.',
        image: require('../../assets/images/onboarding2.webp')
    },
    {
        id: '3',
        title: 'Track Now Your Performance',
        description: 'Monitor your daily activity and completed deliveries to stay on top of your progress',
        image: require('../../assets/images/onboarding3.webp')
    }
]
const { width, height } = Dimensions.get("window");
const OnboardingScreen = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const slidesRef = useRef(null);

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        setCurrentIndex(viewableItems[0]?.index || 0);
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

const handleNext = async () => {
    if (currentIndex < slides.length - 1) {
        slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
        await AsyncStorage.setItem(ONBOARDING_KEY, DeviceInfo.getVersion());
        navigation.replace("Login");
    }
};
    const handleSkip = () => {
        navigation.replace("Login");
    };

    const renderItem = ({ item }) => (
        <View style={[styles.slide, { width, height }]}>

            <Image
                source={item.image}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
            />

            {/* Overlay content */}
            <View style={styles.overlay}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description} >{item.description}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={slides}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                bounces={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewConfig}
                ref={slidesRef}
                initialNumToRender={1}
                windowSize={2}
                removeClippedSubviews={true} // important for performance
            />

            {/* Bottom controls */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>

                <View style={styles.pagination}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                currentIndex === index && styles.activeDot,
                            ]}
                        />
                    ))}
                </View>

                <TouchableOpacity onPress={handleNext} style={[styles.nextButton, { backgroundColor: currentIndex === slides.length - 1 ? Colors.blue : Colors.orange }, { borderColor: currentIndex === slides.length - 1 ? Colors.blue : Colors.orange, }]}>
                    <Text style={styles.nextText}>
                        {currentIndex === slides.length - 1 ? "Let's Go" : "Next"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F7F3EE" },
    slide: {
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    overlay: {
        position: "absolute",
        top: "70%", // adjust as needed
        width: "100%",
        paddingHorizontal: 30,
        alignItems: "center",

    },
    title: {
        fontSize: fontSize(24),
        fontWeight: "700",
        color: Colors.black1,
        textAlign: "center",
        marginBottom: 8,
        fontFamily: Typography.Bold.fontFamily,

    },
    description: {
        fontSize: 15,
        color: Colors.borderColor1,
        textAlign: "center",
        fontFamily: Typography.Light.fontFamily,
        fontWeight: "300",
        marginTop: vs(10),
        maxWidth: "80%"
    },
    bottomContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        position: "absolute",
        bottom: 40,
        left: 25,
        right: 25,
    },
    skipButton: {
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 16,
        fontFamily: Typography.SemiBold.fontFamily,
    },
    skipText: { color: Colors.black1, fontSize: 15, fontFamily: Typography.SemiBold.fontFamily, fontWeight: "600" },
    nextButton: {
        borderWidth: 1,
        backgroundColor: "#000",
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 16,
        fontFamily: Typography.SemiBold.fontFamily,


    },
    nextText: { color: "#fff", fontSize: 15, fontWeight: "600", fontFamily: Typography.SemiBold.fontFamily },
    pagination: { flexDirection: "row", alignItems: "center" },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.orange2,
        marginHorizontal: 4,
    },
    activeDot: { backgroundColor: Colors.blue, width: 10 },
});
