
import React, { useRef, useMemo, useCallback } from "react";
import { StyleSheet } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import GradientContainer from "../Gradient/GradientContainer";
import { ms, vs } from "../../utils/responsive";

interface BottomGradientBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxHeightPercentage?: number; // fully expanded, e.g. 0.60
  minHeightPercentage?: number; // peek height, e.g. 0.15
}

const BottomGradientBottomSheet = ({
  visible,
  onClose,
  children,
  maxHeightPercentage = 0.60,
  minHeightPercentage = 0.15, // ← peek: just enough to show drag handle + title
}: BottomGradientBottomSheetProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // 3 snap points:
  // 0 = peek (just the handle + header visible)
  // 1 = mid (40%)
  // 2 = full (maxHeightPercentage)
  const snapPoints = useMemo(
    () => [
      `${Math.round(minHeightPercentage * 100)}%`,   // peek
      `${Math.round(maxHeightPercentage * 100)}%`,   // full
    ],
    [minHeightPercentage, maxHeightPercentage]
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={1}       // backdrop only when fully open
        disappearsOnIndex={0}    // fade out when at peek
        pressBehavior="collapse" // tap backdrop → collapse to peek
        opacity={0.4}
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      // ── index 0 = peek, index 1 = full open ────────────────────────────
      index={visible ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose={false}   // cannot close fully — must deliver first
      onClose={onClose}
      // ── Custom handle drawn by children (modalLine) ─────────────────────
      handleComponent={() => null}
      backgroundStyle={styles.transparentBg}
      backdropComponent={renderBackdrop}
      // ── Drag enabled ────────────────────────────────────────────────────
      enableHandlePanningGesture={true}
      enableContentPanningGesture={true}
      android_keyboardInputMode="adjustResize"
      keyboardBehavior="fillParent"
      keyboardBlurBehavior="restore"
      animateOnMount={true}
    >
      <GradientContainer borderRadius={ms(40)} style={styles.gradientBox}>
        <BottomSheetScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          bounces={true}
        >
          {children}
        </BottomSheetScrollView>
      </GradientContainer>
    </BottomSheet>
  );
};

export default BottomGradientBottomSheet;

const styles = StyleSheet.create({
  transparentBg: {
    backgroundColor: "transparent",
    shadowColor: "transparent",
    elevation: 0,
  },
  gradientBox: {
    flex: 1,
    borderTopLeftRadius: ms(40),
    borderTopRightRadius: ms(40),
    overflow: "hidden",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1, // Important: Allows content to expand
    paddingHorizontal: ms(16),
    marginBottom: ms(2),
  },
});