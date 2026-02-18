import React, { useRef, useEffect, useState } from "react";
import { View, FlatList, Image, Dimensions, StyleSheet, Animated } from "react-native";
import { vs } from "../../utils/responsive";

const { width } = Dimensions.get("window");
const CENTER_WIDTH = width * 0.8; // center image width
const SIDE_WIDTH = width * 0.1;   // previous/next partial visibility
const ITEM_SPACING = 10;          // space between items
const images = [
  "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&h=400&w=600",
  "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&h=400&w=600",
  "https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&cs=tinysrgb&h=400&w=600",
  "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&h=400&w=600",
  "https://images.pexels.com/photos/2232/vegetables-italian-pizza-restaurant.jpg?auto=compress&cs=tinysrgb&h=400&w=600",
  "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&h=400&w=600",
  "https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&h=400&w=600",
  "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&h=400&w=600",
  "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&h=400&w=600",
  "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&h=400&w=600",
];


export default function ImageCarousel() {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= images.length) nextIndex = 0;
      setCurrentIndex(nextIndex);
      flatListRef?.current.scrollToOffset({
        offset: nextIndex * (CENTER_WIDTH + ITEM_SPACING),
        animated: true,
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [currentIndex]);
  const scrollX = useRef(new Animated.Value(0)).current;
  return (
    <View style={styles.container}>
      <Animated.FlatList
       ref={flatListRef} 
        data={images}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: SIDE_WIDTH }}
        snapToInterval={CENTER_WIDTH + ITEM_SPACING}
        decelerationRate="fast"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * (CENTER_WIDTH + ITEM_SPACING),
            index * (CENTER_WIDTH + ITEM_SPACING),
            (index + 1) * (CENTER_WIDTH + ITEM_SPACING),
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.85, 1, 0.85],
            extrapolate: "clamp",
          });

          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [10, 0, 10],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              style={{
                width: CENTER_WIDTH,
                alignItems: "center",
                marginHorizontal: ITEM_SPACING / 2,
                transform: [{ scale }, { translateY }],
              }}
            >
              <Image
                source={{ uri: item }}
                style={[styles.image, { height: vs(130), width: "100%" }]}
              />
            </Animated.View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: vs(15),
  
  },
  image: {
    borderRadius: 20,
  },
});
