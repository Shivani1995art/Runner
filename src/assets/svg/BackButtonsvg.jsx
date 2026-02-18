import * as React from "react";
import Svg, { Path } from "react-native-svg";
const BackButtonsvg = ({props,fill="white"}) => (
  <Svg
    width={18}
    height={17}
    viewBox="0 0 18 17"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M17.1667 8.5H0.5M0.5 8.5L8.5 0.5M0.5 8.5L8.5 16.5"
      stroke={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default BackButtonsvg;
