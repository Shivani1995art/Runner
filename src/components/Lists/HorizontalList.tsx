import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import UnifiedCard from '../cards/UnifiedCard'
import { fontSize, s, vs } from '../../utils/responsive'
import { Typography } from '../../utils/typography'

import Colors from '../../utils/colors'
import { FlashList } from "@shopify/flash-list";
import axios from 'axios'
const HorizontalList = ({
    data = [],
    navigation,
    onItemPress,
    showName = false,
    isHeart = true,
    containerStyle,
    horizontal = true,
    numColumns = 0,
    showText = true
}) => {


    return (
        <View style={[{ padding: 16, }, containerStyle]}>
            {showText && <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(10), alignItems: 'center', marginBottom: vs(15), }}>
                <Text style={styles.Titletext}>Resort Near You</Text>
                <Text onPress={() => {
                    console.log("See All Pressed");
                }} style={[styles.Titletext, { fontSize: fontSize(12), color: Colors.borderColor1 }]}>See All</Text>
            </View>}
            <FlashList
                data={data}
                keyExtractor={(item) => item?.id}
                horizontal={horizontal}
                numColumns={horizontal ? 1 : numColumns}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                estimatedItemSize={200}
                renderItem={({ item }) => (
                    <UnifiedCard
                        {...item}
                        onPress={() =>
                            onItemPress
                                ? onItemPress(item)
                                : navigation?.navigate("Resort", { item })
                        }
                        onLike={() => console.log("Liked:", item.title)}
                        isHeart={isHeart}
                        isName={showName}
                    />
                )}
                contentContainerStyle={{

                    paddingBottom: vs(90),
                }}
            />
        </View>
    )
}

export default HorizontalList

const styles = StyleSheet.create({
    Titletext: {
        fontFamily: Typography.Medium.fontFamily, fontSize: fontSize(16),
        color: "#28293D",
        fontWeight: "500"
    }
})