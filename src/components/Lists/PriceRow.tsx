import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../../utils/colors";
import { fontSize } from "../../utils/responsive";


const PriceRow = ({ label, value, isLast = false ,textStyle}) => {
   return (
      <>
         <View style={styles.row}>
            <Text style={[styles.label,textStyle]}>{label}</Text>
            <Text style={[styles.value,textStyle]}>{value}</Text>
         </View>

         {!isLast && <View style={styles.divider} />}
      </>
   );
};

const styles = StyleSheet.create({
   row: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 6,
   },

   label: {
      color: Colors.gray,
      fontSize: fontSize(13),
   },

   value: {
      color: Colors.black,
      fontSize: fontSize(13),
   },

   divider: {
      height: 1,
      backgroundColor: Colors.borderColor,
      marginVertical: 6,
   }
});

export default PriceRow;
