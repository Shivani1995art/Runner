import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Colors from "../../utils/colors";
import { ms } from "../../utils/responsive";
import { Typography } from "../../utils/typography";

const timeOptions = [
    "15 Minutes",
    "30 Minutes",
    "1 hour",
    "1:30 hour",
    "2 hour",
    "2:30 hour",
    "3 hour",
    "3:30 hour",
    "4 hour",
    "4:30 hour",
    "5 hour",
    
];

const { width } = Dimensions.get("window");
const numColumns = 3; // number of columns in grid
const itemWidth = width / numColumns - 20; // item width with spacing
const TimeGrid = ({ selected,onSelect }) => {
    console.log("isSelected ==>",selected)
    return (
        <FlatList
            data={timeOptions}
            keyExtractor={(item, index) => index.toString()}
            numColumns={numColumns}
            renderItem={({ item }) => {
                const isSelected = selected === item;
               return(
                <TouchableOpacity
                style={[styles.itemContainer, isSelected && {
                    backgroundColor: Colors.orange,
                    borderColor: Colors.orange,
                } ]}
                onPress={() => onSelect(item)}
            >
                <Text style={[styles.itemText,   { color: isSelected ? Colors.white : Colors.black }]}>{item}</Text>
            </TouchableOpacity>
               )
            }}
            contentContainerStyle={styles.listContainer}
        />
    );
};

export default TimeGrid;

const styles = StyleSheet.create({
    listContainer: {
        padding: 10,
        justifyContent: "center",
    },
    itemContainer: {

        padding: ms(16),
        margin: 5,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: Colors.borderColor1,
    

    },
    itemText: {
        fontSize: 16,
        color:Colors.black,
        textAlign: "center",
        fontFamily:Typography.Medium.fontFamily
    },
});
