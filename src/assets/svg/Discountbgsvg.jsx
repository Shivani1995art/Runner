import * as React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { Color } from "react-native/types_generated/Libraries/Animated/AnimatedExports";
import Colors from "../../utils/colors";
const Discountbgsvg = (props) => (
  <Svg
    width={71}
    height={24}
    viewBox="0 0 71 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M0 24H71V23.9766L64 19.9385L70.8799 15.9697L64 12L70.8789 8.03125L64 4.0625L71 0.0234375V0H0V24Z"
      fill="url(#paint0_linear_1_22905)"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_1_22905"
        x1={70.8389}
        y1={12}
        x2={-9.16113}
        y2={12}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#FDED72" />
        <Stop offset={1} stopColor={Colors.aquablue} />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default Discountbgsvg;
