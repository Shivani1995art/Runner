import * as React from "react";
import Svg, { Path } from "react-native-svg";

const Eyeclosesvg = ({ color = "#28293D", ...props }) => (
  <Svg
    width={32}
    height={32}
    viewBox="0 0 32 32"
    fill="none"
    {...props}
  >
    <Path
      d="M4 4L28 28"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 14.2361C13.5851 14.7062 13.3334 15.3237 13.3334 16C13.3334 17.4727 14.5273 18.6666 16 18.6666C16.6763 18.6666 17.2938 18.4149 17.7639 18"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.8158 10.0815C7.57336 11.653 5.70525 13.8919 4 16.0001C6.51808 19.9881 11.0423 24.0001 16 24.0001C18.0666 24.0001 20.0578 23.303 21.8598 22.2011"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 8C21.3445 8 24.9353 12.2109 28 16C27.5754 16.6724 27.0938 17.3455 26.5627 18"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default Eyeclosesvg;
