import React from "react";
import { StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
export default function GradientContainer({
  children,
  style,
  colors = ['#FFF7D0', '#FFFFFF'], 
  locations = [0, 0.7],
  borderRadius = 0, 

}) {
  return (
    <LinearGradient
      colors={colors}
      locations={locations}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1.1 }}
      style={[styles.container, style, { borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    
    overflow: 'hidden',
   // padding: 20,
   
  },
});
