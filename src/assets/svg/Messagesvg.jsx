import * as React from "react";
import Svg, { Path } from "react-native-svg";
const Messagesvg = (props) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M6 7.5L9 7.5L12 7.5"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6 10.5L7.5 10.5L9 10.5"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 10.3661 1.86523 11.6468 2.50337 12.75L1.875 16.125L5.25 15.4966C6.35315 16.1348 7.63392 16.5 9 16.5Z"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default Messagesvg;
