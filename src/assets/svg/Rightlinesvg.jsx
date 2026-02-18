import * as React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
const Rightlinesvg = (props) => (
  <Svg
    width={98}
    height={1}
    viewBox="0 0 98 1"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M98 0.5L0 0V1L98 0.5Z"
      fill="url(#paint0_linear_1_7584)"
      fillOpacity={0.75}
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_1_7584"
        x1={6.26377e-7}
        y1={1.00019}
        x2={92.5}
        y2={1.00013}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#8F90A6" />
        <Stop offset={1} stopColor="#8F90A6" stopOpacity={0} />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default Rightlinesvg;
// export default Rightlinesvg;