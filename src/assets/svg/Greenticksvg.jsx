import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";
const Greenticksvg = (props) => (
  <Svg
    width={14}
    height={14}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle cx={7} cy={7} r={6.5} fill="#06C270" stroke="#06C270" />
    <Path
      d="M4.66699 7L6.34863 8.68164L10.2015 4.82874"
      stroke="white"
      strokeWidth={0.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default Greenticksvg;
