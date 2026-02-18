import React, { useState } from "react";
import { View, FlatList, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { vs, ms, s, wp, hp, fontSize } from "../../utils/responsive";
import Colors from "../../utils/colors";
import { Typography } from "../../utils/typography";

// Sample data (20 items + "All" first)
const colorPalette = [
  Colors.cyan,
  Colors.orange2,

  Colors.orange,
  Colors.blue,
  Colors.green2,
  Colors.red1,
  Colors.teal,
  Colors.seagreen,
  Colors.blue1,
  Colors.orange1,
  Colors.seagreen2,
];

const foodNames = [
  "Burger",
  "Pizza",
  "Pasta",
  "Sushi",
  "Salad",
  "Fries",
  "Taco",
  "Sandwich",
  "Hotdog",
  "Steak",
  "Noodles",
  "Dumplings",
  "Ice Cream",
  "Cake",
  "Muffin",
  "Coke",
  "Beer",
  "Wine",
  "Coffee",
  "Tea",
];

const data = [
  {
    id: "0",
    name: "All",
    image: null, 
    bgColor:"#FCCC75",
  },
  ...foodNames.map((name, index) => ({
    id: (index + 1).toString(),
    name,
    image: `https://picsum.photos/100/100?random=${index + 1}`,
 bgColor: colorPalette[index % colorPalette.length],
  })),
];

export default function FilterList({items}) {
  const [selectedId, setSelectedId] = useState("0");
  return (
    <View style={styles.container}>
      <FlatList
        data={items  || data}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: wp(3) }}
        renderItem={({ item }) => {
          const hasImage = !!item.image;
          const isSelected = selectedId === item.id;
          return (
            <TouchableOpacity
            
            onPress={()=>setSelectedId(item.id)}
              style={[
                styles.itemContainer,
                {     backgroundColor: isSelected ? Colors.cyan : item.bgColor ,borderWidth:!isSelected? item.borderWidth:0,borderColor:item.borderColor},
                { justifyContent: hasImage ? "flex-start" : "center" },
              ]}
            >
              {hasImage  && <Image source={{ uri: item.image }} style={styles.itemImage} />}
              <Text style={[styles.itemText]}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: vs(20),
  },
  itemContainer: {
    flexDirection: "row",
    minWidth: ms(100), // width 100ms
    height: vs(40), // height 40vs
    borderRadius: ms(25),
    marginHorizontal: s(5),
    alignItems: "center",
    paddingHorizontal: s(10),
    alignSelf: "flex-start",
   
    
  },
  itemImage: {
    width: ms(35),
    height: ms(35),
    borderRadius: ms(18),
    marginRight: s(5),
  },
  itemText: {
    color: Colors.black,
    fontSize:fontSize(16),
    fontFamily:Typography.Medium.fontFamily,
    fontWeight:"500",
  

   
  
  

  },
});
