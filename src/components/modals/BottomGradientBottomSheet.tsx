import React, { useRef, useMemo } from "react";
import { StyleSheet, Text } from "react-native";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import GradientContainer from "../Gradient/GradientContainer";
import { ms, vs } from "../../utils/responsive";
import Colors from "../../utils/colors";
const BottomGradientBottomSheet = ({ visible, onClose, children }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["10%", "50%"], []);
  console.log("BottomGradientBottomSheet rendered");
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={visible ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      onClose={onClose}
      handleIndicatorStyle={{ display: 'none' }}
      backgroundStyle={styles.transparentBg}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={1}
          disappearsOnIndex={0}
          pressBehavior="none"
          opacity={0.6}
        />
      )}
    >

      <BottomSheetView style={styles.contentContainer}>
        <GradientContainer borderRadius={ms(40)} style={styles.gradientBox}>
          {children}
        </GradientContainer>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default BottomGradientBottomSheet;
const styles = StyleSheet.create({
  transparentBg: {
    backgroundColor: "transparent",
  },
  gradientBox: {
    flex: 1,
    width: "100%",
    borderTopLeftRadius: ms(40),
    borderTopRightRadius: ms(40),
    overflow: "hidden",
  },
  handle: {
    width: ms(50),
    height: vs(4),
    backgroundColor: Colors.black,
    borderRadius: ms(10),
  },
  contentContainer: {
    flex: 1,
    //  padding: 36,
    //alignItems: 'center',
    height: "100%",

  },
});
