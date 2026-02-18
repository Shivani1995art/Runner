import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,

  ViewStyle,
  TextStyle,
  StyleProp,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fontSize } from "../../utils/responsive";
import { Typography } from "../../utils/typography";

interface CustomHeaderProps {
  title?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  safeArea?: boolean;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title = "",
  leftComponent = null,
  rightComponent = null,
  containerStyle = {},
  titleStyle = {},
  safeArea = true,
}) => {

  const Wrapper = safeArea ? SafeAreaView : View;

  return (
    <Wrapper style={styles.safeArea}>
      <View style={[styles.container, containerStyle]}>
        
        {/* LEFT COMPONENT */}
        <View style={styles.sideBox}>{leftComponent}</View>

        {/* CENTER TITLE */}
        <View style={styles.titleWrapper}>
          <Text numberOfLines={1} style={[styles.title, titleStyle]}>
            {title}
          </Text>
        </View>

        {/* RIGHT COMPONENT */}
        <View style={styles.sideBox}>{rightComponent}</View>

      </View>
    </Wrapper>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  safeArea: {
   // backgroundColor: "#fff",
  },
  container: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  //  backgroundColor: "#fff",

    
  },
  sideBox: {
    width: 50, // fixes layout: keeps title centered
    justifyContent: "center",
    alignItems: "center",
  },
  titleWrapper: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: fontSize(24),
    fontWeight: "500",
    color: "#000",
    fontFamily:Typography.Medium.fontFamily
  },
});
