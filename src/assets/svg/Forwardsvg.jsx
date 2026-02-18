import * as React from "react";
import Svg, { Path } from "react-native-svg";
const Forwardsvg = (props) => (
  <Svg
    width={32}
    height={32}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M10.6673 16H21.334M21.334 16L16.6673 11.3334M21.334 16L16.6673 20.6667"
      stroke="#28293D"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15.9993 29.3333C23.3631 29.3333 29.3327 23.3638 29.3327 16C29.3327 8.63619 23.3631 2.66666 15.9993 2.66666C8.63555 2.66666 2.66602 8.63619 2.66602 16C2.66602 23.3638 8.63555 29.3333 15.9993 29.3333Z"
      stroke="#28293D"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default Forwardsvg;
