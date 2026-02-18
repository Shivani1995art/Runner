import { StyleSheet } from "react-native";

export const Fonts = {
  InterRegular: "Inter_24pt-Regular",
  InterItalic: "Inter_24pt-Italic",
  InterLight: "Inter_24pt-Light",
  InterBold: "Inter_18pt-Bold",
  InterBoldItalic: "Inter_18pt-BoldItalic",
  InterExtraBold: "Inter_18pt-ExtraBold",
  InterSemiBold: "Inter_28pt-SemiBold",
  JosefinSans_Regular:"JosefinSans-Regular",
  JosefinSans_BoldItalic:'JosefinSans-BoldItalic',
  JosefinSans_Bold:"JosefinSans-Bold",
  JosefinSans_SemiBold:"JosefinSans-SemiBold",
  JosefinSans_Medium:"JosefinSans-Medium",
  JosefinSans_MediumItalic:"JosefinSans-MediumItalic",
  Inter_28pt_Medium:"Inter_28pt-Medium",
  Inter_28pt_MediumItalic:"Inter_28pt-MediumItalic"

};

export const Typography = StyleSheet.create({
  Regular: {
    fontFamily: Fonts.InterRegular,
  },
  Italic: {
    fontFamily: Fonts.InterItalic,
  },
  Light: {
    fontFamily: Fonts.InterLight,
  },
  Bold: {
    fontFamily: Fonts.InterBold,
  },
  BoldItalic: {
    fontFamily: Fonts.InterBoldItalic,
  },
  ExtraBold: {
    fontFamily: Fonts.InterExtraBold,
  },
  SemiBold: {
    fontFamily: Fonts.InterSemiBold,
  },
  Medium:{
    fontFamily:Fonts.Inter_28pt_Medium
  },
  MediumItalic:{
    fontFamily:Fonts.Inter_28pt_MediumItalic
  }
});
