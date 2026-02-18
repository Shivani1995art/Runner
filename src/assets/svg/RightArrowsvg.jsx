import * as React from "react";
import Svg, { Path } from "react-native-svg";
const RightArrowsvg = (props) => (
  <Svg
    width={10}
    height={18}
    viewBox="0 0 10 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M0.75 0.75L8.75 8.75L0.75 16.75"
      stroke="#8F90A6"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default RightArrowsvg;
