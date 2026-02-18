import * as React from "react";
import Svg, { G, Circle, Path, Defs } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const Facebooksvg = (props) => (
  <Svg
    width={31}
    height={28}
    viewBox="0 0 31 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G filter="url(#filter0_d_1_7592)">
      <Circle cx={15.2881} cy={12.305} r={12.305} fill="#0A66C2" />
      <Path
        d="M16.6525 20.4424V13.3628H19.0289L19.3846 10.6038H16.6525V8.84215C16.6525 8.04333 16.8743 7.49895 18.0199 7.49895L19.4809 7.49831V5.03064C19.2281 4.997 18.3609 4.92188 17.3519 4.92188C15.2454 4.92188 13.8033 6.20766 13.8033 8.569V10.6038H11.4208V13.3628H13.8033V20.4424H16.6525Z"
        fill="white"
      />
    </G>
    <Defs></Defs>
  </Svg>
);
export default Facebooksvg;
// export default Facebooksvg;